import { expect } from "chai";
import { describe, it } from "mocha";
import {
	DB_NAME,
	JWT_SECRET,
	MONGODB_URI,
	NODE_ENV,
	PORT,
	QUERY_LIMIT,
	REDIS_URI,
	RPC_URL,
	TEST_WALLET,
	TEST_WALLET_KEY,
} from "../../src/helpers";

describe("environment", () => {
	describe("PORT", () => {
		it("it should set port number correctly", () => {
			expect(PORT).to.equal("5000");
		});
	});

	describe("QUERY_LIMIT", () => {
		it("it should set QUERY_LIMIT correctly", () => {
			expect(QUERY_LIMIT).to.equal(50);
		});
	});

	describe("NODE_ENV", () => {
		it("it should set NODE_ENV correctly", () => {
			expect(NODE_ENV).to.equal("testing");
		});
	});

	describe("MONGODB_URI", () => {
		it("it should set MONGODB_URI correctly", () => {
			expect(MONGODB_URI).not.undefined;
		});
	});

	describe("DB_NAME", () => {
		it("it should set DB_NAME correctly", () => {
			expect(DB_NAME).not.undefined;
		});
	});

	describe("REDIS_URI", () => {
		it("it should set REDIS_URI correctly", () => {
			expect(REDIS_URI).not.undefined;
		});
	});

	describe("JWT_SECRET", () => {
		it("it should set JWT_SECRET correctly", () => {
			expect(JWT_SECRET).not.undefined;
		});
	});

	describe("RPC_URL", () => {
		it("it should set RPC_URL correctly", () => {
			expect(RPC_URL).not.undefined;
		});
	});

	describe("TEST_WALLET", () => {
		it("it should set TEST_WALLET correctly", () => {
			expect(TEST_WALLET).not.undefined;
		});
	});

	describe("TEST_WALLET_KEY", () => {
		it("it should set TEST_WALLET_KEY correctly", () => {
			expect(TEST_WALLET_KEY).not.undefined;
		});
	});
});
