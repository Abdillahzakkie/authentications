import { describe } from "mocha";
import { expect } from "chai";
import { TEST_WALLET } from "../../../src/helpers";
import { generateJWT, verifyJWT } from "../../../src/services";

describe("auth", () => {
	const account = TEST_WALLET;

	describe("generateJWT", () => {
		it("should generate a jwt token", async () => {
			const result = await generateJWT(account);
			expect(result.account).to.equal(account);
			expect(result.token).not.null;
			expect(result.expirationDate).not.null;
		});
	});

	describe("verifyJWT", () => {
		let account: string = "";
		let token: string = "";
		let expirationDate: Date = new Date();

		before(async () => {
			const {
				token: _token,
				expirationDate: _expirationDate,
				account: _account,
			} = await generateJWT(TEST_WALLET);
			token = _token;
			account = _account;
			expirationDate = _expirationDate;
		});

		it("should verify a jwt token", async () => {
			const result = await verifyJWT(token);
			expect(result.account).to.equal(account);
			expect(new Date(result.expirationDate).getTime()).to.equal(
				expirationDate.getTime()
			);
			expect(result.token).to.equal(token);
		});
	});
});
