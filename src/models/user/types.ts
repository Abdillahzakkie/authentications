import { IJwtPayload } from "../../controllers/user/types";

export interface IUser {
	address: string;
	token?: string;
	tokens?: { token: string; expirationDate: Date }[];
}

export interface IUserMethods extends IUser {
	generateAuthToken(ip?: string): Promise<IJwtPayload>;
}
