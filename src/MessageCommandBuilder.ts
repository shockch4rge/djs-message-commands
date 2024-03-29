import { Message, PermissionResolvable, roleMention } from "discord.js";

import {
    MessageCommandBooleanOption, MessageCommandChannelOption, MessageCommandMemberOption,
    MessageCommandNumberOption, MessageCommandOption, MessageCommandRoleOption,
    MessageCommandStringOption, parseMessage
} from "./";
import { MessageCommandMentionableOption, MessageCommandOptionError } from "./MessageCommandOption";

export interface MessageCommandBuilderData {
	name: string;
	description: string;
	aliases?: string[];
	options?: MessageCommandOption[];
	roleIds?: string[];
	permissions?: PermissionResolvable[];
}

export class MessageCommandBuilder {
	/**
	 * The name of the command.
	 */
	public readonly name: string;
	/**
	 * The description of the command.
	 */
	public readonly description: string;
	/**
	 * Any aliases the command may be executed with.
	 */
	public readonly aliases: string[];
	/**
	 * The options/arguments that can be supplied to this command.
	 */
	public readonly options: MessageCommandOption[];
	/**
	 * The role IDs permitted to execute this command.
	 */
	public readonly roleIds: string[];
	/**
	 * The permissions permitted to execute this command.
	 */
	public readonly permissions: PermissionResolvable[];

	public constructor(data?: MessageCommandBuilderData) {
		this.name = data?.name ?? "";
		this.description = data?.description ?? "";
		this.aliases = data?.aliases ?? [];
		this.options = data?.options ?? [];
		this.roleIds = data?.roleIds ?? [];
		this.permissions = data?.permissions ?? [];
	}

	/**
	 * Sets the name of the command. Cannot be empty.
	 * @param name The name of the command.
	 * @returns The builder instance.
	 */
	public setName(name: string) {
		if (!name) {
			throw new Error("Command name must be at least one character long.");
		}

		Reflect.set(this, "name", name);
		return this;
	}

	/**
	 * Sets the description of the command. Cannot be empty.
	 * @param description The description of the command.
	 * @returns The builder instance.
	 */
	public setDescription(description: string) {
		if (!description) {
			throw new Error("Command description must be at least one character long.");
		}

		Reflect.set(this, "description", description);
		return this;
	}

	/**
	 * Sets any aliases you wish to supply for the command.
	 * @param aliases The aliases of the command.
	 * @returns The builder instance.
	 */
	public setAliases(aliases: string[]) {
		if (!aliases.length) {
			throw new Error("There must be at least one alias provided in the array.");
		}

		if (aliases.some(a => !a)) {
			throw new Error("Aliases must be at least one character long.");
		}

		Reflect.set(this, "aliases", aliases);
		return this;
	}

	/**
	 * Sets the roles allowed to execute this command. If a role doesn't exist in the guild, it will be ignored.
	 * @param ids The role IDs permitted to execute this command.
	 * @returns The builder instance.
	 */
	public setRoles(ids: string[]) {
		if (!ids.length) {
			throw new Error("There must be at least one role ID provided in the array.");
		}

		Reflect.set(this, "roleIds", ids);
		return this;
	}

	/**
	 * Sets the permissions allowed to execute this command.
	 * @param permissions The permissions required to execute this command.
	 * @returns The builder instance.
	 */
	public setPermissions(permissions: PermissionResolvable[]) {
		if (!permissions.length) {
			throw new Error("There must be at least one permission provided in the array.");
		}

		Reflect.set(this, "permissions", permissions);
		return this;
	}

	/**
	 * Adds a choice-able string option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addStringOption(composer: (option: MessageCommandStringOption) => MessageCommandStringOption) {
		const option = composer(new MessageCommandStringOption());
		this.options.push(option);
		return this;
	}

	/**
	 * Adds a choice-able number option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addNumberOption(composer: (option: MessageCommandNumberOption) => MessageCommandNumberOption) {
		const option = composer(new MessageCommandNumberOption());
		this.options.push(option);
		return this;
	}

	/**
	 * Adds a boolean option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addBooleanOption(composer: (option: MessageCommandBooleanOption) => MessageCommandBooleanOption) {
		const option = composer(new MessageCommandBooleanOption());
		this.options.push(option);
		return this;
	}

	/**
	 * Adds a member mentionable option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addMemberOption(composer: (option: MessageCommandMemberOption) => MessageCommandMemberOption) {
		const option = composer(new MessageCommandMemberOption());
		this.options.push(option);
		return this;
	}

	/**
	 * Adds a channel mentionable option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addChannelOption(composer: (option: MessageCommandChannelOption) => MessageCommandChannelOption) {
		const option = composer(new MessageCommandChannelOption());
		this.options.push(option);
		return this;
	}

	/**
	 * Adds a role mentionable option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addRoleOption(composer: (option: MessageCommandRoleOption) => MessageCommandRoleOption) {
		const option = composer(new MessageCommandRoleOption());
		this.options.push(option);
		return this;
	}

	/**
	 * Adds a mentionable option to the command.
	 * @param composer A function that returns an instance of the option.
	 * @returns The builder instance.
	 */
	public addMentionableOption(composer: (option: MessageCommandMentionableOption) => MessageCommandMentionableOption) {
		const option = composer(new MessageCommandMentionableOption());
		this.options.push(option);
		return this;
	}

	/**
	 * A utility method to convert the command into a regular expression. Useful for debugging.
	 * @param prefix The guild's message prefix.
	 * @returns The command's builder converted to RegExp.
	 */
	public toRegex(prefix: string) {
		const aliases = this.aliases.length ? `|${this.aliases.join("|")}` : "";

		let regex = `${prefix}(${this.name}${aliases})`;

		for (const option of this.options) {
			regex += `\\s+`;
			regex += option.buildRegexString();
		}

		return new RegExp(`^${regex}$`, "gm");
	}

	/**
	 * Validates the message with the command. This checks for permissions, roles, and arguments supplied to the command.
	 * @param message The message to validate.
	 * @returns The parsed options and potential errors.
	 */
	public validate(message: Message) {
		let errors: MessageCommandOptionError[] | null = null;
		const parsedOptions: unknown[] = [];
		const args = parseMessage({ content: message.content, prefix: null }).rawArgs.slice(1);

		for (const perm of this.permissions) {
			if (!message.member!.permissions.has(perm)) {
				errors ??= [];

				errors.push({
					message: `Missing permission: ${perm}`,
					type: "MissingPermissions",
				});
			}
		}

		for (const id of this.roleIds) {
			if (!message.guild!.roles.cache.has(id)) {
				continue;
			}

			if (!message.member!.roles.cache.has(id)) {
				errors ??= [];

				errors.push({
					message: `Missing role: ${roleMention(id)}`,
					type: "MissingRoles",
				});
			}
		}

		if (args.length !== this.options.length) {
			errors ??= [];

			errors.push({
				message: `Expected ${this.options.length} arguments, but got ${args.length}.`,
				type: "InvalidArgCount",
			});

			return [errors, parsedOptions] as const;
		}

		for (const [i, option] of this.options.entries()) {
			const result = option.validate(args[i]);

			if (result === undefined) {
				errors ??= [];

				errors.push({
					message: `Invalid option type: ${option.name} in ${this.name}`,
					type: "InvalidArgType",
				});

				continue;
			}

			parsedOptions.push(result);
		}

		return [errors, parsedOptions] as const;
	}
}
