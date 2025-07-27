import IoRedis from "ioredis";
import { REDIS_URI } from "../constants";

export const Redis = new IoRedis(REDIS_URI, {
    retryStrategy(times) {
        var delay = Math.min(times * 50, 2000);
        return delay;
    }
});

export async function disconnectRedis() {
    await Redis.quit();
    return;
}

// if (ENVIRONMENT !== "testing") {
// 	Redis.on("ready", () => console.log("Redis client is ready!"));
// 	Redis.on("end", () => console.log("Redis connection has closed."));
// 	Redis.on("reconnecting", (o: any) => {
// 		console.log("Redis client is reconnecting!");
// 		console.log(`Attempt number: ${o.attempt}`);
// 		console.log(`Milliseconds since last attempt: ${o.delay}`);
// 	});
// }

export async function redisUpdateKeyString<T>(
    query: string,
    data: T,
    expire: boolean = true,
    seconds?: number
): Promise<boolean> {
    // set default expiration time to 60 seconds for mainnet and 1hr for testnet
    // seconds = seconds ?? CHAIN_ID === "1" ? 60 : 3_600;
    seconds = seconds ?? 60;

    if (expire === true) {
        const response = await Redis.setex(
            query,
            seconds,
            JSON.stringify(data)
        );
        return response === "OK";
    } else {
        const response = await Redis.set(query, JSON.stringify(data));
        return response === "OK";
    }
}

/**
 * The function `redisRetrieveKeyString` retrieves a value from Redis based on a given query string and
 * returns it as a parsed JSON object.
 * @param {string} query - The `query` parameter is a string that represents the key to retrieve the
 * value from Redis.
 * @returns The function `redisRetrieveKeyString` returns a Promise that resolves to a value of type
 * `T` or `undefined`.
 */
export async function redisRetrieveKeyString<T>(
    query: string
): Promise<T | undefined> {
    const response = await Redis.get(query);
    if (response === null) return undefined;
    return JSON.parse(response) as T;
}

/**
 * The function `redisDeleteKeys` is an asynchronous function that deletes keys from a Redis database
 * and returns a boolean indicating whether the deletion was successful.
 * @param {string[]} queries - The `queries` parameter is a rest parameter that allows you to pass in
 * multiple string arguments. These arguments represent the keys that you want to delete from the Redis
 * database.
 * @returns a Promise that resolves to a boolean value.
 */
export async function redisDeleteKeys(...queries: string[]): Promise<boolean> {
    if (queries.length === 0) return false;

    const resolvedKeys = (
        await Promise.allSettled(queries.map((query) => Redis.keys(query)))
    )
        .map((item) => {
            if (item.status === "rejected") {
                return [];
            }
            return item.value as string[];
        })
        .flat();

    if (!resolvedKeys.length) return false;

    const response = await Redis.del(resolvedKeys);
    return response === 1;
}

// export async function redisUpdateKeyList <T>(
// 	query: string,
// 	data: T,
// 	expire: boolean = true,
// 	seconds?: number
// ): Promise<boolean>  {
// 	// set default expiration time to 60 seconds for mainnet and 1hr for testnet
// 	// seconds = seconds ?? CHAIN_ID === "1" ? 60 : 3_600;
// 	seconds = seconds ?? 60;

// 	if (expire === true) {
// 		const response = await Redis.setex(query, seconds, JSON.stringify(data));
// 		return response === "OK";
// 	} else {
// 		const response = await Redis.set(query, JSON.stringify(data));
// 		return response === "OK";
// 	}
// };
