import { describe, it } from "mocha";
import { expect } from "chai";
import "../../utils/connectDB";
import {
	getAdminByAccountDB,
	getAllAdminsDB,
	grantAdminRoleDB,
	revokeAdminRoleDB,
} from "../../../src/models";
import { IRole } from "../../../src/models/admins/types";
import { TEST_WALLET, toChecksumAddress } from "../../../src/helpers";

describe("admin model", () => {
	const chainId: number = 1;
	let account: string = "";

	before(() => {
		account = toChecksumAddress(TEST_WALLET);
	});

	afterEach(async () => {
		await revokeAdminRoleDB(chainId, account);
	});

	describe("grantAdminRoleDB", () => {
		// it("should create an admin", async () => {
		// 	const admin = await grantAdminRoleDB({
		// 		chainId,
		// 		account,
		// 		role: IRole.ADMIN,
		// 	});

		// 	expect(admin.account).to.be.equal(account);
		// 	expect(admin.role).to.be.equal(IRole.ADMIN);
		// 	expect(admin.chainId).to.be.equal(chainId);
		// });

		it("should update admin role if role changes", async () => {
			await grantAdminRoleDB({
				chainId,
				account,
				role: IRole.ADMIN,
			});

			const updatedAdmin = await grantAdminRoleDB({
				chainId,
				account,
				role: IRole.NONE,
			});

			if (!updatedAdmin) throw new Error("admin grant role failed");

			expect(updatedAdmin.role).to.equal(IRole.NONE);
		});
	});

	describe("getAdminByAccountDB", () => {
		before(async () => {
			await grantAdminRoleDB({ chainId, account, role: IRole.ADMIN });
		});

		it("should get admin", async () => {
			const admin = await getAdminByAccountDB(chainId, account);
			if (!admin) throw new Error("admin get admin role failed");
			expect(admin).not.null;
			expect(admin.role).to.equal(IRole.ADMIN);
			expect(admin.account).to.equal(account);
			expect(admin.chainId).to.equal(chainId);
		});

		it("should return null if data does not exists", async () => {
			const admin = await getAdminByAccountDB(5, TEST_WALLET);
			expect(admin).to.be.null;
		});
	});

	describe("getAllAdminsDB", () => {
		before(async () => {
			await grantAdminRoleDB({ chainId, account, role: IRole.ADMIN });
		});

		it("should get all admins", async () => {
			const admins = await getAllAdminsDB(chainId, 0);
			const admin = admins[0];
			if (!admin) throw new Error("admin get all admins failed");
			expect(admins).not.null;
			expect(admins.length).to.equal(1);
			expect(admin.role).to.equal(IRole.ADMIN);
			expect(admin.account).to.equal(account);
			expect(admin.chainId).to.equal(chainId);
		});

		it("should return empty array if no admins", async () => {
			const admins = await getAllAdminsDB(5, 0);
			expect(admins).to.be.empty;
		});
	});

	describe("revokeAdminRoleDB", () => {
		before(async () => {
			await grantAdminRoleDB({ chainId, account, role: IRole.ADMIN });
		});

		it("should revoke admin role", async () => {
			const result = await revokeAdminRoleDB(chainId, account);
			expect(result).to.be.true;
			const admin = await getAdminByAccountDB(chainId, account);
			expect(admin).to.be.null;
			const admins = await getAllAdminsDB(chainId, 0);
			expect(admins).to.be.empty;
			expect(result).to.be.true;
		});

		it("should return false if admin role is not found", async () => {
			const result = await revokeAdminRoleDB(5, account);
			expect(result).to.be.false;
		});
	});
});
