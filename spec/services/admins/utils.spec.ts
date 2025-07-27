import { describe, it } from "mocha";
import { expect } from "chai";
import { getRole } from "../../../src/services/admins/utils";
import { IRole } from "../../../src/models/admins/types";
import { ErrInvalidRole } from "../../../src/helpers";

describe("utils", () => {
	describe("getRole", () => {
		it("should return the ADMIN role", () => {
			expect(getRole(IRole.ADMIN)).to.equal(IRole.ADMIN);
		});

		it("should return the NONE role", () => {
			expect(getRole(IRole.NONE)).to.equal(IRole.NONE);
		});

		it("should throw an error if the role is invalid", () => {
			expect(() => getRole("invalid")).to.throw(ErrInvalidRole);
		});
	});
});
