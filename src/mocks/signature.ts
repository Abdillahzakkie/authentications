import { JsonRpcProvider, Wallet } from "ethers";
import {
    RPC_URL,
    TEST_WALLET_KEY,
    generateLoginSignatureData
} from "../constants";

export async function getSignature(): Promise<{
    account: string;
    signature: string;
    deadline: number;
} | null> {
    const TestWallet = new Wallet(
        TEST_WALLET_KEY,
        new JsonRpcProvider(RPC_URL)
    );

    const deadline = Date.now();

    const message = generateLoginSignatureData(deadline);
    if (!message) return null;
    const account = await TestWallet.getAddress();
    const signature = await TestWallet.signMessage(message);

    return {
        account,
        signature,
        deadline
    };
};
