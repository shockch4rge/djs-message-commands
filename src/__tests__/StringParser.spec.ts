import { StringParser } from '../StringParser';

const parser = new StringParser();

describe("StringParser", () => {
	it("parse a string into a string", () => {
		const string = "string";

		expect(parser.parse(string)).toBe("string");
	});

	it("parse a string into a number", () => {
		const string = "10";

		expect(parser.parse(string)).toBe(10);
	});

	it("parse a string into a boolean", () => {
		const trueString = "true";
		const falseString = "false";

		expect(parser.parse(trueString)).toBe(true);
		expect(parser.parse(falseString)).toBe(false);
	});

	it("parse a member mention into a member ID", () => {
		const string = "<@!123456789012345678>";

		expect(parser.parse(string)).toBe("123456789012345678");
	});

	it("parse a channel mention into a channel ID", () => {
		const string = "<#123456789012345678>";

		expect(parser.parse(string)).toBe("123456789012345678");
	});

	it("parse a string into multiple types", () => {
		const string = "string 10 true false <@!123456789012345678> <#123456789012345678>".trim().split(" ");

		expect(parser.parse(string[0])).toBe("string");
		expect(parser.parse(string[1])).toBe(10);
		expect(parser.parse(string[2])).toBe(true);
		expect(parser.parse(string[3])).toBe(false);
		expect(parser.parse(string[4])).toBe("123456789012345678");
		expect(parser.parse(string[5])).toBe("123456789012345678");
	});
});
