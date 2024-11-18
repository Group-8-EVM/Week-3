import {
    createPublicClient,
    createWalletClient,
} from "viem";
import {abi, bytecode} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {config, account} from "../config";

async function main() {
    const publicClient = createPublicClient(config);

    const deployer = createWalletClient({...config, account});

    const hash = await deployer.deployContract({
        abi,
        bytecode: bytecode as `0x${string}`,
    });
    console.log("transaction address: ", hash);
    const receipt = await publicClient.waitForTransactionReceipt({hash});
    console.log("contract address: ", receipt.contractAddress);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});