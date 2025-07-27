import { CronJob } from "cron";
import { removeExpiredUsersTokens } from "../services";

/**
 * Initializes and starts two cron jobs:
 *
 * 1. `retrieveLatestEtherPriceJob`: Runs every 30 minutes to retrieve the latest Ether price.
 * 2. `nftPriceUpdaterJob`: Runs every 15 minutes to refresh outdated NFT prices.
 *
 * Both jobs are started immediately upon creation.
 *
 * @returns {Promise<void>} A promise that resolves when the cron jobs are initialized and started.
 * @throws Will silently catch and ignore any errors that occur during the initialization of the cron jobs.
 */
export default async function cron(): Promise<void> {
	try {
		const removeExpiredTokensJob = new CronJob(
			"*/1 * * * *", // 1 minutes
			async () => {
				removeExpiredUsersTokens();
			},
			null,
			true
		);

		removeExpiredTokensJob.start();
	} catch (error) {
		return;
	}
}
