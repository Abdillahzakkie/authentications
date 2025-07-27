import moment from "moment";
import { logoutUser } from ".";
import { isAuthTokenValidForAddressDB } from "../../models";

export default async function isAuthTokenValidForAddress({
	address,
	token,
	expiresIn,
}: {
	address: string;
	token: string;
	expiresIn: Date;
}): Promise<boolean> {
	const isValidToken = await isAuthTokenValidForAddressDB({ address, token });
	if (!isValidToken) return false;

	const isExpiredToken = moment().diff(moment(expiresIn));

	if (isExpiredToken >= 0) await logoutUser({ address, token });
	return true;
}
