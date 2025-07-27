import { describe, it } from "mocha";
import { expect } from "chai";
import { ErrResourceNotFound, getErrorResponse } from "../../../src/helpers";

describe("getErrorResponse", () => {
	it("should validate error response", () => {
		const error = getErrorResponse(ErrResourceNotFound);
		expect(error.code).to.equal(404);
		expect(error.message).to.equal("resource not found");
	});
});
