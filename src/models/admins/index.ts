import { Schema, model } from "mongoose";
import { IAdmin, IRole } from "./types";
import {
    ErrInvalidAddress,
    QUERY_LIMIT,
    isAddress,
    toChecksumAddress
} from "../../constants";
import { databaseResponseTimeHistogram } from "../../metrics";

/* This code is defining a Mongoose schema for the `Admin` model. The schema specifies the structure of
the `Admin` documents that will be stored in the database. */
const schema = new Schema<IAdmin>(
    {
        account: {
            type: String,
            required: true,
            // unique: true,
            validate(tokenAddress: string) {
                if (!isAddress(tokenAddress)) throw ErrInvalidAddress;
            }
        },
        role: {
            type: String,
            required: false,
            enum: IRole
        }
    },
    {
        timestamps: true
    }
);

schema.index(
    {
        chainId: 1,
        account: 1
    },
    { unique: true }
);

schema.pre("save", async function (next) {
    const collection = this;
    collection.account = toChecksumAddress(this.account);
    next();
});

const Admin = model<IAdmin>("admins", schema);
Admin.syncIndexes();

export async function grantAdminRoleDB(
    payload: IAdmin
): Promise<IAdmin | null> {
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
        const result = await Admin.findOneAndUpdate<IAdmin>(
            {
                // chainId: payload.chainId,
                account: toChecksumAddress(payload.account)
            },
            payload,
            {
                new: true,
                returnDocument: "after",
                upsert: true
            }
        );

        timer({
            operation: "insert",
            collection: "admins",
            method: "grantAdminRoleDB",
            success: "true"
        });
        return result;
    } catch (error) {
        timer({
            operation: "insert",
            collection: "admins",
            method: "grantAdminRoleDB",
            success: "false"
        });
        return null;
    }
}

export async function getAdminByAccountDB(
    account: string
): Promise<IAdmin | null> {
    const timer = databaseResponseTimeHistogram.startTimer();

    try {
        const admins = await Admin.aggregate<IAdmin>([
            {
                $match: {
                    account: {
                        $eq: toChecksumAddress(account)
                    }
                }
            }
        ]);
        const admin = admins.at(0);
        if (!admin) throw Error();

        timer({
            operation: "find",
            collection: "admins",
            method: "getAdminByAccountDB",
            success: "true"
        });
        return admin;
    } catch (error) {
        timer({
            operation: "find",
            collection: "admins",
            method: "getAdminByAccountDB",
            success: "false"
        });
        return null;
    }
}

export async function getAllAdminsDB({
    offset,
    limit
}: {
    offset: number;
    limit: number;
}): Promise<IAdmin[]> {
    const timer = databaseResponseTimeHistogram.startTimer();
    const safeLimit = Math.min(limit, QUERY_LIMIT);
    try {
        const admins = await Admin.aggregate<IAdmin>([
            { $skip: offset },
            { $limit: safeLimit }
        ]);

        timer({
            operation: "find",
            collection: "admins",
            method: "getAllAdminsDB",
            success: "true"
        });
        return admins;
    } catch (error) {
        timer({
            operation: "find",
            collection: "admins",
            method: "getAllAdminsDB",
            success: "false"
        });
        return [];
    }
}

export async function revokeAdminRoleDB(account: string): Promise<boolean> {
    const timer = databaseResponseTimeHistogram.startTimer();

    try {
        if (!(await getAdminByAccountDB(account))) return false;
        const result = await Admin.deleteOne({
            account: toChecksumAddress(account)
        });

        const { acknowledged } = result;
        timer({
            operation: "delete",
            collection: "admins",
            method: "revokeAdminRoleDB",
            success: "true"
        });
        return acknowledged;
    } catch (error) {
        timer({
            operation: "delete",
            collection: "admins",
            method: "revokeAdminRoleDB",
            success: "false"
        });
        return false;
    }
};
