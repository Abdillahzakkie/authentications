export interface ILoginInput {
	account: string;
	signature: string;
	message: string;
	deadline: number;
}

export interface IJwtPayload {
	account: string;
	ip?: string;
	token?: string;
	date: Date;
	expiresIn: Date;
}
