import { describe, it } from "mocha";
import { expect } from "chai";
import {
	ErrIncompleteFields,
	ErrInternalServerError,
	ErrInvalidAction,
	ErrInvalidAddress,
	ErrInvalidChain,
	ErrInvalidFields,
	ErrInvalidFileType,
	ErrInvalidRole,
	ErrInvalidSignature,
	ErrInvalidURL,
	ErrResourceAlreadyExist,
	ErrResourceNotFound,
	ErrSignatureExpired,
	ErrUnauthorized,
} from "../../../src/helpers";

describe("errors", () => {
	describe("ErrInvalidFields", () => {
		it("should validate the field", () => {
			expect(ErrInvalidFields).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidAddress", () => {
		it("should validate the field", () => {
			expect(ErrInvalidAddress).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidURL", () => {
		it("should validate the field", () => {
			expect(ErrInvalidURL).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidSignature", () => {
		it("should validate the field", () => {
			expect(ErrInvalidSignature).to.be.instanceOf(Error);
		});
	});

	describe("ErrSignatureExpired", () => {
		it("should validate the field", () => {
			expect(ErrSignatureExpired).to.be.instanceOf(Error);
		});
	});

	describe("ErrIncompleteFields", () => {
		it("should validate the field", () => {
			expect(ErrIncompleteFields).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidAction", () => {
		it("should validate the field", () => {
			expect(ErrInvalidAction).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidChain", () => {
		it("should validate the field", () => {
			expect(ErrInvalidChain).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidRole", () => {
		it("should validate the field", () => {
			expect(ErrInvalidRole).to.be.instanceOf(Error);
		});
	});

	describe("ErrInvalidFileType", () => {
		it("should validate the field", () => {
			expect(ErrInvalidFileType).to.be.instanceOf(Error);
		});
	});

	describe("ErrUnauthorized", () => {
		it("should validate the field", () => {
			expect(ErrUnauthorized).to.be.instanceOf(Error);
		});
	});

	describe("ErrResourceNotFound", () => {
		it("should validate the field", () => {
			expect(ErrResourceNotFound).to.be.instanceOf(Error);
		});
	});

	describe("ErrResourceAlreadyExist", () => {
		it("should validate the field", () => {
			expect(ErrResourceAlreadyExist).to.be.instanceOf(Error);
		});
	});

	describe("ErrInternalServerError", () => {
		it("should validate the field", () => {
			expect(ErrInternalServerError).to.be.instanceOf(Error);
		});
	});
});
