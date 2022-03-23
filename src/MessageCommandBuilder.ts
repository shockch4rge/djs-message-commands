import { Message, PermissionResolvable } from "discord.js";

import { roleMention } from "@discordjs/builders";

import {
    MessageCommandBooleanOption, MessageCommandChannelOption,
    MessageCommandMentionableOption as MessageCommandMemberOption, MessageCommandNumberOption,
    MessageCommandOption, MessageCommandOptionChoiceable, MessageCommandOptionType,
    MessageCommandStringOption
} from "./";


export interface MessageCommandBuilderData {
	name: string;
	description: string;
	aliases?: string[];
	options?: MessageCommandOption[];
	roleIds?: string[];
	permissions?: PermissionResolvable[];
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

	public addMemberOption(
		composer: (option: MessageCommandMemberOption) => MessageCommandMemberOption
	) {
		const option = composer(new MessageCommandMemberOption());
		this.options.push(option);
		return this;
	}

	public addChannelOption(composer: (option: MessageCommandChannelOption) => MessageCommandChannelOption) {
		const option = composer(new MessageCommandChannelOption());
		this.options.push(option);
		return this;
	}

	public toRegex(prefix: string): RegExp {
		const aliases = this.aliases.length > 0 ? `|${this.aliases.join("|")}` : "";

		let regex = `${prefix}(${this.name}${aliases})`;

		for (const option of this.options) {
			regex += `\\s+`;

			if (option instanceof MessageCommandOptionChoiceable) {
				if (option.choices.length <= 0) {
					switch (option.type) {
						case MessageCommandOptionType.STRING:
							regex += `"(.+)"`;
							break;
						case MessageCommandOptionType.NUMBER:
							regex += `(\\d+)`;
							break;
					}
				} else {
					regex += `(${option.choices.map(c => c[1]).join("|")})`;
				}

				continue;
			}

			switch (option.type) {
				case MessageCommandOptionType.BOOLEAN:
					regex += `(true)`;
					break;
				case MessageCommandOptionType.MENTIONABLE:
					regex += `<@!?(\\d+)>`;
					break;
				case MessageCommandOptionType.CHANNEL:
					regex += `<#(\\d+)>`;
					break;
				case MessageCommandOptionType.ROLE:
					regex += `<@&(\\d+)>`;
			}
		}

		return new RegExp(`^${regex}$`, "gm");
	}

	public validate(message: Message) {
		const permissionErrors: string[] = [];
		const roleErrors: string[] = [];
		const optionErrors: string[] = [];
		const options: unknown[] = [];
		const messageArgs = message.content.trim().split(/\s+/).slice(1);

		for (const perm of this.permissions) {
			if (!message.member!.permissions.has(perm)) {
				permissionErrors.push(`Missing permission: ${perm}`);
			}
		}

		for (const id of this.roleIds) {
			if (!message.guild!.roles.cache.has(id)) {
				continue;
			}

			if (!message.member!.roles.cache.has(id)) {
				roleErrors.push(`Missing role: ${roleMention(id)}`);
			}
		}

		for (let i = 0; i < this.options.length; i++) {
			const option = this.options[i];
			const result = option.validate(messageArgs[i]);

			if (!result !== undefined) {
				optionErrors.push(`Invalid option: ${option.name}`);
				continue;
			}

			options.push(result);
		}

		return {
			options,
			errors: {
				permission: permissionErrors,
				role: roleErrors,
				option: optionErrors,
			},
		};
	}
}
