import { isAddress as _isAddress } from "ethers";

export default function isAddress(address: string) {
    return _isAddress(address);
}
