import { hash } from "../../constants";
import { redisRetrieveKeyString, redisUpdateKeyString } from "../../databases";
import { getAllUsersDB } from "../../models";
import { IUser } from "../../models/user/types";

export function getQueryKey({
    addresses,
    offset,
    limit
}: {
    addresses: string[];
    offset: string;
    limit: string;
}): string {
    return `services:users:all:${offset}:${limit}:${hash(
        JSON.stringify(addresses.sort((a, b) => a.localeCompare(b)))
    )}`;
}

export default async function getAllUsers({
    addresses,
    offset,
    limit
}: {
    addresses?: string[];
    offset: number;
    limit: number;
}): Promise<ReturnType<typeof getAllUsersDB>> {
    const query = getQueryKey({
        offset: offset.toString(),
        limit: limit.toString(),
        addresses: addresses ?? []
    });

    const cachedResponse = await redisRetrieveKeyString<IUser[]>(query);
    if (cachedResponse) return cachedResponse;

    const result = await getAllUsersDB({
        addresses: addresses ?? [],
        offset,
        limit
    });

    if (!result.length) return [];

    const expiresIn = 60 * 60 * 24; // 24 hours
    await redisUpdateKeyString<typeof result>(query, result, true, expiresIn);
    return result;
}
