import { expect } from "chai";
import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';

const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
const TEST_RATIO = 100n
const TEST_PRICE = 10n
const TEST_ETH_PAYMENT_SIZE = parseEther("10")
const TEST_AMOUNT_TO_BURN = (TEST_ETH_PAYMENT_SIZE * TEST_RATIO) / 2n;


describe("NFT Shop", async () => {
    async function deployTokenSaleFixture() {
        const publicClient = await viem.getPublicClient();
        const [deployer, account1, account2] = await viem.getWalletClients()
        const token = await viem.deployContract('MyToken');
        const nft = await viem.deployContract('MyNFT');
        const tokenSale = await viem.deployContract('TokenSale', [
            TEST_RATIO,
            TEST_PRICE,
            token.address,
            nft.address
        ]);
        const grantMinterRoleTokenTx = await token.write.grantRole([
            MINTER_ROLE,
            tokenSale.address,
        ]);
        await publicClient.waitForTransactionReceipt({
            hash: grantMinterRoleTokenTx,
        });
        return { publicClient, tokenSale, token, nft, deployer, account1, account2 }
    }

    describe("When the Shop contract is deployed", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const {tokenSale} = await loadFixture(deployTokenSaleFixture);
            const ratio = await tokenSale.read.ratio()
            expect(ratio).to.eq(TEST_RATIO)
        })
        it("defines the price as provided in parameters", async () => {
            const {tokenSale} = await loadFixture(deployTokenSaleFixture);
            const price = await tokenSale.read.price()
            expect(price).to.eq(TEST_PRICE)
        });
        it("uses a valid ERC20 as payment token", async () => {
            const {tokenSale} = await loadFixture(deployTokenSaleFixture);
            const tokenAddress = await tokenSale.read.token()
            const tokenContract = await viem.getContractAt('MyToken', tokenAddress)
            const totalSupply = await tokenContract.read.totalSupply()
            expect(totalSupply).to.eq(0n)
        });
        it("uses a valid ERC721 as NFT collection", async () => {
            const {tokenSale} = await loadFixture(deployTokenSaleFixture);
            const nftAddress = await tokenSale.read.nft()
            const nftContract = await viem.getContractAt('MyNFT', nftAddress)
            const name = await nftContract.read.name()
            const symbol = await nftContract.read.symbol()
            expect(name).to.eq('MyNFT')
            expect(symbol).to.eq('NFT')
        });
    })
    describe("When a user buys an ERC20 from the Token contract", async () => {
        it("charges the correct amount of ETH", async () => {
            const {tokenSale, account1, publicClient} = await loadFixture(deployTokenSaleFixture);

            const ethBefore = await publicClient.getBalance({address: account1.account.address});
            const buyTokenTx = await tokenSale.write.buyTokens({size: TEST_ETH_PAYMENT_SIZE, account: account1.account})
            const receipt = await publicClient.waitForTransactionReceipt({hash: buyTokenTx});
            const {effectiveGasPrice, gasUsed} = receipt
            const gasCost = effectiveGasPrice * gasUsed
            const ethAfter = await publicClient.getBalance({address: account1.account.address})
            const diff = ethBefore - ethAfter
            expect(diff).to.eq(gasCost)
        })
        it("gives the correct amount of tokens", async () => {
            const {tokenSale, account1, publicClient, token} = await loadFixture(deployTokenSaleFixture);
            const tokenBalanceBefore = await token.read.balanceOf([account1.account.address]);
            const buyTokenTx = await tokenSale.write.buyTokens({value: TEST_ETH_PAYMENT_SIZE, account: account1.account})
            await publicClient.waitForTransactionReceipt({hash: buyTokenTx});
            const tokenBalanceAfter =  await token.read.balanceOf([account1.account.address]);
            const diff = tokenBalanceAfter - tokenBalanceBefore
            expect(diff).to.eq(TEST_ETH_PAYMENT_SIZE * TEST_RATIO)
        });
    })
    describe("When a user burns an ERC20 at the Shop contract", async () => {
        it("gives the correct amount of ETH", async () => {
            const {tokenSale, account1, publicClient, token} = await loadFixture(deployTokenSaleFixture);

            const buyTokenTx = await tokenSale.write.buyTokens({value: TEST_ETH_PAYMENT_SIZE, account: account1.account})
            await publicClient.waitForTransactionReceipt({hash: buyTokenTx})

            const ethBefore = await publicClient.getBalance({address: account1.account.address});

            const approveTokensTx = await token.write.approve([tokenSale.address, TEST_AMOUNT_TO_BURN], {account: account1.account})
            const approveReceipt = await publicClient.waitForTransactionReceipt({hash: approveTokensTx});
            const approveGasCost = approveReceipt.effectiveGasPrice * approveReceipt.gasUsed

            const sellTokenTx = await tokenSale.write.returnTokens([TEST_AMOUNT_TO_BURN], {account: account1.account})
            const sellTokenReceipt = await publicClient.waitForTransactionReceipt({hash: sellTokenTx});
            const sellTokenGasCost = sellTokenReceipt.effectiveGasPrice * sellTokenReceipt.gasUsed

            const ethAfter = await publicClient.getBalance({address: account1.account.address})

            const diff = ethAfter - ethBefore
            expect(diff).to.eq((TEST_AMOUNT_TO_BURN / TEST_RATIO) - approveGasCost - sellTokenGasCost)
        })
        it("burns the correct amount of tokens", async () => {
            const {tokenSale, account1, publicClient, token} = await loadFixture(deployTokenSaleFixture);

            const buyTokenTx = await tokenSale.write.buyTokens({value: TEST_ETH_PAYMENT_SIZE, account: account1.account})
            await publicClient.waitForTransactionReceipt({hash: buyTokenTx})

            const tokenBalanceBefore = await token.read.balanceOf([account1.account.address]);

            const approveTokensTx = await token.write.approve([tokenSale.address, TEST_AMOUNT_TO_BURN], {account: account1.account})
            await publicClient.waitForTransactionReceipt({hash: approveTokensTx});
            const sellTokenTx = await tokenSale.write.returnTokens([TEST_AMOUNT_TO_BURN], {account: account1.account})
            await publicClient.waitForTransactionReceipt({hash: sellTokenTx});

            const tokenBalanceAfter =  await token.read.balanceOf([account1.account.address]);

            const diff = tokenBalanceBefore - tokenBalanceAfter
            expect(diff).to.eq(TEST_AMOUNT_TO_BURN)
        });
    })
    describe("When a user buys an NFT from the Shop contract", async () => {
        it("charges the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        })
        it("gives the correct NFT", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When the owner withdraws from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        })
        it("updates the owner pool account correctly", async () => {
            throw new Error("Not implemented");
        });
    });
});