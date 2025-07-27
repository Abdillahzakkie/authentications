import { NextFunction, Request, Response } from "express";
import { isAddress } from "ethers";
import {
    ErrInvalidAddress,
    ErrInvalidFields,
    ErrUnauthorized,
    getErrorResponse
} from "../../constants";
import { getAdminByAccount } from "../../services";
import { schema } from "./utils";

export async function isAdminHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const validation = schema.safeParse(req);
        if (!validation.success) throw ErrInvalidFields;

        const { account } = validation.data;

        if (!isAddress(account)) throw ErrInvalidAddress;

        const status = await getAdminByAccount(account);

        if (!status) throw ErrUnauthorized;
        next();
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
};
