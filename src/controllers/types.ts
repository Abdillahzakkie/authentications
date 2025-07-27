export interface IResponseData<T> {
	message?: string | null;
	code: number;
	data?: T;
}
