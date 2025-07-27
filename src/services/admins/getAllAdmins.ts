import { redisRetrieveKeyString, redisUpdateKeyString } from "../../databases";
import { getAllAdminsDB } from "../../models";
import { IAdmin } from "../../models/admins/types";

export function getQueryKey({
    offset,
    limit
}: {
    offset: string;
    limit: string;
}): string {
    return `services:admins:all:${offset}:${limit}`;
}

export default async function getAllAdmins(payload: {
    offset: number;
    limit: number;
}): Promise<ReturnType<typeof getAllAdminsDB>> {
    const query = getQueryKey({
        offset: payload.offset.toString(),
        limit: payload.limit.toString()
    });

    const cachedResponse = await redisRetrieveKeyString<IAdmin[]>(query);
    if (cachedResponse) return cachedResponse;

    const result = await getAllAdminsDB(payload);
    if (!result.length) return [];

    const expiresIn = 60 * 60 * 24; // 24 hours
    await redisUpdateKeyString<IAdmin[]>(query, result, true, expiresIn);
    return result;
}
