import { describe, it } from "mocha";
import { expect } from "chai";
import { TEST_WALLET, isAddress } from "../../src/helpers";

describe("isAddress", () => {
	it("should validate that isAddress function works", () => {
		expect(isAddress(TEST_WALLET)).to.be.true;
	});

	it("should validate that isAddress function works", () => {
		expect(isAddress("wrong address")).to.be.false;
	});
});
