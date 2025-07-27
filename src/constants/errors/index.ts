export * from "./errorMessages";
import { IError } from "./types";
import {
	ErrInternalServerError,
	ErrInvalidAction,
	ErrInvalidAddress,
	ErrInvalidChain,
	ErrInvalidFields,
	ErrIncompleteFields,
	ErrInvalidSignature,
	ErrInvalidURL,
	ErrResourceAlreadyExist,
	ErrResourceNotFound,
	ErrSignatureExpired,
	ErrUnauthorized,
	ErrInvalidRole,
	ErrInvalidFileType,
} from "./errorMessages";

/**
 * It takes an error object and returns an error response object.
 * @param {Error} error - Error - the error object that was thrown
 * @returns An object with two properties: code and message.
 */
export const getErrorResponse = (error: Error): IError => {
	const delimiter = "Error: ";

	let message: string = error.toString().replace(delimiter, ""),
		code: number = 0;

	switch (error) {
		case ErrInvalidFields:
		case ErrInvalidAddress:
		case ErrInvalidURL:
		case ErrInvalidSignature:
		case ErrSignatureExpired:
		case ErrIncompleteFields:
		case ErrInvalidAction:
		case ErrInvalidChain:
		case ErrInvalidAddress:
		case ErrInvalidRole:
		case ErrInvalidFileType:
			code = 400;
			break;

		case ErrUnauthorized:
			code = 401;
			break;

		case ErrResourceNotFound:
			code = 404;
			break;

		case ErrResourceAlreadyExist:
			code = 409;
			break;

		case ErrInternalServerError:
			code = 500;
			break;

		default:
			code = 500;
			message = ErrInternalServerError.toString().replace(delimiter, "");
	}
	const result: IError = {
		code,
		message,
	};
	return result;
};
