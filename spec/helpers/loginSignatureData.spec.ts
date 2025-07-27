import { describe, it } from "mocha";
import { expect } from "chai";
import { getUserLoginSignatureData } from "../../src/helpers";

describe("Login Metadata", () => {
	it("should return login metadata", () => {
		const timestamp = Date.now();
		const message = getUserLoginSignatureData(timestamp);

		expect(message).to.equal(
			`I want to login on Lockable Server at ${new Date(
				timestamp
			)}. I accept the Lockable Server Terms of Service https://static.lockable.com/terms.pdf and I am at least 13 years old.`
		);
	});

	// it("should reject if deadline exceed current time", () => {
	// 	const timestamp = Date.now() + 1000;
	// 	const message = loginSignatureData(timestamp);

	// 	expect(message).to.null;
	// });
});
