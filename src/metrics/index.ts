import express from "express";
import client, { collectDefaultMetrics } from "prom-client";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
	name: "http_request_duration_seconds",
	help: "Duration of HTTP requests in seconds",
	labelNames: ["ip", "method", "route", "status_code"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
	name: "database_request_duration_seconds",
	help: "Duration of database requests in seconds",
	labelNames: ["operation", "collection", "method", "success"],
});

export default async function startMetricsServer() {
	const port = 8080;

	collectDefaultMetrics();

	app.get("/metrics", async (_, res) => {
		res.setHeader("Content-Type", client.register.contentType);
		res.send(await client.register.metrics());
	});

	app.listen(port, () => {
		console.log(`Metrics Server listening on: http://localhost:${port}`);
	});
}
