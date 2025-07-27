import { describe, it } from "mocha";
import { expect } from "chai";
import "../../utils/connectDB";
import { ErrResourceNotFound, TEST_WALLET } from "../../../src/helpers";
import { grantAdminRoleDB, revokeAdminRoleDB } from "../../../src/models";
import {
	getAdminByAccount,
	getAllAdmins,
	getAllRoles,
	grantAdminRole,
	revokeAdminRole,
} from "../../../src/services";
import { IRole } from "../../../src/models/admins/types";

describe("services: admins", () => {
	const chainId: number = 1;
	const account: string = TEST_WALLET;

	describe("getAdminByAccount", () => {
		before(async () => {
			await grantAdminRoleDB({ chainId, account, role: IRole.ADMIN });
		});

		after(async () => {
			await revokeAdminRole(chainId, account);
		});

		it("should return admin", async () => {
			const admin = await getAdminByAccount(chainId, account);
			if (!admin) throw new Error("admin get admin role failed");
			expect(admin).not.null;
			expect(admin.role).to.equal(IRole.ADMIN);
			expect(admin.account).to.equal(account);
			expect(admin.chainId).to.equal(chainId);
		});

		it("should return null if admin does not exist", async () => {
			const admin = await getAdminByAccount(5, TEST_WALLET);
			expect(admin).to.be.null;
		});
	});

	describe("getAllRoles", () => {
		it("should return all roles", async () => {
			const roles = await getAllRoles();
			expect(roles).not.null;
			expect(roles).to.not.empty;
		});
	});

	describe("getAllAdmins", () => {
		before(async () => {
			await grantAdminRoleDB({ chainId, account, role: IRole.ADMIN });
		});

		after(async () => {
			await revokeAdminRole(chainId, account);
		});

		it("should return all admins in database", async () => {
			const admins = await getAllAdmins(chainId, 0);
			const admin = admins[0];
			if (!admin) throw new Error("admin get all admins failed");
			expect(admins).not.null;
			expect(admins.length).to.equal(1);
			expect(admin.role).to.equal(IRole.ADMIN);
			expect(admin.account).to.equal(account);
			expect(admin.chainId).to.equal(chainId);
		});
	});

	describe("grantAdminRole", () => {
		after(async () => {
			await revokeAdminRole(chainId, account);
		});

		it("should grant admin role", async () => {
			const result = await grantAdminRole({
				chainId,
				account,
				roleName: IRole.ADMIN,
			});
			const admin = await getAdminByAccount(chainId, account);
			if (!admin) throw ErrResourceNotFound;
			expect(admin).not.null;
			expect(admin.role).to.equal(result.role);
			expect(admin.account).to.equal(result.account);
			expect(admin.chainId).to.equal(result.chainId);
		});
	});

	describe("revokeAdminRole", () => {
		beforeEach(async () => {
			await grantAdminRoleDB({ chainId, account, role: IRole.ADMIN });
		});

		after(async () => {
			await revokeAdminRoleDB(chainId, account);
		});

		it("should revoke admin role", async () => {
			const result = await revokeAdminRole(chainId, account);
			const admin = await getAdminByAccount(chainId, account);
			expect(result).to.be.true;
			expect(admin).to.be.null;
		});

		it("should return false is admin does not exist", async () => {
			const result = await revokeAdminRole(5, account);
			expect(result).to.be.false;
		});
	});
});
