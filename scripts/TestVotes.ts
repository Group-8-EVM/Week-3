import { viem } from "hardhat";
import { parseEther, formatEther } from "viem";

const MINT_VALUE = parseEther('10')

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyToken");
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
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
