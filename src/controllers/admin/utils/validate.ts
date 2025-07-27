import { z as zod } from "zod";
import { IRole } from "../../../models/admins/types";

export const getAllAdminsSchema = zod.object({
    offset: zod.coerce.number().min(0).optional().default(0),
    limit: zod.coerce.number().min(1).optional().default(1)
});

export const grantRoleSchema = zod.object({
	account: zod.string(),
	role: zod.nativeEnum(IRole),
});

export const revokeRoleSchema = zod.object({
	account: zod.string(),
});

export const getAccountAdminStatusSchema = zod.object({
	account: zod.string(),
});
