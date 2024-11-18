import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

const MINT_VALUE = parseEther('10')

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyVoteToken");
    console.log(`Token contract deployed at ${contract.address}\n`);

    const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account ${
            acc1.account.address
        }\n`
    );
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(
        `Account ${
            acc1.account.address
        } has ${balanceBN.toString()} decimal units of MyToken\n`
    );
    const votes = await contract.read.getVotes([acc1.account.address])
    console.log(`Account ${acc1.account.address} has ${votes.toString()} votes`);

    const delegateTx = await contract.write.delegate([acc1.account.address], {
        account: acc1.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    const votesAfter = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account ${
            acc1.account.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    );


    const transferTx = await contract.write.transfer(
        [acc2.account.address, MINT_VALUE / 2n],
        {
            account: acc1.account,
        }
    );
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    const votes1AfterTransfer = await contract.read.getVotes([
        acc1.account.address,
    ]);
    console.log(
        `Account ${
            acc1.account.address
        } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
    );
    const votes2AfterTransfer = await contract.read.getVotes([
        acc2.account.address,
    ]);
    console.log(
        `Account ${
            acc2.account.address
        } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
    );
    {
        const delegateTx = await contract.write.delegate([acc2.account.address], {
            account: acc2.account,
        });
        await publicClient.waitForTransactionReceipt({ hash: delegateTx });
        const votesAfter = await contract.read.getVotes([acc2.account.address]);
        console.log(
            `Account ${
                acc2.account.address
            } has ${votesAfter.toString()} units of voting power after self delegating\n`
        );
    }
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
