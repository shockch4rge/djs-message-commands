import { MessageMentions, Snowflake } from "discord.js";


export interface MessageCommandOptionData {
	name: string;
	description: string;
	readonly type: MessageCommandOptionType;
}

/**
 * A composable option/argument to add to a message command.
 */
export abstract class MessageCommandOption {
	public name: string;
	public description: string;
	public readonly type: MessageCommandOptionType;

	public constructor(data: MessageCommandOptionType | MessageCommandOptionData) {
		this.name = typeof data === "object" ? data.name : "No name implemented";
		this.description = typeof data === "object" ? data.description : "No description implemented";
		this.type = typeof data === "object" ? data.type : data;
	}

	public setName(name: string) {
		if (name === "") {
			throw new Error("Option name must be at least one character long.");
		}

		this.name = name;
		return this;
	}

	public setDescription(description: string) {
		if (description === "") {
			throw new Error("Option description must be at least one character long.");
		}

		this.description = description;
		return this;
	}

	public abstract validate(option: string): unknown;
}

export abstract class MessageCommandOptionChoiceable<T extends string | number> extends MessageCommandOption {
	public choices: MessageCommandOptionChoice<T>[];

	public constructor(type: MessageCommandOptionType) {
		super(type);
		this.choices = [];
	}

	/**
	 * Add a choice for this option. Chain this multiple times to add more options OR use {@link MessageCommandOptionChoiceable.setChoices}.
	 * @param choice The choice to add.
	 * @returns The option instance.
	 */
	public addChoice(...choice: MessageCommandOptionChoice<T>) {
		if (choice.length <= 0) {
			throw new Error("There must be at least one choice provided in the array.");
		}

		if (choice.every(c => c === "")) {
			throw new Error("You must provide a name and value for the option choice.");
		}

		if (choice[0] === "") {
			throw new Error("You must provide a name for the option choice.");
		}

		if (choice[1] === "") {
			throw new Error("You must provide a value for the option choice.");
		}

		this.choices.push(choice);
		return this;
	}

	/**
	 * Add multiple choices for this option. Use this either once OR chain {@link MessageCommandOptionChoiceable.addChoice}.
	 * @param choices The choices to add.
	 * @returns	The option instance.
	 */
	public setChoices(choices: MessageCommandOptionChoice<T>[]) {
		if (choices.length <= 0) {
			throw new Error("You must provide at least one choice.");
		}

		for (const choice of choices) {
			if (choice.some(c => c === "")) {
				throw new Error("You must provide a name and value for every option choice.");
			}
		}

		this.choices = choices;
		return this;
	}
}

export class MessageCommandStringOption extends MessageCommandOptionChoiceable<string> {
	public constructor() {
		super(MessageCommandOptionType.STRING);
	}

	public override validate(option: string): string | undefined {
		for (const choice of this.choices) {
			if (choice[1] === option) {
				return choice[1];
			}
		}

		const matches = option.matchAll(/^"(.+)"$/gi).next().value;
		return matches ? matches[1] : undefined;
	}
}

export class MessageCommandNumberOption extends MessageCommandOptionChoiceable<number> {
	public constructor() {
		super(MessageCommandOptionType.NUMBER);
	}

	public override validate(option: string) {
		const number = Number.parseInt(option);
		return Number.isNaN(number) ? undefined : number;
	}
}

export class MessageCommandBooleanOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.BOOLEAN);
	}

	public override validate(option: string): boolean | undefined {
		const matches = option.match(/^(true|false)$/gi);

		if (matches) {
			if (matches[0] === "true") {
				return true;
			}
			if (matches[0] === "false") {
				return false;
			}
		}

		return undefined;
	}
}

export class MessageCommandMemberOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.MENTIONABLE);
	}

	public override validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(MessageMentions.USERS_PATTERN).next().value;
		return matches ? matches[1] : undefined;
	}
}

export class MessageCommandChannelOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.CHANNEL);
	}

	public override validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(MessageMentions.CHANNELS_PATTERN).next().value;
		return matches ? matches[1] : undefined;
	}
}

export class MessageCommandRoleOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.ROLE);
	}

	public override validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(MessageMentions.ROLES_PATTERN).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * An enum containing user-friendly values for each type.
 */
export const enum MessageCommandOptionType {
	BOOLEAN = "true/false",
	NUMBER = "number",
	STRING = "text",
	MENTIONABLE = "mention",
	CHANNEL = "channel",
	ROLE = "role",
}

export type MessageCommandOptionChoice<ValueType extends string | number> = [name: string, value: ValueType];
