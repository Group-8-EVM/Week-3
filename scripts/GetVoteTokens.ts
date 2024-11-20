import {
    Address,
    createPublicClient,
    createWalletClient, formatEther, parseEther,
} from "viem";
import {abi, bytecode} from "../artifacts/contracts/My20Votes.sol/MyVoteToken.json";
import {config, account} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("invalid parameters");

    const contractAddress = parameters[0] as Address;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    const walletAddress = parameters[1] as Address;
    if (!walletAddress) throw new Error("Wallet address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    const publicClient = createPublicClient(config);

    const balance = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "balanceOf",
        args: [walletAddress],
    });
    const votes = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getVotes",
        args: [walletAddress],
    });
    console.log(
        `${walletAddress} has ${formatEther(balance as bigint)} voting tokens and ${formatEther(votes as bigint)} voting power`
    );
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});