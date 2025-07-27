import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "./environments";
import { IJwtPayload } from "../controllers/user/types";
import { isAuthTokenValidForAddress } from "../services";

/**
 * Decodes a JSON Web Token (JWT) and verifies its validity.
 * @param token - The JWT to decode and verify.
 * @returns A Promise that resolves to the decoded JWT payload if the token is valid, or null otherwise.
 */
export default async function decodeJwtToken(
	token: string
): Promise<IJwtPayload | null> {
	try {
		const { data } = verify(token, JWT_SECRET) as { data: IJwtPayload };

		const isValidToken = await isAuthTokenValidForAddress({
			address: data.account,
			token,
			expiresIn: data.expiresIn,
		});
		if (!isValidToken) return null;
		return data;
	} catch (error) {
		return null;
	}
}
