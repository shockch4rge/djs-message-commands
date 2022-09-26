import { MessageMentions, Snowflake } from "discord.js";

export interface MessageCommandOptionData {
	name: string;
	description: string;
	readonly type: MessageCommandOptionType;
}

/**
 * A composable option/argument to add to a message command.
 * @abstract
 */
export abstract class MessageCommandOption {
	/**
	 * The name of the option.
	 */
	public name: string;
	/**
	 * The description of the option.
	 */
	public description: string;
	/**
	 * The type of the option.
	 */
	public readonly type: MessageCommandOptionType;

	public constructor(data: MessageCommandOptionType | MessageCommandOptionData) {
		this.name = typeof data === "object" ? data.name : "No name implemented";
		this.description = typeof data === "object" ? data.description : "No description implemented";
		this.type = typeof data === "object" ? data.type : data;
	}

	/**
	 * Sets the name of the option. Cannot be empty.
	 * @param name The name of the option.
	 * @returns The option instance.
	 */
	public setName(name: string) {
		if (name === "") {
			throw new Error("Option name must be at least one character long.");
		}

		this.name = name;
		return this;
	}

	/**
	 * Sets the name of the option. Cannot be empty.
	 * @param description The description of the option.
	 * @returns The option instance.
	 */
	public setDescription(description: string) {
		if (description === "") {
			throw new Error("Option description must be at least one character long.");
		}

		this.description = description;
		return this;
	}

	/**
	 * Performs a type-specific validation on the option.
	 * @param option The option to compare to.
	 */
	public abstract validate(option: string): unknown;
}

/**
 * A option that can be supplied with pre-defined values for the user to choose from.
 * @abstract
 * @extends MessageCommandOption
 */
export abstract class MessageCommandOptionChoiceable<T extends string | number> extends MessageCommandOption {
	/**
	 * The available pre-determined choices for this option.
	 */
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

/**
 * A string option. Allows choices.
 * @extends MessageCommandOptionChoiceable
 */
export class MessageCommandStringOption extends MessageCommandOptionChoiceable<string> {
	public constructor() {
		super(MessageCommandOptionType.String);
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

/**
 * A number option. Allows choices.
 * @extends MessageCommandOptionChoiceable
 */
export class MessageCommandNumberOption extends MessageCommandOptionChoiceable<number> {
	public constructor() {
		super(MessageCommandOptionType.Number);
	}

	public override validate(option: string) {
		const number = Number.parseInt(option);
		return Number.isNaN(number) ? undefined : number;
	}
}

/**
 * A boolean option.
 * @extends MessageCommandOption
 */
export class MessageCommandBooleanOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.Boolean);
	}

	public override validate(option: string): boolean | undefined {
		const matches = option.match(/^(true|false)$/g);

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

/**
 * A member mentionable option.
 * @extends MessageCommandOption
 */
export class MessageCommandMemberOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.Member);
	}

	public override validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(MessageMentions.UsersPattern).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * A channel mentionable option.
 * @extends MessageCommandOption
 */
export class MessageCommandChannelOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.Channel);
	}

	public override validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(MessageMentions.ChannelsPattern).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * A role mentionable option.
 * @extends MessageCommandOption
 */
export class MessageCommandRoleOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.Role);
	}

	public override validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(MessageMentions.RolesPattern).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * An enum containing user-friendly values for each option type.
 */
export enum MessageCommandOptionType {
	Boolean = "true/false",
	Number = "number",
	String = "text",
	Member = "member",
	Channel = "channel",
	Role = "role",
}

/**
 * A tuple containing both the name and value for each option choice.
 */
export type MessageCommandOptionChoice<ValueType extends string | number> = [name: string, value: ValueType];

export interface MessageCommandOptionError {
	message: string;
	type: keyof typeof MessageCommandOptionErrors;
}

export const MessageCommandOptionErrors = {
	InvalidArgType: "InvalidArgType",
	MissingArgs: "MissingArgs",
	MissingPermissions: "MissingPermissions",
	MissionRoles: "MissingRoles",
} as const;
