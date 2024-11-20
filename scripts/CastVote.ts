import {
    Address,
    createPublicClient,
    createWalletClient, parseEther,
    stringToHex
} from "viem";
import {abi} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {config, account} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 3)
        throw new Error("invalid parameters");

    const contractAddress = parameters[0] as Address;
    if (!contractAddress) throw new Error("contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    const proposal = parameters[1];
    const amount = parseEther(parameters[2]);
    console.log(contractAddress, proposal, amount);

    const publicClient = createPublicClient(config);
    const deployer = createWalletClient({...config, account});

    const mintTx = await deployer.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [proposal, amount],
    });
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log("transaction: ", mintTx);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});