import mongoose from "mongoose";
import { Redis } from "../databases";

/**
 * This is a TypeScript function that gracefully shuts down a server by disconnecting from a MongoDB
 * database and quitting a Redis client.
 * @returns If there is an error caught in the try block, the function will return without doing
 * anything. If there is no error, the function will exit the process with a status code of 0. However,
 * since the function has a return type of `Promise<void>`, it will always return a promise that
 * resolves to `void`.
 */
async function _gracefulShutdown(): Promise<void> {
    try {
        await mongoose.disconnect();
        await Redis.quit();
        process.exit(0);
    } catch (error) {
        return;
    }
}

/**
 * It adds two event listeners to the process object, one for SIGINT and one for SIGTERM.
 */
export default async function shutdown(): Promise<void> {
    process.once("SIGINT", _gracefulShutdown);
    process.once("SIGTERM", _gracefulShutdown);
}
