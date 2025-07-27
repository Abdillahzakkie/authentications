import { redisDeleteKeys } from "../../databases";
import { revokeAdminRoleDB } from "../../models";
import { getQueryKey as getAdminByAccountQueryKey } from "./getAdminByAccount";
import { getQueryKey as getAllAdminsQueryKey } from "./getAllAdmins";

export default async function revokeAdminRole(
    account: string
): Promise<ReturnType<typeof revokeAdminRoleDB>> {
    const result = await revokeAdminRoleDB(account);
    if (!result) return false;

    await redisDeleteKeys(
        getAdminByAccountQueryKey({ account }),
        getAllAdminsQueryKey({
            offset: "*",
            limit: "*"
        })
    );
    return result;
}
