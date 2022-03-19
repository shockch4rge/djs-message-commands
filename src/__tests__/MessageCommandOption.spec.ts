import { MessageCommandBuilder, MessageCommandOptionType, MessageCommandStringOption } from '../';

const PREFIX = ">>"

describe("MessageCommandOption constructing and testing", () => {
	it("throw errors for setting missing/incorrect properties", () => {
		const option = new MessageCommandStringOption();

		expect(() => option.setName("")).toThrow("Option name must be at least one character long.");
		expect(() => option.setDescription("")).toThrow(
			"Option description must be at least one character long."
		);
		expect(() => option.addChoice("", "")).toThrow(
			"You must provide a name and value for the option choice."
		);
		expect(() => option.addChoice("", "not-omitted")).toThrow(
			"You must provide a name for the option choice."
		);
		expect(() => option.addChoice("not-omitted", "")).toThrow(
			"You must provide a value for the option choice."
		);
		expect(() =>
			option.setChoices([
				["", ""],
				["", "not-omitted"],
				["not-omitted", ""],
			])
		).toThrow("You must provide a name and value for every option choice.");
	});

	it("specify multiple string choices and test with regex", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");

		builder.addStringOption(option =>
			option
				.setName("test-option-name")
				.setDescription("test option description")
				.setChoices([
					["choice-1", "choice-1"],
					["choice-2", "choice-2"],
					["choice-3", "choice-3"],
				])
		);

		const expectedRegex = /^>>(test-name)\s(choice-1|choice-2|choice-3)$/gm;

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.STRING);
		expect(builder.toRegex(PREFIX)).toEqual(expectedRegex);
	});
});
