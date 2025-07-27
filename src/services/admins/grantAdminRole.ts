import { redisDeleteKeys, redisUpdateKeyString } from "../../databases";
import { grantAdminRoleDB } from "../../models";
import { IAdmin } from "../../models/admins/types";
import { getQueryKey as getAdminByAccountQueryKey } from "./getAdminByAccount";
import { getQueryKey as getAllAdminsQueryKey } from "./getAllAdmins";

export default async function grantAdminRole(
    payload: IAdmin
): Promise<ReturnType<typeof grantAdminRoleDB>> {
    const result = await grantAdminRoleDB(payload);
    if (!result) return null;

    const query = getAdminByAccountQueryKey({ account: payload.account });

    await redisDeleteKeys(
        query,
        getAllAdminsQueryKey({
            offset: "*",
            limit: "*"
        })
    );

    const expiresIn = 60 * 60 * 24; // 24 hours
    await redisUpdateKeyString<IAdmin>(query, result, true, expiresIn);
    return result;
}
