import { ethers } from "ethers";

export default function toChecksumAddress(address: string): string {
    return ethers.getAddress(address);
}
