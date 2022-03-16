import { PermissionResolvable } from 'discord.js';

import { MessageCommandOption, MessageCommandOptionType } from './';
import {
    MessageCommandBooleanOption, MessageCommandChannelOption, MessageCommandMentionableOption,
    MessageCommandNumberOption, MessageCommandStringOption
} from './MessageCommandOption';
import { RegexBuilder } from './RegexHelper';

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

	public addStringOption(composer: (option: MessageCommandStringOption) => MessageCommandStringOption) {
		const option = composer(new MessageCommandStringOption());
		this.options.push(option);
		return this;
	}

	public addNumberOption(composer: (option: MessageCommandNumberOption) => MessageCommandNumberOption) {
		const option = composer(new MessageCommandNumberOption());
		this.options.push(option);
		return this;
	}

	public addBooleanOption(composer: (option: MessageCommandBooleanOption) => MessageCommandBooleanOption) {
		const option = composer(new MessageCommandBooleanOption());
		this.options.push(option);
		return this;
	}

	public addMentionableOption(
		composer: (option: MessageCommandMentionableOption) => MessageCommandMentionableOption
	) {
		const option = composer(new MessageCommandMentionableOption());
		this.options.push(option);
		return this;
	}

	public addChannelOption(composer: (option: MessageCommandChannelOption) => MessageCommandChannelOption) {
		const option = composer(new MessageCommandChannelOption());
		this.options.push(option);
		return this;
	}

	public toRegex(prefix: string) {
		const regexHelper = new RegexBuilder(this);
		return regexHelper.build(prefix);
	}
}
