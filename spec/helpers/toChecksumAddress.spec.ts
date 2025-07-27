import { describe, it } from "mocha";
import { expect } from "chai";
import { toChecksumAddress } from "../../src/helpers";

describe("toChecksumAddress", () => {
	let address: string = "";

	beforeEach(() => {
		address = "0x19412e786784eB11291Ac08De31139FFA88014Ce";
	});

	it("should convert address to checksum address", () => {
		expect(toChecksumAddress(address.toLowerCase())).to.equal(
			toChecksumAddress(address)
		);
	});

	// it("should reject invalid address", () => {
	// 	expect(toChecksumAddress("wrong address")).to.be.instanceOf(Error);
	// });
});
