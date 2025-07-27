import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../../src/helpers";

const connectDB = () => {
	mongoose.connect(MONGODB_URI, {
		dbName: DB_NAME,
	});
};

connectDB();
