import { toChecksumAddress } from "../../constants";
import { redisDeleteKeys, redisUpdateKeyString } from "../../databases";
import { createNewUserDB } from "../../models";
import { IUser } from "../../models/user/types";
import { getQueryKey as getAllUsersQueryKey } from "./getAllUsers";
import { getQueryKey as getTotalUsersCountQueryKey } from "./getTotalUsersCount";

export function getQueryKey({ address }: { address: string }): string {
    return `services:users:${toChecksumAddress(address)}`;
}

/**
 * Adds a new user to the system.
 *
 * @param address - The address of the user.
 * @returns A Promise that resolves to the newly created user.
 */
export default async function addNewUser(
    address: string
): Promise<IUser | null> {
    const result = await createNewUserDB(address);
    if (!result) return null;

    const user = { address: result.address };

    const query = getQueryKey({ address });

    await redisDeleteKeys(
        query,
        getAllUsersQueryKey({
            addresses: [],
            offset: "*",
            limit: "*"
        }),
        getTotalUsersCountQueryKey()
    );

    const expiresIn = 60 * 60 * 24; // 24 hours
    await redisUpdateKeyString<IUser>(query, user, true, expiresIn);
    return user;
}
