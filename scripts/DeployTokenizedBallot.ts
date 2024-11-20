import {
    Address,
    createPublicClient,
    createWalletClient,
    toHex,
} from "viem";
import {abi, bytecode} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {config, account} from "../config";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 3)
        throw new Error("invalid parameters");

    const tokenAddress = parameters[0] as `0x${string}`;
    if (!tokenAddress) throw new Error("token address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress))
        throw new Error("invalid token address");

    const proposals = parameters.slice(2).map(p => toHex(p, { size: 32 }));

    const publicClient = createPublicClient(config);
    const deployer = createWalletClient({...config, account});

    const targetBn = (await publicClient.getBlockNumber())-1n
    console.log('target block number: ', targetBn)
    const hash = await deployer.deployContract({
        abi,
        bytecode: bytecode as Address,
        args: [proposals, tokenAddress, targetBn],
    });
    console.log("transaction address: ", hash);
    const receipt = await publicClient.waitForTransactionReceipt({hash});
    console.log("contract address: ", receipt.contractAddress);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});