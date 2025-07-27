import { describe, it } from "mocha";
import { expect } from "chai";
import { validateLoginInput } from "../../../src/helpers";

describe("validateLoginInput", () => {
	let payload: any = {};

	beforeEach(() => {
		payload = {
			account: "alice",
			signature: "123",
			deadline: 123,
		};
	});

	it("should validate if payload is valid", () => {
		expect(validateLoginInput(payload)).to.be.true;
	});

	it("should reject if payload is invalid", () => {
		payload.invalid = true;
		expect(validateLoginInput(payload)).to.be.false;
	});
});
