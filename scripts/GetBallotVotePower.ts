import {
    createPublicClient, createWalletClient,
    formatEther,
} from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {account, config} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("invalid parameters");

    const contractAddress = parameters[0] as `0x${string}`;
    const accountAddress = parameters[1] as string;

    if (!contractAddress) throw new Error("contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    if (!accountAddress) throw new Error("account address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(accountAddress))
        throw new Error("invalid contract address");

    const publicClient = createPublicClient(config);

    const votes = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getVotePower",
        args: [accountAddress],
    })) as bigint;
    console.log(
        `${accountAddress} has ${formatEther(votes)} voting power`
    );
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});