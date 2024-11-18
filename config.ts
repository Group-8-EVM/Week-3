import {sepolia} from "viem/chains";
import {http} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import * as dotenv from "dotenv";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const privateKey = process.env.PRIVATE_KEY || "";


export const account = privateKeyToAccount(`0x${privateKey}`);

export const config = {
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
}
