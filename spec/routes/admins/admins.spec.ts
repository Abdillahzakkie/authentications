import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { ethers } from "ethers";
import app from "../../../src/app";
import { getSignature } from "../../../src/mocks";
import {
	getAdminByAccount,
	grantAdminRole,
	revokeAdminRole,
} from "../../../src/services";
import { IAdmin } from "../../../src/models/admins/types";

chai.use(chaiHttp);

describe("Admins", () => {
	const ZERO_ADDRESS = ethers.constants.AddressZero;

	const chainId = 5;
	let account: string,
		token: string = "";

	before(async () => {
		const payload = await getSignature();
		if (!payload) return;

		const {
			body: { data },
		}: { body: { data: { account: string; token: string } } } = await chai
			.request(app)
			.post("/api/login")
			.send(payload);
		account = data.account;
		token = data.token;

		token;
	});

	after(async () => {
		await revokeAdminRole(chainId, account);
	});

	beforeEach(async () => {
		await revokeAdminRole(chainId, account);
		await grantAdminRole({
			chainId,
			account,
			roleName: "admin",
		});
	});

	describe("'/api/admins/all' Get all admins", () => {
		it("should return all admins", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin[];
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.get(`/api/admins/all?chainId=${chainId}&offset=0`)
				.set("Authorization", `Bearer ${token}`);
			const admin = body.data[0];
			if (!admin) throw Error("get all admins failed");
			expect(statusCode).to.equal(200);
			expect(body.code).to.equal(statusCode);
			expect(body.data).to.be.an("array");
			expect(body.data.length).to.equal(1);
			expect(admin.chainId).to.equal(chainId);
			expect(admin.account).to.equal(account);
			expect(admin.role.toLowerCase()).to.equal("admin");
			expect(body.message).to.be.null;
			expect(admin).to.be.an("object");
			expect(admin.chainId).to.be.a("number");
			expect(admin.account).to.be.a("string");
			expect(admin.role).to.be.a("string");
		});

		it("should reject if user is not authenticated", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin[];
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.get(`/api/admins/all?chainId=${chainId}&offset=0`);

			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.equal("invalid action");
		});

		it("should reject is offset is invaliad", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin[];
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.get(`/api/admins/all?chainId=${chainId}&offset=invalid`)
				.set("Authorization", `Bearer ${token}`);

			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.equal("invalid fields");
		});
	});

	describe("'/api/admins/roles/all' Get all roles", () => {
		it("should return all roles", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: string[];
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.get(`/api/admins/roles/all?chainId=${chainId}&offset=0`)
				.set("Authorization", `Bearer ${token}`);
			const role = body.data;
			expect(statusCode).to.equal(200);
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.be.null;
			expect(role).to.be.an("array");
			expect(role.length).to.be.greaterThan(0);
		});

		it("should reject if user is not authenticated", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: string[];
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.get(`/api/admins/roles/all?chainId=${chainId}&offset=0`);

			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.equal("invalid action");
		});
	});

	describe("'/api/admins/grant' Grant admin role", () => {
		after(async () => {
			await revokeAdminRole(chainId, ZERO_ADDRESS);
		});

		it("should grant admin role", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(
					`/api/admins/grant?chainId=${chainId}&account=${ZERO_ADDRESS}&role=admin`
				)
				.set("Authorization", `Bearer ${token}`);
			const admin = body.data;
			expect(statusCode).to.equal(201);
			expect(body.code).to.equal(statusCode);
			expect(admin).to.be.an("object");
			expect(admin.chainId).to.equal(chainId);
			expect(admin.chainId).to.be.a("number");
			expect(admin.account).to.be.a("string");
			expect(admin.role).to.be.a("string");
		});

		it("should reject if account is invalid", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(`/api/admins/grant?chainId=${chainId}&account=invalid&role=admin`)
				.set("Authorization", `Bearer ${token}`);
			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body).to.be.an("object");
			expect(body.message).to.equal("invalid address");
		});

		it("should reject if role is invalid", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(
					`/api/admins/grant?chainId=${chainId}&account=${account}&role=invalid`
				)
				.set("Authorization", `Bearer ${token}`);
			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body).to.be.an("object");
			expect(body.message).to.equal("invalid role");
		});

		it("should reject if user is not authenticated", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: IAdmin;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(
					`/api/admins/grant?chainId=${chainId}&account=${account}&role=admin`
				);

			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body).to.be.an("object");
			expect(body.message).to.equal("invalid action");
		});
	});

	describe("'/api/admins/revoke' Revoke admin role", () => {
		beforeEach(async () => {
			await grantAdminRole({
				chainId,
				account: ZERO_ADDRESS,
				roleName: "admin",
			});
		});

		after(async () => {
			await revokeAdminRole(chainId, ZERO_ADDRESS);
		});

		it("should revoke admin role", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: null;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(`/api/admins/revoke?chainId=${chainId}&account=${ZERO_ADDRESS}`)
				.set("Authorization", `Bearer ${token}`);
			expect(statusCode).to.equal(200);
			expect(body.code).to.equal(statusCode);
			expect(await getAdminByAccount(chainId, ZERO_ADDRESS)).to.be.null;
		});

		it("should reject if account is invalid", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: null;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(`/api/admins/revoke?chainId=${chainId}&account=invalid`)
				.set("Authorization", `Bearer ${token}`);
			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.equal("invalid address");
		});

		it("should reject if user is not authenticated", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: null;
					code: number;
					message?: string;
				};
			} = await chai
				.request(app)
				.post(`/api/admins/revoke?chainId=${chainId}&account=${account}`);

			expect(statusCode).to.equal(400);
			expect(body.code).to.equal(statusCode);
			expect(body).to.be.an("object");
			expect(body.message).to.equal("invalid action");
		});
	});

	describe("'/api/admins/:account' Get admin by account", () => {
		before(async () => {
			await grantAdminRole({
				chainId,
				account: ZERO_ADDRESS,
				roleName: "admin",
			});
		});

		after(async () => {
			await revokeAdminRole(chainId, ZERO_ADDRESS);
		});

		it("should return admin", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: { data?: IAdmin; code: number; message?: string };
			} = await chai
				.request(app)
				.get(`/api/admins/${ZERO_ADDRESS}?chainId=${chainId}`)
				.set("Authorization", `Bearer ${token}`);
			expect(statusCode).to.equal(200);
			expect(body.code).to.equal(statusCode);
		});
	});
});
