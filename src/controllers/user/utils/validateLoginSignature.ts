import { verifyMessage } from "ethers";
import {
    generateLoginSignatureData,
    toChecksumAddress
} from "../../../constants";

const validateLoginSignature = (
	account: string,
	signature: string,
	deadline: number
): boolean => {
	try {
		const message = generateLoginSignatureData(deadline);
		if (!message) return false;

		const signer = verifyMessage(message, signature);
		return toChecksumAddress(signer) === toChecksumAddress(account);
	} catch (error) {
		return false;
	}
};

export default validateLoginSignature;
