import {
    Address,
    createPublicClient, createWalletClient,
    formatEther, parseEther,
} from "viem";
import { abi, bytecode } from "../artifacts/contracts/My20Votes.sol/MyVoteToken.json";
import {account, config} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("invalid parameters");

    const contractAddress = parameters[0] as Address;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    const destination = parameters[1] as Address;
    if (!destination) throw new Error("Destination address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid destination address");

    const publicClient = createPublicClient({...config});
    const deployer = createWalletClient({...config, account});

    const hash = await deployer.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [destination],
    });
    await publicClient.waitForTransactionReceipt({hash})
    console.log("transaction: ", hash);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});