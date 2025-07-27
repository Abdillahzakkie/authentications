import { Request, Response } from "express";
import { isAddress } from "ethers";
import {
    ErrIncompleteFields,
    ErrInvalidAction,
    ErrInvalidAddress,
    ErrInvalidFields,
    ErrInvalidSignature,
    decodeJwtToken,
    getErrorResponse
} from "../../constants";
import {
    addNewUser,
    generateLoginSignatureData,
    getAllUsers,
    getTotalUsersCount,
    loginUser
} from "../../services";
import { IResponseData } from "../types";
import {
    generateLoginSignatureDataSchema,
    addNewUserInputSchema,
    loginInputSchema,
    getAllUsersQueryParamSchema,
    getAllUsersBodySchema,
    validateLoginSignature
} from "./utils";

export async function generateLoginSignatureDataHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validation = generateLoginSignatureDataSchema.safeParse(
            req.query
        );
        if (!validation.success) throw ErrInvalidFields;
        const { deadline } = validation.data;
        const result = await generateLoginSignatureData(deadline);
        const response: IResponseData<typeof result> = {
            data: result,
            code: 200,
            message: null
        };

        res.status(response.code).json(response);
    } catch (error: any) {
        const response = getErrorResponse(error);
        res.status(response.code).json(response);
    }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
    try {
        const ip = req.clientIp;
        const validation = loginInputSchema.safeParse(req.body);

        if (!validation.success) throw ErrIncompleteFields;
        const { data: payload } = validation;

        if (!isAddress(payload.account)) throw ErrInvalidAddress;

        if (
            !validateLoginSignature(
                payload.account,
                payload.signature,
                payload.deadline
            )
        )
            throw ErrInvalidSignature;

        const result = await loginUser({
            address: payload.account,
            ...(ip && { ip })
        });
        if (!result) throw ErrInvalidAction;
        const decodedToken = await decodeJwtToken(result?.token ?? "");
        res.cookie("token", result.token, {
            httpOnly: true,
            expires: decodedToken?.expiresIn
                ? new Date(decodedToken?.expiresIn)
                : undefined,
            secure: true
        });

        const response: IResponseData<typeof result> = {
            data: result,
            code: 201,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        res.clearCookie("token");
        const response = getErrorResponse(error);
        res.status(response.code).json(response);
    }
}

export async function verifyAuthTokenHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        let token: string | undefined = undefined;

        if (req.cookies && req.cookies["token"]) token = req.cookies["token"];
        else token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw ErrInvalidAction;

        const result = await decodeJwtToken(token);
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

export async function addNewUserHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validation = addNewUserInputSchema.safeParse(req.params);
        if (!validation.success) throw ErrInvalidFields;

        const { account } = validation.data;

        if (!isAddress(account)) throw ErrInvalidAddress;

        const result = await addNewUser(account);
        const response: IResponseData<typeof result> = {
            data: result,
            code: 201,
            message: null
        };
        res.status(response.code).json(response);
    } catch (error: any) {
        const response = getErrorResponse(error);
        res.status(response.code).json(response);
    }
}

export async function getAllUsersHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const queryValidation = getAllUsersQueryParamSchema.safeParse(
            req.query
        );
        const bodyValidation = getAllUsersBodySchema.safeParse(req.body);

        if (!queryValidation.success || !bodyValidation.success)
            throw ErrInvalidFields;

        const { offset, limit } = queryValidation.data;
        const { addresses } = bodyValidation.data;

        if (addresses && !addresses.every((address) => isAddress(address)))
            throw ErrInvalidAddress;

        const result = await getAllUsers({
            offset,
            limit,
            ...(addresses ? { addresses } : {})
        });
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

export async function getTotalUsersCountHandler(_: Request, res: Response) {
    try {
        const result = await getTotalUsersCount();
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
};
