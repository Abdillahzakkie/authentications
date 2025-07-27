import { IRole } from "../../models/admins/types";

export default async function getAllRoles(): Promise<string[]> {
    const roles = Object.keys(IRole).filter((x) => Number.isNaN(Number(x)));
    return roles;
}
