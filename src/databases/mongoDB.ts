import mongoose, { ConnectOptions } from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constants";

export const connectMongoDB = () => {
	try {
		mongoose.set("strictQuery", false);

		const options: ConnectOptions = {
			enableUtf8Validation: true,
			ignoreUndefined: true,
			dbName: DB_NAME,
		};

		mongoose.connect(MONGODB_URI, options);
		console.log("MongoDB database connected!");
	} catch (error: any) {
		console.log("error while connecting mongodb: ", error.message);
		return;
	}
};
