import { z as zod } from "zod";
import { MAX_LIMIT } from "../../../constants";

export const generateLoginSignatureDataSchema = zod.object({
	deadline: zod.coerce.number().int().positive(),
});

export const loginInputSchema = zod
	.object({
		account: zod.string(),
		signature: zod.string(),
		deadline: zod.coerce.number().int().positive().gt(0),
	})
	.strict();

export const addNewUserInputSchema = zod
	.object({
		account: zod.string(),
	})
	.strict();

export const getAllUsersQueryParamSchema = zod.object({
	offset: zod.coerce.number().optional().default(0),
	limit: zod.coerce.number().optional().default(MAX_LIMIT),
});

export const getAllUsersBodySchema = zod
	.object({
		addresses: zod.array(zod.string()).optional().nullish().default(null),
	})
	.strict();
