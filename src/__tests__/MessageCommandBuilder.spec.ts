import {
    Collection, GuildMember, GuildMemberRoleManager, Message, Permissions, Role
} from "discord.js";

import { roleMention } from "@discordjs/builders";

import { MessageCommandBuilder, MessageCommandOption, MessageCommandOptionType } from "../";
import { MessageCommandStringOption } from "../MessageCommandOption";
import { StringParser } from "../StringParser";


const PREFIX = ">>";
const parser = new StringParser();

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
		builder.addMentionableOption(option =>
			option.setName("mentionable").setDescription("mentionable option description")
		);

		const mockMessage = ">>test-name string 12 true <@!2323829327>";
		const optionTypeValues = mockMessage
			.trim()
			.split(" ")
			.slice(1)
			.map(option => parser.parse(option));

		expect(builder.options.length).toBe(4);
		expect(builder.options[0].type).toBe(MessageCommandOptionType.STRING);
		expect(builder.options[1].type).toBe(MessageCommandOptionType.NUMBER);
		expect(builder.options[2].type).toBe(MessageCommandOptionType.BOOLEAN);
		expect(builder.options[3].type).toBe(MessageCommandOptionType.MENTIONABLE);

		expect(optionTypeValues[0]).toBe("string");
		expect(optionTypeValues[1]).toBe(12);
		expect(optionTypeValues[2]).toBe(true);
		expect(optionTypeValues[3]).toBe("<@!2323829327>");
	});

	it("test single string option with regex", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test-name");
		builder.setDescription("test description");
		builder.addStringOption(option =>
			option.setName("test-option-name").setDescription("test option description")
		);

		const mockMessage = ">>test-name option1";
		const regex = builder.toRegex(PREFIX);

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.STRING);
		expect(regex).toEqual(/^>>(test-name)\s(\w+)$/gm);
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

		const mockMessages = [">>test-name option1", ">>TEST option1", ">>t option1"];
		const expectedRegex = /^>>(test-name|t|TEST)\s(\w+)$/gm;
		const regex = builder.toRegex(PREFIX);

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.aliases.length).toBe(2);
		expect(builder.aliases[0]).toBe("t");
		expect(builder.aliases[1]).toBe("TEST");
		expect(builder.options.length).toBe(1);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.STRING);
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
		builder.addMentionableOption(option =>
			option
				.setName("test-mentionable-option-name")
				.setDescription("test mentionable option description")
		);
		builder.addChannelOption(option =>
			option.setName("test-channel-option-name").setDescription("test channel option description")
		);

		const expectedRegex = /^>>(test-name|t|TEST)\s(\w+)\s(\d+)\s(true)\s<@!?(\d+)>\s<#(\d+)>$/gm;

		expect(builder.name).toBe("test-name");
		expect(builder.description).toBe("test description");
		expect(builder.aliases.length).toBe(2);
		expect(builder.aliases[0]).toBe("t");
		expect(builder.aliases[1]).toBe("TEST");
		expect(builder.options.length).toBe(5);
		expect(builder.options[0].name).toBe("test-option-name");
		expect(builder.options[0].description).toBe("test option description");
		expect(builder.options[0].type).toBe(MessageCommandOptionType.STRING);
		expect(builder.options[1].name).toBe("test-number-option-name");
		expect(builder.options[1].description).toBe("test number option description");
		expect(builder.options[1].type).toBe(MessageCommandOptionType.NUMBER);
		expect(builder.options[2].name).toBe("test-boolean-option-name");
		expect(builder.options[2].description).toBe("test boolean option description");
		expect(builder.options[2].type).toBe(MessageCommandOptionType.BOOLEAN);
		expect(builder.options[3].name).toBe("test-mentionable-option-name");
		expect(builder.options[3].description).toBe("test mentionable option description");
		expect(builder.options[3].type).toBe(MessageCommandOptionType.MENTIONABLE);
		expect(builder.options[4].name).toBe("test-channel-option-name");
		expect(builder.options[4].description).toBe("test channel option description");
		expect(builder.options[4].type).toBe(MessageCommandOptionType.CHANNEL);
		expect(builder.toRegex(PREFIX)).toEqual(expectedRegex);
	});

	it("expect 0 errors from validate() method", () => {
		const builder = new MessageCommandBuilder();
		builder.setName("test");
		builder.setDescription("test description");
		builder.setPermissions(["ADD_REACTIONS"]);
		builder.setRoles(["1234567890"]);
		builder.addStringOption(option =>
			option.setName("test-option-name").setDescription("test option description")
		);

		const message = {
			content: ">>test this",
			guild: {
				roles: {
					cache: new Collection<string, Role>().set("not-supposed-to-have", null).set("supposed-to-have", null),
				},
			},
			member: {
				permissions: new Permissions("ADD_REACTIONS"),
				roles: {
					cache: new Collection<string, Role>().set("supposed-to-have", null),
				},
			},
		} as Message;

		expect(builder.validate(message, PREFIX)).toHaveLength(0);
	});
});


