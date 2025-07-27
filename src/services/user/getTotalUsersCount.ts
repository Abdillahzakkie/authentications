import { redisRetrieveKeyString, redisUpdateKeyString } from "../../databases";
import { getTotalUsersCountDB } from "../../models";

export function getQueryKey(): string {
    return "services:users:total";
}

export default async function getTotalUsersCount(): Promise<{
    totalCount: number;
}> {
    const query = getQueryKey();
    const cachedResponse = await redisRetrieveKeyString<{ totalCount: number }>(
        query
    );
    if (cachedResponse) return cachedResponse;

    const result = {
        totalCount: await getTotalUsersCountDB()
    };

    const expiresIn = 60 * 60 * 24; // 24 hours
    await redisUpdateKeyString<typeof result>(query, result, true, expiresIn);

    return result;
}
