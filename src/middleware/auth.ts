import { Request, Response, NextFunction } from "express";
import {
    ErrInvalidAction,
    decodeJwtToken,
    getErrorResponse
} from "../constants";

export async function authenticateHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let token: string | undefined = undefined;

        if (req.cookies && req.cookies["token"]) token = req.cookies["token"];
        else token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw ErrInvalidAction;
        const result = await decodeJwtToken(token);

        if (!result) throw ErrInvalidAction;

        req.token = token;
        req.account = result.account;
        // req.expirationDate = result.expiresIn;
        next();
    } catch (error: any) {
        const result = getErrorResponse(error);
        res.status(result.code).json(result);
    }
};
