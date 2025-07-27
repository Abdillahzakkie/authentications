import moment from "moment";

/**
 * Generates the login signature data.
 *
 * @param deadline - The deadline for the login signature.
 * @returns The login signature data as a string, or null if the token is expired.
 */
export default function generateLoginSignatureData(
	deadline: number
): string | null {
	const currentTime = moment();
	const signedTime = moment(deadline);

	const timeDifference = signedTime.add(2, "minute").diff(currentTime);

	if (timeDifference <= 0) return null;

	const message = `I want to login on GKOI at ${moment(
		deadline
	).toISOString()}. I accept the GKOI Terms of Service at https://www.gkoi.com/ and I am at least 13 years old.`;
	return message;
}
