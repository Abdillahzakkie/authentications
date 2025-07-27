import { logoutUserDB } from "../../models";

export default async function logoutUser({
	address,
	token,
}: {
	address: string;
	token: string;
}) {
	const user = await logoutUserDB({ address, token });
	return user;
}
