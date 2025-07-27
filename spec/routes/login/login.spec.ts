import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../../src/app";
import { getSignature } from "../../../src/mocks";

chai.use(chaiHttp);

describe("Login", () => {
	const chainId = 5;
	let payload: { account: string; signature: string; deadline: number } = {
		account: "",
		signature: "",
		deadline: 0,
	};

	before(async () => {
		const result = await getSignature();
		if (!result) return;
		payload = result;
	});

	describe("'/api/login/' GET Login Metadata ", () => {
		it("should return login metadata", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: { data: string; code: number; message?: Error | null };
			} = await chai
				.request(app)
				.get(`/api/login?chainId=${chainId}`)
				.query({ deadline: Date.now() });

			expect(statusCode).to.equal(200);

			expect(body).to.be.an("object");
			expect(body).to.have.property("data");
			expect(body).to.have.property("code");
			expect(body).to.have.property("message");
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.be.null;

			// validates data fields in response body
			expect(body.data).not.null;
			expect(body.data).not.undefined;
			expect(body.data).not.empty;
			expect(body.data).to.be.string;
		});

		it("should return status 400 if deadlines was not passed", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: { data: string; code: number; message?: Error | null };
			} = await chai.request(app).get(`/api/login?chainId=${chainId}`);

			expect(statusCode).to.equal(400);

			expect(body).to.be.an("object");
			expect(body).to.have.property("code");
			expect(body).to.have.property("message");
			expect(body.code).to.equal(statusCode);
		});
	});

	describe("'/api/login/' POST Login", () => {
		it("should login user with valid credentials", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: { account: string; token: string; expirationDate: string };
					code: number;
					message?: Error | null;
				};
			} = await chai
				.request(app)
				.post(`/api/login?chainId=${chainId}`)
				.send(payload);
			expect(statusCode).to.equal(201);
			expect(statusCode).to.equal(body.code);
			expect(body.data).to.have.property("account");
			expect(body.data).to.have.property("token");
			expect(body.data).to.have.property("expirationDate");
			expect(body.message).to.be.null;
		});

		it("should validate that cookies is properly set", async () => {
			const response = await chai
				.request(app)
				.post(`/api/login?chainId=${chainId}`)
				.send(payload);
			expect(response).to.have.cookie("token");
		});

		it("should return 400 if signature is invalid", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: { account: string; token: string; expirationDate: string };
					code: number;
					message?: Error | null;
				};
			} = await chai.request(app).post(`/api/login?chainId=${chainId}`).send({
				account: payload.account,
				signature: "invalid",
				deadline: payload.deadline,
			});

			expect(statusCode).to.equal(400);
			expect(body).to.have.be.an("object");
			expect(body).to.have.property("code");
			expect(body).to.have.property("message");
			expect(statusCode).to.equal(body.code);
			expect(body.message).to.equal("invalid signature");
		});
	});

	describe("'/api/login/verify", () => {
		let account: string,
			token: string = "";

		before(async () => {
			const {
				body: { data },
			}: { body: { data: { account: string; token: string } } } = await chai
				.request(app)
				.post(`/api/login?chainId=${chainId}`)
				.send(payload);
			account = data.account;
			token = data.token;
		});

		it("should verify logged in user using cookies", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: { account: string; token: string; expirationDate: string };
					code: number;
					message?: Error | null;
				};
			} = await chai
				.request(app)
				.get(`/api/login/verify?chainId=${chainId}`)
				.set("Cookie", `token=${token}`);
			expect(statusCode).to.equal(200);
			expect(body).to.have.property("data");
			expect(body).to.have.property("code");
			expect(body).to.have.property("message");
			expect(body.data).to.have.property("account");
			expect(body.data).to.have.property("token");
			expect(body.data).to.have.property("expirationDate");

			expect(body.data.account).to.equal(account);
			expect(body.data.token).to.equal(token);
			expect(body.data.expirationDate).to.be.string;
		});

		it("should verify logged in user using JWT token", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: { account: string; token: string; expirationDate: string };
					code: number;
					message?: Error | null;
				};
			} = await chai
				.request(app)
				.get(`/api/login/verify?chainId=${chainId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(statusCode).to.equal(200);
			expect(body).to.have.property("data");
			expect(body).to.have.property("code");
			expect(body).to.have.property("message");
			expect(body.data).to.have.property("account");
			expect(body.data).to.have.property("token");
			expect(body.data).to.have.property("expirationDate");

			expect(body.data.account).to.equal(account);
			expect(body.data.token).to.equal(token);
			expect(body.data.expirationDate).to.be.string;
		});

		it("should return if token is invalid", async () => {
			const {
				statusCode,
				body,
			}: {
				statusCode: number;
				body: {
					data: { account: string; token: string; expirationDate: string };
					code: number;
					message?: Error | null;
				};
			} = await chai.request(app).get(`/api/login/verify?chainId=${chainId}`);
			expect(statusCode).to.equal(400);
			expect(body).to.have.property("code");
			expect(body).to.have.property("message");
			expect(body.code).to.equal(statusCode);
			expect(body.message).to.equal("invalid action");
		});
	});
});
