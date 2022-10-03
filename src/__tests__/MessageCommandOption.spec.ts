import {
    MessageCommandBuilder, MessageCommandNumberOption, MessageCommandOptionType,
    MessageCommandStringOption
} from "../";

const PREFIX = ">>";

function createNumberOption() {
	return new MessageCommandNumberOption().setName("number").setDescription("number option");
}

beforeAll(() => {
	const numberOption = createNumberOption();

	expect(numberOption.name).toBe("number");
	expect(numberOption.description).toBe("number option");
	expect(numberOption.type).toBe(MessageCommandOptionType.Number);
})

describe("MessageCommandOption constructing and testing", () => {
	it("throw errors for setting missing/incorrect properties", () => {
		const option = new MessageCommandStringOption();

		expect(() => option.setName("")).toThrow("Option name must be at least one character long.");
		expect(() => option.setDescription("")).toThrow(
			"Option description must be at least one character long."
		);
		expect(() => option.addChoices(["", ""])).toThrow(
			"You must provide a name and value for all option choices."
		);
		expect(() => option.addChoices(["", "not-omitted"])).toThrow(
			"You must provide a name and value for all option choices."
		);
		expect(() => option.addChoices(["not-omitted", ""])).toThrow(
			"You must provide a name and value for all option choices."
		);
		expect(() =>
			option.setChoices(
				["", ""],
				["", "not-omitted"],
				["not-omitted", ""],
			)
		).toThrow("You must provide a name and value for all option choices.");

		// test compatibility with min/max length
		option.addChoices(["name", "value"]);

		expect(() =>
			option.setMinLength(5)
		).toThrow("You cannot set a minimum length if choices are provided.")
		expect(() =>
			option.setMaxLength(5)
		).toThrow("You cannot set a maximum length if choices are provided.")
	});

	it("test single string option with regex", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");
		builder.addStringOption(option =>
			option.setName("test-option-name").setDescription("test option description")
		);

		const mockMessage = '>>test-name "option1"';
		const regex = builder.toRegex(PREFIX);

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.String);
		expect(regex).toEqual(/^>>(test-name)\s+"(.+)"$/gm);
		expect(regex.test(mockMessage)).toBe(true);
	});

	it("test multiple aliases and a single string option with regex", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");
		builder.setAliases(["t", "TEST"]);
		builder.addStringOption(option =>
			option.setName("test-option-name").setDescription("test option description")
		);

		const mockMessages = ['>>test-name "option1"', '>>TEST "option1"', '>>t "option1"'];
		const expectedRegex = /^>>(test-name|t|TEST)\s+"(.+)"$/gm;
		const regex = builder.toRegex(PREFIX);

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.aliases.length).toBe(2);
		expect(builder.aliases[0]).toBe("t");
		expect(builder.aliases[1]).toBe("TEST");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.String);
		expect(builder.toRegex(PREFIX)).toEqual(expectedRegex);

		mockMessages.forEach(msg => expect(!!msg.match(regex)).toBe(true));
	});

	it("specify multiple string choices and test with regex", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");

		builder.addStringOption(option =>
			option
				.setName("test-option-name")
				.setDescription("test option description")
				.setChoices(
					["choice-1", "choice-1"],
					["choice-2", "choice-2"],
					["choice-3", "choice-3"],
				)
		);

		const expectedRegex = /^>>(test-name)\s+"(choice-1|choice-2|choice-3)"$/gm;

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.String);
		expect(builder.toRegex(PREFIX)).toEqual(expectedRegex);
	});

	it("number option", () => {
		const option1 = createNumberOption();
		const option2 = createNumberOption();

		option2.addChoices(
			["v1", 24],
			["v2", 42],
			["v3", 0],
			["v4", -25],
		)

		expect(() => option1.setMinValue(-1)).toThrow("Minimum value cannot be less than 0.");
		expect(() => option1.setMaxValue(-1)).toThrow("Maximum value cannot be less than 0.");

		// test incompatible min/max values
		option1.setMinValue(12);
		expect(() => option1.setMaxValue(10)).toThrow();

		option1.setMinValue(0);
		option1.setMaxValue(24);

		expect(option1.minValue).toBe(0);
		expect(option1.maxValue).toBe(24);

		expect(option1.validate("0")).toBe(0);
		expect(option1.validate("24")).toBe(24);
		expect(option1.validate("12")).toBe(12);
		expect(option1.validate("25")).toBe(undefined);
		expect(option1.validate("-1")).toBe(undefined);

		expect(option2.validate("2")).toBe(undefined);
		expect(option2.validate("100")).toBe(undefined);
		expect(option2.validate("24")).toBe(24);
		expect(option2.validate("42")).toBe(42);
		expect(option2.validate("0")).toBe(0);
		expect(option2.validate("-25")).toBe(-25);
	});

	it("test all option types with regex", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");
		builder.setAliases(["t", "TEST"]);
		builder.addStringOption(option =>
			option.setName("test-option-name").setDescription("test option description")
		);
		builder.addNumberOption(option =>
			option.setName("test-number-option-name").setDescription("test number option description")
		);
		builder.addBooleanOption(option =>
			option.setName("test-boolean-option-name").setDescription("test boolean option description")
		);
		builder.addMemberOption(option =>
			option
				.setName("test-mentionable-option-name")
				.setDescription("test mentionable option description")
		);
		builder.addChannelOption(option =>
			option.setName("test-channel-option-name").setDescription("test channel option description")
		);

		const mockMessage = '>>test-name "lol" 21 true <@!12345123451234512> <#12345123451234512>';

		const expectedRegex =
			/^>>(test-name|t|TEST)\s+"(.+)"\s+(\d+)\s+(true|false)\s+<@!?(\d{17,19})>\s+<#(\d{17,19})>$/gm;
		const actualRegex = builder.toRegex(PREFIX);

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.aliases.length).toBe(2);
		expect(builder.aliases[0]).toBe("t");
		expect(builder.aliases[1]).toBe("TEST");
		expect(builder.options.length).toBe(5);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.String);
		expect(builder.options[1].name).toBe("test-number-option-name");
		expect(builder.options[1].description).toBe("test number option description");
		expect(builder.options[1].type).toBe(MessageCommandOptionType.Number);
		expect(builder.options[2].name).toBe("test-boolean-option-name");
		expect(builder.options[2].description).toBe("test boolean option description");
		expect(builder.options[2].type).toBe(MessageCommandOptionType.Boolean);
		expect(builder.options[3].name).toBe("test-mentionable-option-name");
		expect(builder.options[3].description).toBe("test mentionable option description");
		expect(builder.options[3].type).toBe(MessageCommandOptionType.Member);
		expect(builder.options[4].name).toBe("test-channel-option-name");
		expect(builder.options[4].description).toBe("test channel option description");
		expect(builder.options[4].type).toBe(MessageCommandOptionType.Channel);
		expect(actualRegex).toEqual(expectedRegex);
		expect(actualRegex.test(mockMessage)).toBe(true);
	});


});
