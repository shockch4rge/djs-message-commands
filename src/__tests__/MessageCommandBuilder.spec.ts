import { Collection, Message, PermissionsBitField, Role } from "discord.js";

import { MessageCommandBuilder, MessageCommandOptionType } from "../";

const PREFIX = ">>";

describe("MessageCommandBuilder constructing and testing", () => {
	it("throw errors for setting missing/incorrect properties", () => {
		const builder = new MessageCommandBuilder();

		expect(() => builder.setName("")).toThrow("Command name must be at least one character long.");
		expect(() => builder.setDescription("")).toThrow(
			"Command description must be at least one character long."
		);
		expect(() => builder.setAliases([])).toThrow(
			"There must be at least one alias provided in the array."
		);
		expect(() => builder.setAliases([""])).toThrow("Aliases must be at least one character long.");
		expect(() => builder.setRoles([])).toThrow(
			"There must be at least one role ID provided in the array."
		);
		expect(() => builder.setPermissions([])).toThrow(
			"There must be at least one permission provided in the array."
		);
	});

	it("build a message command with a name and description", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
	});

	it("build four command options and check each one's types", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test");
		builder.setDescription("test description");
		builder.addStringOption(option =>
			option.setName("string").setDescription("string option description")
		);
		builder.addNumberOption(option =>
			option.setName("number").setDescription("number option description")
		);
		builder.addBooleanOption(option =>
			option.setName("boolean").setDescription("boolean option description")
		);
		builder.addMemberOption(option =>
			option.setName("mentionable").setDescription("mentionable option description")
		);

		const mockMessage = {
			content: '>>test-name "string" 12 true <@!12345678901234567>',
			member: {
				roles: {
					cache: new Collection<string, Role>(),
				},
				permissions: new PermissionsBitField(),
			},
		} as Message;

		const [errors, options] = builder.validate(mockMessage);

		expect(errors).toBeFalsy();

		expect(builder.options.length).toBe(4);
		expect(builder.options[0].type).toBe(MessageCommandOptionType.String);
		expect(builder.options[1].type).toBe(MessageCommandOptionType.Number);
		expect(builder.options[2].type).toBe(MessageCommandOptionType.Boolean);
		expect(builder.options[3].type).toBe(MessageCommandOptionType.Member);

		expect(options.length).toBe(4);
		expect(options[0]).toBe("string");
		expect(options[1]).toBe(12);
		expect(options[2]).toBe(true);
		expect(options[3]).toBe("12345678901234567");
	});

	it("expect 0 errors from validate() method", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test");
		builder.setDescription("test description");
		builder.setPermissions(["AddReactions"]);
		builder.setRoles(["1234567890"]);
		builder.addStringOption(option =>
			option.setName("test-string-option-name").setDescription("test string option description")
		);
		builder.addNumberOption(option =>
			option.setName("test-number-option-name").setDescription("test number option description")
		);
		builder.addBooleanOption(option =>
			option.setName("test-boolean-option-name").setDescription("test boolean option description")
		);
		builder.addMemberOption(option =>
			option.setName("test-member-option-name").setDescription("test member option description")
		);
		builder.addChannelOption(option =>
			option.setName("test-channel-option-name").setDescription("test channel option description")
		);

		const message = {
			content: '>>test "this" 12 true <@!12345678901234567> <#12345678901234567>',
			guild: {
				roles: {
					cache: new Collection<string, Role>()
						// @ts-ignore null as placeholder role
						.set("not-supposed-to-have", null)
						// @ts-ignore null as placeholder role
						.set("supposed-to-have", null),
				},
			},
			member: {
				permissions: new PermissionsBitField("AddReactions"),
				roles: {
					// @ts-ignore null as placeholder role
					cache: new Collection<string, Role>().set("supposed-to-have", null),
				},
			},
		} as Message;

		const [errors, options] = builder.validate(message);

		expect(errors).toBeFalsy();

		expect(options.length).toBe(5);
		expect(options[0]).toBe("this");
		expect(options[1]).toBe(12);
		expect(options[2]).toBe(true);
		expect(options[3]).toBe("12345678901234567");
		expect(options[4]).toBe("12345678901234567");
	});
});
