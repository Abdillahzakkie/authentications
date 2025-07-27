import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { Redis } from "../databases";

// Create and use the rate limiter
export default function limiter({
	windowMs = 500,
	max = 10000,
	skipSuccessfulRequests = false,
	shouldSkip = false,
}: {
	windowMs?: number;
	max?: number;
	skipSuccessfulRequests?: boolean;
	shouldSkip?: boolean;
}) {
	return rateLimit({
		windowMs, // default 500 milliseconds
		max, // Limit each IP to 5000 requests per `window` (here, per 500ms)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
		skipSuccessfulRequests,
		// Redis store configuration
		store: new RedisStore({
			// @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
			sendCommand: (...args: string[]) => Redis.call(...args),
		}),
		skip: (_: Request, __: Response) => shouldSkip,
	});
}
