import { loginUserDB } from "../../models";

export default async function loginUser({
	address,
	ip,
}: {
	address: string;
	ip?: string;
}): Promise<ReturnType<typeof loginUserDB>> {
	const result = await loginUserDB(ip ? { address, ip } : { address });
	return result;
}
