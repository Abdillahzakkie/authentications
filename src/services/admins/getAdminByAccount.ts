import { toChecksumAddress } from "../../constants";
import { redisRetrieveKeyString, redisUpdateKeyString } from "../../databases";
import { getAdminByAccountDB } from "../../models";
import { IAdmin } from "../../models/admins/types";

export function getQueryKey({ account }: { account: string }): string {
    return `services:admins:account:${toChecksumAddress(account)}`;
}

export default async function getAdminByAccount(
    account: string
): Promise<ReturnType<typeof getAdminByAccountDB>> {
    const query = getQueryKey({ account });

    const cachedResponse = await redisRetrieveKeyString<IAdmin>(query);
    if (cachedResponse) return cachedResponse;

    const result = await getAdminByAccountDB(account);
    if (!result) return null;

    const expiresIn = 60 * 60 * 24; // 24 hours
    await redisUpdateKeyString<IAdmin>(query, result, true, expiresIn);
    return result;
}
