import {
    createPublicClient,
    hexToString
} from "viem";
import {abi} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {config} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error("invalid parameters");

    const contractAddress = parameters[0] as `0x${string}`;

    if (!contractAddress) throw new Error("contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("invalid contract address");

    const publicClient = createPublicClient(config);

    const p: any = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "winnerName",
        args: [],
    });
    console.log(
        `${hexToString(p)} is winning`
    );
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});