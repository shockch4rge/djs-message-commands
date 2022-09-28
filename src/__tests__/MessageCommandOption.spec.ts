import { MessageCommandBuilder, MessageCommandOptionType, MessageCommandStringOption } from "../";

const PREFIX = ">>";

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

		const expectedRegex = /^>>(test-name)\s+"(choice-1|choice-2|choice-3)"$/gm;

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.String);
		expect(builder.toRegex(PREFIX)).toEqual(expectedRegex);
	});
});
