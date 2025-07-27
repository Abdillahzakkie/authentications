import Hash from "hash.js";

/**
 * The function `hash` takes a string as input and returns its SHA-256 hash value as a hexadecimal
 * string.
 * @param {string} content - The `content` parameter is a string that represents the content that you
 * want to hash.
 * @returns The hash function is returning a string value.
 */
export default function hash(content: string): string {
	return Hash.sha256().update(content).digest("hex");
}
