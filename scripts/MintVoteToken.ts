import {
    Address,
    createPublicClient,
    createWalletClient, parseEther,
} from "viem";
import {abi} from "../artifacts/contracts/My20Votes.sol/MyVoteToken.json";
import {config, account} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("invalid parameters");

    const contractAddress = parameters[0] as Address;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    const mintValue = parseEther(parameters[1]);

    const publicClient = createPublicClient(config);
    const deployer = createWalletClient({...config, account});

    const mintTx = await deployer.writeContract({
        address: contractAddress,
        abi,
        functionName: "mint",
        args: [deployer.account.address, mintValue],
    });
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log("transaction: ", mintTx);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});