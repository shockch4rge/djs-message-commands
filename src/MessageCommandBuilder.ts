import { PermissionResolvable } from 'discord.js';

import { MessageCommandOption, OptionType } from './';

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
	public regex: RegExp;

	public constructor(data?: MessageCommandBuilderData) {
		this.name = data?.name ?? "No name implemented";
		this.description = data?.description ?? "No description implemented";
		this.aliases = data?.aliases ?? [];
		this.options = data?.options ?? [];
		this.roleIds = data?.roleIds ?? [];
		this.permissions = data?.permissions ?? [];
		this.regex = data?.regex ?? new RegExp(".");
	}

	public setName(name: string) {
		this.name = name;
		return this;
	}

	public setDescription(description: string) {
		this.description = description;
		return this;
	}

	public setAliases(aliases: string[]) {
		this.aliases = aliases;
		return this;
	}

	public setRoles(roleIds: string[]) {
		this.roleIds = roleIds;
		return this;
	}

	public setPermissions(permissions: PermissionResolvable[]) {
		this.permissions = permissions;
		return this;
	}

	public addStringOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.STRING));
		this.options.push(option);
		return this;
	}

	public addNumberOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.NUMBER));
		this.options.push(option);
		return this;
	}

	public addBooleanOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.BOOLEAN));
		this.options.push(option);
		return this;
	}

	public addMentionableOption(composer: (option: MessageCommandOption) => MessageCommandOption) {
		const option = composer(new MessageCommandOption(OptionType.MENTIONABLE));
		this.options.push(option);
		return this;
	}

	public toRegex(messagePrefix: string) {
		const optionTypes = this.options
			.map(option => {
				switch (option.type) {
					case OptionType.STRING:
						return `(\\w+)`;
					case OptionType.NUMBER:
						return `(\\d+)`;
					case OptionType.BOOLEAN:
						return `(true|false)`;
					case OptionType.MENTIONABLE:
						return `<@!?(\\d+)>`;
				}
			})
			.join("\\s");

		this.regex = new RegExp(
			`^${messagePrefix}${this.name}${
				this.aliases.length > 0 ? `|${this.aliases.join("|")}` : ""
			}\\s${optionTypes}$`,
			"gm"
		);

		return this.regex;
	}
}
