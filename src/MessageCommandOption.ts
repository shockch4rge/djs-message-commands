/**
 * A composable option/argument to add to a message command.
 */
export abstract class MessageCommandOption {
	public name: string;
	public description: string;
	public readonly type: MessageCommandOptionType;

	public constructor(type: MessageCommandOptionType) {
		this.name = "No name implemented";
		this.description = "No description implemented";
		this.type = type;
	}

	/**
	 * Set the name of the option
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
	 * Set the description of the option.
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
}

export abstract class MessageCommandOptionChoiceable<T extends string | number> extends MessageCommandOption {
	public choices: MessageCommandOptionChoice<T>[];

	public constructor(type: MessageCommandOptionType) {
		super(type);
		this.choices = [];
	}

	public addChoice(choice: MessageCommandOptionChoice<T>) {
		this.choices.push(choice);
		return this;
	}

	public setChoices(choices: MessageCommandOptionChoice<T>[]) {
		this.choices = choices;
		return this;
	}
}

export class MessageCommandStringOption extends MessageCommandOptionChoiceable<string> {
	public constructor() {
		super(MessageCommandOptionType.STRING);
	}
}

export class MessageCommandNumberOption extends MessageCommandOptionChoiceable<number> {
	public constructor() {
		super(MessageCommandOptionType.NUMBER);
	}
}

export class MessageCommandBooleanOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.BOOLEAN);
	}
}

export class MessageCommandMentionableOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.MENTIONABLE);
	}
}

export class MessageCommandChannelOption extends MessageCommandOption {
	public constructor() {
		super(MessageCommandOptionType.CHANNEL);
	}
}

/**
 * An enum containing user-friendly aliases for the option types.
 */
export const enum MessageCommandOptionType {
	BOOLEAN = "true/false",
	NUMBER = "number",
	STRING = "text",
	MENTIONABLE = "mention",
	CHANNEL = "channel",
}

export type MessageCommandOptionChoice<ValueType extends string | number> = [name: string, value: ValueType];
