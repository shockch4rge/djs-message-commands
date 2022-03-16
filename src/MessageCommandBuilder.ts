import { PermissionResolvable } from 'discord.js';

import { MessageCommandOption, MessageCommandOptionType } from './';

export interface MessageCommandBuilderData {
	name: string;
	description: string;
	aliases?: string[];
	options?: MessageCommandOption[];
	roleIds?: string[];
	permissions?: PermissionResolvable[];
	regex?: RegExp;
}

export class MessageCommandBuilder {
	public name: string;
	public description: string;
	public aliases: string[];
	public options: MessageCommandOption[];
	public roleIds: string[];
	public permissions: PermissionResolvable[];

	public constructor(data?: MessageCommandBuilderData) {
		this.name = data?.name ?? "No name implemented";
		this.description = data?.description ?? "No description implemented";
		this.aliases = data?.aliases ?? [];
		this.options = data?.options ?? [];
		this.roleIds = data?.roleIds ?? [];
		this.permissions = data?.permissions ?? [];
	}

	public setName(name: string) {
		if (name === "") {
			throw new Error("Command name must be at least one character long.");
		}

		this.name = name;
		return this;
	}

	public setDescription(description: string) {
		if (description === "") {
			throw new Error("Command description must be at least one character long.");
		}

		this.description = description;
		return this;
	}

	public setAliases(aliases: string[]) {
		if (aliases.length <= 0) {
			throw new Error("There must be at least one alias provided in the array.");
		}

		if (aliases.some(a => a === "")) {
			throw new Error("Aliases must be at least one character long.");
		}

		this.aliases = aliases;
		return this;
	}

	public setRoles(ids: string[]) {
		if (ids.length <= 0) {
			throw new Error("There must be at least one role ID provided in the array.");
		}

		this.roleIds = ids;
		return this;
	}

	public setPermissions(permissions: PermissionResolvable[]) {
		if (permissions.length <= 0) {
			throw new Error("There must be at least one permission provided in the array.");
		}

		this.permissions = permissions;
		return this;
	}
	
	public addStringOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(MessageCommandOptionType.STRING));
		this.options.push(option);
		return this;
	}
	
	public addNumberOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(MessageCommandOptionType.NUMBER));
		this.options.push(option);
		return this;
	}
	
	public addBooleanOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(MessageCommandOptionType.BOOLEAN));
		this.options.push(option);
		return this;
	}

	public addMentionableOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(MessageCommandOptionType.MENTIONABLE));
		this.options.push(option);
		return this;
	}

	public toRegex(messagePrefix: string) {
		const stringifiedOptionTypes = this.options
			.map(option => {
				switch (option.type) {
					case MessageCommandOptionType.STRING:
						return `(\\w+)`;
					case MessageCommandOptionType.NUMBER:
						return `(\\d+)`;
					case MessageCommandOptionType.BOOLEAN:
						return `(true|false)`;
					case MessageCommandOptionType.MENTIONABLE:
						return `<@!?(\\d+)>`;
				}
			})
			.join("\\s");

		return new RegExp(
			`^${messagePrefix}(${this.name}${this.aliases.length > 0 ? `|${this.aliases.join("|")}` : ""})${
				this.options.length > 0 ? `\\s${stringifiedOptionTypes}` : ""
			}$`,
			"gm"
		);
	}
}
