import { Model, PipelineStage, Schema, model } from "mongoose";
import { sign } from "jsonwebtoken";
import { IUser, IUserMethods } from "./types";
import {
    ErrInvalidAddress,
    JWT_SECRET,
    MAX_LIMIT,
    isAddress,
    toChecksumAddress
} from "../../constants";
import { IJwtPayload } from "../../controllers/user/types";
import { databaseResponseTimeHistogram } from "../../metrics";

type UserModel = Model<IUser, {}, IUserMethods>;

const collectionName = "users";
const schema = new Schema<IUser, UserModel, IUserMethods>(
    {
        address: {
            type: String,
            required: true,
            unique: true,
            validate(value: string) {
                if (!isAddress(value)) throw ErrInvalidAddress;
            }
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                },
                expirationDate: {
                    type: Date,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// schema.index(
// 	{
// 		address: 1,
// 	},
// 	{ unique: true }
// );

schema.methods.generateAuthToken = async function (
    ip?: string
): Promise<IJwtPayload> {
    const user = this;

    const days = 1;
    const expirationTimeInSeconds = 60 ** 2 * 1000 * 24 * days;
    const expirationTimestampMs = Date.now() + expirationTimeInSeconds;

    const currentDate = new Date();
    const expirationDate = new Date(expirationTimestampMs);

    const data: IJwtPayload = {
        account: user.address,
        date: currentDate,
        expiresIn: expirationDate,
        ip: ip || ""
    };

    const token = sign({ data, exp: expirationTimestampMs }, JWT_SECRET);
    const tokens = [...(user?.tokens ?? []), { token, expirationDate }];
    user.token = token;
    user.tokens = tokens;

    await user.save();

    delete data?.ip;
    return {
        ...data,
        token
    };
};

schema.pre("save", async function (next) {
    const user = this;
    user.address = toChecksumAddress(this.address);
    next();
});

const User = model<IUser, UserModel>(collectionName, schema);
User.syncIndexes();

/**
 * Checks if a user with the given address exists.
 * @param address - The address of the user.
 * @returns A Promise that resolves to a boolean indicating whether the user exists.
 */
export async function isExistingUserDB(address: string): Promise<boolean> {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        const user = await User.exists({
            address: toChecksumAddress(address)
        });
        if (!user) throw Error();
        timer({
            operation: "exists",
            collection: collectionName,
            method: "isExistingUserDB",
            success: "true"
        });
        return true;
    } catch (error) {
        timer({
            operation: "exists",
            collection: collectionName,
            method: "isExistingUserDB",
            success: "false"
        });
        return false;
    }
}

/**
 * Creates a new user in the database if the user with the given address doesn't already exist.
 *
 * @param address - The address of the user.
 * @returns A promise that resolves to the newly created user.
 */
export async function createNewUserDB(address: string) {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        const existingUser = await getUserByAddressDB(address);
        if (existingUser) return existingUser;

        const user = await new User({
            address
        }).save();

        timer({
            operation: "insert",
            collection: collectionName,
            method: "createNewUserDB",
            success: "true"
        });
        return user;
    } catch (error) {
        timer({
            operation: "insert",
            collection: collectionName,
            method: "createNewUserDB",
            success: "false"
        });
        return null;
    }
}

/**
 * Retrieves a user by their address.
 * @param address - The address of the user.
 * @returns A Promise that resolves to the user object if found, or null if not found.
 */
export async function getUserByAddressDB(address: string) {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        const user = await User.findOne({
            address: toChecksumAddress(address)
        });

        if (!user) throw Error();

        timer({
            operation: "find",
            collection: collectionName,
            method: "getUserByAddressDB",
            success: "true"
        });

        return user;
    } catch (error) {
        timer({
            operation: "find",
            collection: collectionName,
            method: "getUserByAddressDB",
            success: "false"
        });
        return null;
    }
}

/**
 * Logs in a user by their address and generates an authentication token.
 * If the user does not exist, a new user will be created.
 * @param {Object} options - The login options.
 * @param {string} options.address - The user's address.
 * @param {string} [options.ip] - The user's IP address.
 * @returns {Promise<User>} The logged-in user.
 */
export async function loginUserDB({
    address,
    ip
}: {
    address: string;
    ip?: string;
}): Promise<IJwtPayload | null> {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        let user = await getUserByAddressDB(address);

        if (!user) {
            const newUser = await createNewUserDB(address);
            if (!newUser) throw Error();
            user = newUser;
        }

        const result = await user.generateAuthToken(ip);

        timer({
            operation: "update",
            collection: collectionName,
            method: "loginUserDB",
            success: "true"
        });

        return result;
    } catch (error) {
        timer({
            operation: "update",
            collection: collectionName,
            method: "loginUserDB",
            success: "false"
        });
        return null;
    }
}

