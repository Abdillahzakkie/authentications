import { describe, it } from "mocha";
import { expect } from "chai";
import { validateLoginSignature } from "../../../src/helpers";
import { getSignature } from "../../../src/mocks";

describe("validateLoginSignature", () => {
	let payload: { account: string; signature: string; deadline: number } = {
		account: "",
		signature: "",
		deadline: 0,
	};

	beforeEach(async () => {
		const result = await getSignature();
		if (!result) throw new Error("validation failed");
		const { account, signature, deadline } = result;

		payload = {
			account,
			signature,
			deadline,
		};
	});

	it("should validate if payload is valid", () => {
		expect(
			validateLoginSignature(
				payload.account,
				payload.signature,
				payload.deadline
			)
		).to.be.true;
	});

	it("should reject if payload is invalid", () => {
		const deadline = 0;
		expect(validateLoginSignature(payload.account, payload.signature, deadline))
			.to.be.false;
	});
});
