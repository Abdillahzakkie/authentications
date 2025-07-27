export enum IRole {
	ADMIN = "ADMIN",
	NONE = "NONE",
}

export interface IAdmin {
	account: string;
	role: IRole;
}