/**
 * Logs out a user by removing a token from their tokens array.
 * @param {Object} params - The parameters for logging out a user.
 * @param {string} params.address - The user's address.
 * @param {string} params.token - The token to be removed.
 * @returns {Promise<User | null>} - A promise that resolves to the updated user object or null if the user is not found.
 */
export async function logoutUserDB({
    address,
    token
}: {
    address: string;
    token: string;
}): Promise<IUser | null> {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        let user = await getUserByAddressDB(address);
        if (!user) throw Error();

        user = await User.findByIdAndUpdate(
            { address: toChecksumAddress(address) },
            {
                tokens: user.tokens?.filter((item) => item.token !== token)
            }
        );

        timer({
            operation: "update",
            collection: collectionName,
            method: "logoutUserDB",
            success: "true"
        });

        if (!user) return null;

        delete user?.tokens;

        return user;
    } catch (error) {
        timer({
            operation: "update",
            collection: collectionName,
            method: "logoutUserDB",
            success: "false"
        });
        return null;
    }
}

/**
 * Checks if the account authentication token is valid in the database.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.address - The address of the user.
 * @param {string} params.token - The authentication token.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the token is valid.
 */
export async function isAuthTokenValidForAddressDB({
    address,
    token
}: {
    address: string;
    token: string;
}): Promise<boolean> {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        const users = await User.aggregate<IUser>([
            {
                $match: {
                    address: {
                        $eq: toChecksumAddress(address)
                    },
                    tokens: {
                        $elemMatch: {
                            token
                        }
                    }
                }
            }
        ]);

        timer({
            operation: "find",
            collection: collectionName,
            method: "isAuthTokenValidForAddressDB",
            success: "true"
        });

        const user = users?.at(0);
        if (!user) return false;

        return true;
    } catch (error) {
        timer({
            operation: "find",
            collection: collectionName,
            method: "isAuthTokenValidForAddressDB",
            success: "false"
        });
        return false;
    }
}

/**
 * Retrieves all users from the database based on the provided parameters.
 * @param addresses - An optional array of user addresses to filter the results by.
 * @param offset - The number of documents to skip before starting to return results.
 * @param limit - The maximum number of documents to return.
 * @returns A promise that resolves to an array of IUser objects representing the users.
 */
export async function getAllUsersDB({
    addresses,
    offset,
    limit
}: {
    addresses?: string[];
    offset: number;
    limit: number;
}): Promise<IUser[]> {
    const timer = databaseResponseTimeHistogram.startTimer();

    try {
        const safeLimit = Math.min(limit, MAX_LIMIT);
        const pipelines: PipelineStage[] = [];

        if (addresses && addresses?.length > 0)
            pipelines.push({
                $match: {
                    address: {
                        $in: addresses.map(toChecksumAddress)
                    }
                }
            });

        pipelines.push(
            {
                $skip: offset
            },
            {
                $limit: safeLimit
            },
            {
                $project: {
                    _id: 0,
                    tokens: 0,
                    token: 0
                }
            }
        );

        const users = await User.aggregate<IUser>(pipelines);
        timer({
            operation: "find",
            collection: collectionName,
            method: "getAllUsersDB",
            success: "true"
        });
        return users;
    } catch (error) {
        timer({
            operation: "find",
            collection: collectionName,
            method: "getAllUsersDB",
            success: "false"
        });
        return [];
    }
}

/**
 * Retrieves the total count of users.
 * @returns A Promise that resolves to the total count of users.
 */
export async function getTotalUsersCountDB(): Promise<number> {
	const timer = databaseResponseTimeHistogram.startTimer();
	try {
		const results = await User.aggregate<{ total: number }>([
			{
				$count: "total",
			},
		]);

		timer({
			operation: "count",
			collection: collectionName,
			method: "getTotalUsersCountDB",
			success: "true",
		});

		const result = results?.at(0);

		if (!result) return 0;

		const { total } = result;
		return total;
	} catch (error) {
		timer({
			operation: "count",
			collection: collectionName,
			method: "getTotalUsersCountDB",
			success: "false",
		});
		return 0;
	}
}

/**
 * Removes expired tokens from the database.
 *
 * This function updates the user documents by removing tokens that have an expiration date
 * less than the current date. It also records the time taken for the database operation
 * using a histogram timer.
 *
 * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the operation
 * was acknowledged, otherwise `false`.
 */
export async function removeExpiredUsersTokensDB() {
	const timer = databaseResponseTimeHistogram.startTimer();
	try {
		const results = await User.updateMany(
			{
				"tokens.expirationDate": {
					$lt: new Date(),
				},
			},
			{
				$pull: {
					tokens: {
						expirationDate: {
							$lt: new Date(),
						},
					},
				},
			}
		);

		timer({
			operation: "update",
			collection: collectionName,
			method: "removeExpiredTokensDB",
			success: "true",
		});

		return results.acknowledged;
	} catch (error) {
		timer({
			operation: "update",
			collection: collectionName,
			method: "removeExpiredTokensDB",
			success: "false",
		});
		return false;
	}
}
