import { Request, Response } from "express";
import {
    ErrIncompleteFields,
    ErrInvalidAction,
    ErrInvalidAddress,
    ErrInvalidFields,
    ErrUnauthorized,
    getErrorResponse,
    isAddress
} from "../../constants";
import {
    getAdminByAccount,
    getAllAdmins,
    getAllRoles,
    grantAdminRole,
    revokeAdminRole
} from "../../services";
import { IResponseData } from "../types";
import {
    getAccountAdminStatusSchema,
    getAllAdminsSchema,
    grantRoleSchema,
    revokeRoleSchema
} from "./utils";

export async function getAccountAdminStatusHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validation = getAccountAdminStatusSchema.safeParse(req.params);
        if (!validation.success) throw ErrInvalidFields;
        const { account } = validation.data;

        if (!isAddress(account)) throw ErrUnauthorized;
        const result = await getAdminByAccount(account);

        const response: IResponseData<typeof result> = {
            data: result,
            code: 200,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
}

export async function getAllRolesHandler(
    _: Request,
    res: Response
): Promise<void> {
    try {
        const result = await getAllRoles();
        const response: IResponseData<typeof result> = {
            data: result,
            code: 200,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
}

export async function getAllAdminsHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const query = getAllAdminsSchema.safeParse(req.query);

        if (!query.success) throw ErrIncompleteFields;
        const { offset, limit } = query.data;

        const result = await getAllAdmins({ offset, limit });
        const response: IResponseData<typeof result> = {
            data: result,
            code: 200,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
}

export async function grantRoleHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validation = grantRoleSchema.safeParse({
            ...req.query,
            role:
                typeof req.query["role"] === "string"
                    ? req.query["role"].toUpperCase()
                    : req.query["role"]
        });
        if (!validation.success) throw ErrInvalidFields;

        const { account, role } = validation.data;
        if (!isAddress(account)) throw ErrInvalidAddress;

        const result = await grantAdminRole({ account, role });
        const response: IResponseData<typeof result> = {
            data: result,
            code: 201,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
}

export async function revokeRoleHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validation = revokeRoleSchema.safeParse(req.query);
        if (!validation.success) throw ErrInvalidFields;

        const { account } = validation.data;
        if (!isAddress(account)) throw ErrInvalidAddress;

        const result = await revokeAdminRole(account);
        if (!result) throw ErrInvalidAction;
        const response: IResponseData<null> = {
            data: null,
            code: 200,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
};

// // FOR DEVELOPMENT & TESTING PURPOSES
// export const TestGrantRoleHandler = async (
// 	req: Request,
// 	res: Response
// ): Promise<void> => {
// 	try {
// 		if (NODE_ENV !== "testing") throw ErrInvalidAction;

// 		const { chainId } = req;

// 		const validation = grantRoleSchema.safeParse(req.query);
// 		if (!validation.success) throw ErrInvalidFields;

// 		const { account, role } = validation.data;
// 		if (!isAddress(account)) throw ErrInvalidAddress;

// 		if (
// 			!account ||
// 			typeof account !== "string" ||
// 			!isAddress(account as string)
// 		)
// 			throw ErrInvalidAddress;
// 		if (!role || typeof role !== "string") throw ErrInvalidRole;

// 		const result = await grantAdminRole({ chainId, account, role });
// 		const response: IResponseData<typeof result> = {
// 			data: result,
// 			code: 201,
// 			message: null,
// 		};
// 		res.status(response.code).json(response);
// 	} catch (error: any) {
// 		const result = getErrorResponse(error);
// 		res.status(result.code).json(result);
// 	}
// };
