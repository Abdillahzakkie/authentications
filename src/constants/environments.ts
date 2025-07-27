export const NODE_ENV = process.env["NODE_ENV"] ?? "development";
export const PORT = process.env["PORT"] ?? "80";
export const QUERY_LIMIT = process.env["QUERY_LIMIT"]
	? parseInt(process.env["QUERY_LIMIT"])
	: 50;
export const CHAIN_ID = process.env["CHAIN_ID"]
	? parseInt(process.env["CHAIN_ID"])
	: 1;
export const MAX_LIMIT = 50;
export const MONGODB_URI = process.env["MONGODB_URI"] ?? "";
export const DB_NAME = process.env["DB_NAME"] ?? "";
export const REDIS_URI = process.env["REDIS_URI"] ?? "";
export const JWT_SECRET = process.env["JWT_SECRET"] ?? "";
export const NFT_GALLERY_BASE_URL = process.env["NFT_GALLERY_BASE_URL"] ?? "";
export const RPC_URL = process.env["RPC_URL"] ?? "";

export const TEST_WALLET = process.env["TEST_WALLET"] ?? "";
export const TEST_WALLET_KEY = process.env["TEST_WALLET_KEY"] ?? "";
