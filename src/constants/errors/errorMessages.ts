// 400 error codes
export const ErrInvalidFields: Error = new Error("invalid fields");
export const ErrInvalidAddress: Error = new Error("invalid address");
export const ErrInvalidURL: Error = new Error("invalid url");
export const ErrInvalidSignature: Error = new Error("invalid signature");
export const ErrSignatureExpired: Error = new Error("signature expired");
export const ErrIncompleteFields: Error = new Error("incomplete fields");
export const ErrInvalidAction: Error = new Error("invalid action");
export const ErrInvalidChain: Error = new Error("invalid chain");
export const ErrInvalidRole: Error = new Error("invalid role");
export const ErrInvalidFileType: Error = new Error("invalid file type");

// 401 error codes
export const ErrUnauthorized: Error = new Error("unauthorized");
// 404 error codes
export const ErrResourceNotFound: Error = new Error("resource not found");
// 409 error codes
export const ErrResourceAlreadyExist: Error = new Error(
	"resource already exists"
);
// 500 error codes
export const ErrInternalServerError: Error = new Error("internal server error");
