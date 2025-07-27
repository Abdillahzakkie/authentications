import "dotenv/config";
import app from "./app";
import { NODE_ENV, shutdown, cron } from "./constants";
import { connectMongoDB } from "./databases";
import startMetricsServer from "./metrics";

const port = process.env["PORT"] || 8080;

app.listen(port, async () => {
	try {
		console.log(`Server listening on: http://localhost:${port}`);
		if (NODE_ENV === "production") startMetricsServer();
		shutdown();
		connectMongoDB();
		cron();
	} catch (error) {
		return;
	}
});
