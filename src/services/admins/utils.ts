import { IRole } from "../../models/admins/types";

/**
 * Retrieves the corresponding `IRole` enum value based on the provided role name string.
 *
 * Converts the input `roleName` to uppercase and matches it against known `IRole` values.
 * Returns the matching `IRole` value if found, otherwise returns `null`.
 *
 * @param roleName - The name of the role to retrieve.
 * @returns The corresponding `IRole` value if found; otherwise, `null`.
 */
export const getRole = (roleName: string): IRole | null => {
    switch (roleName.toUpperCase()) {
        case IRole.ADMIN:
            return IRole.ADMIN;
        case IRole.NONE:
            return IRole.NONE;

        default:
            return null;
    }
};
