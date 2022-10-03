import { MessageMentions, Snowflake } from "discord.js";
import toRegexRange from "to-regex-range";

export interface MessageCommandOptionData {
	name: string;
	description: string;
	readonly type: MessageCommandOptionType;
	readonly defaultRegex: RegExp;
}

/**
 * A composable option/argument to add to a message command.
 * @abstract
 */
export abstract class MessageCommandOption {
	/**
	 * The name of the option.
	 */
	public readonly name: string;
	/**
	 * The description of the option.
	 */
	public readonly description: string;
	/**
	 * The type of the option.
	 */
	public readonly type: MessageCommandOptionType;

	/**
	 * The default regex literal of the option.
	 */
	public readonly defaultRegex: RegExp;

	public constructor(data: Pick<MessageCommandOptionData, "type" | "defaultRegex">) {
		this.name = "No name implemented";
		this.description = "No description implemented";
		this.type = data.type;
		this.defaultRegex = data.defaultRegex;
	}

	/**
	 * Builds the option in regex form.
	 */
	public abstract buildRegexString(): string;

	/**
	 * Sets the name of the option. Cannot be empty.
	 * @param name The name of the option.
	 * @returns The option instance.
	 */
	public setName(name: string) {
		if (!name) {
			throw new Error("Option name must be at least one character long.");
		}

		Reflect.set(this, "name", name);
		return this;
	}

	/**
	 * Sets the name of the option. Cannot be empty.
	 * @param description The description of the option.
	 * @returns The option instance.
	 */
	public setDescription(description: string) {
		if (!description) {
			throw new Error("Option description must be at least one character long.");
		}

		Reflect.set(this, "description", description);
		return this;
	}

	/**
	 * Performs a type-specific validation on the provided message argument.
	 * @param arg The argument to compare to.
	 */
	public abstract validate(arg: string): unknown;
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
	public readonly choices: MessageCommandOptionChoice<T>[];

	public constructor(type: Pick<MessageCommandOptionData, "type" | "defaultRegex">) {
		super(type);
		this.choices = [];
	}

	public buildRegexString() {
		if (this.choices.length) {
			return new RegExp(`"(${this.choices.map(c => c[1]).join("|")})"`).source;
		}

		return this.defaultRegex.source;
	}

	/**
	 * Add one or many choice(s) for this option. Chain this multiple times to add more options OR use {@link MessageCommandOptionChoiceable.setChoices}.
	 * @param choices The choices to add.
	 * @returns The option instance.
	 */
	public addChoices(...choices: MessageCommandOptionChoice<T>[]) {
		for (const choice of choices) {
			if (choice.some(c => c === "")) {
				throw new Error("You must provide a name and value for all option choices.");
			}

			this.choices.push(choice);
		}

		return this;
	}

	/**
	 * Add multiple choices for this option. Use this either once OR chain {@link MessageCommandOptionChoiceable.addChoices}.
	 * @param choices The choices to add.
	 * @returns	The option instance.
	 */
	public setChoices(...choices: MessageCommandOptionChoice<T>[]) {
		for (const choice of choices) {
			if (choice.some(c => c === "")) {
				throw new Error("You must provide a name and value for all option choices.");
			}
		}

		Reflect.set(this, "choices", choices);
		return this;
	}
}

/**
 * A string option. Allows choices.
 * @extends MessageCommandOptionChoiceable
 */
export class MessageCommandStringOption extends MessageCommandOptionChoiceable<string> {
	/**
	 * The minimum length this string argument can be.
	 */
	public readonly minLength?: number;
	/**
	 * The maximum length this string argument can be.
	 */
	public readonly maxLength?: number;

	public constructor() {
		super({
			type: MessageCommandOptionType.String,
			defaultRegex: /"(.+)"/,
		});
	}

	public override buildRegexString() {
		const min = this.minLength;
		const max = this.maxLength;

		const lengthRegex = min && max
			? `{${min},${max}}`
			: min
				? `{${min},}`
				: max
					? `{0,${max}}`
					: "";

		if (min || max) {
			return new RegExp(`"(.${lengthRegex})"`).source;
		}

		// use the original implementation as we can't have choices and min/max length at the same time anyway
		return super.buildRegexString();
	}

	/**
	 * Sets the minimum length of the string argument.
	 * @param minLength The minimum length this string argument can be.
	 * @returns The option instance
	 */
	public setMinLength(minLength: number) {
		if (this.choices.length) {
			throw new Error("You cannot set a minimum length if choices are provided.");
		}

		if (minLength < 0) {
			throw new Error("Minimum length cannot be less than 0.");
		}

		Reflect.set(this, "minLength", minLength);
		return this;
	}

	/**
	 * Sets the maximum length of the string argument.
	 * @param maxLength The maximum length this string argument can be.
	 * @returns The option instance
	 */
	public setMaxLength(maxLength: number) {
		if (this.choices.length) {
			throw new Error("You cannot set a maximum length if choices are provided.");
		}

		if (maxLength < 0) {
			throw new Error("Maximum length cannot be less than 0.");
		}

		Reflect.set(this, "maxLength", maxLength);
		return this;
	}

	public validate(arg: string): string | undefined {
		for (const [i, choice] of this.choices.entries()) {
			if (choice[1] === arg) {
				return choice[1];
			}

			// we've reached the end of the choices; no need for further validation
			if (i === this.choices.length - 1) {
				return undefined;
			}
		}

		if (this.minLength || this.maxLength) {
			return new RegExp(`^${this.buildRegexString()}&`).test(arg) ? arg : undefined;
		}


		const matches = arg.matchAll(/^"(.+)"$/gi).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * A number option. Allows choices.
 * @extends MessageCommandOptionChoiceable
 */
export class MessageCommandNumberOption extends MessageCommandOptionChoiceable<number> {
	public readonly minValue?: number;
	public readonly maxValue?: number;

	public constructor() {
		super({
			type: MessageCommandOptionType.Number,
			defaultRegex: /(\d+)/
		});
	}

	public override buildRegexString() {
		const min = this.minValue;
		const max = this.maxValue;

		// does this hurt performance? idk
		if (min || max) {
			return toRegexRange(min ?? -100_000_000, max);
		}

		// use the original implementation; same case as string options
		return super.buildRegexString();
	}

	/**
	 * Sets the minimum value of the number argument.
	 * @param minValue The minimum value this number argument can be.
	 * @returns The option instance
	 * @throws If the minimum value is less than 0.
	 * @throws If choices are provided.
	*/
	public setMinValue(minValue: number) {
		if (this.choices.length) {
			throw new Error("You cannot set a minimum value if choices are provided.");
		}

		if (minValue < 0) {
			throw new Error("Minimum value cannot be less than 0.");
		}

		if (this.maxValue && minValue > this.maxValue) {
			throw new Error("Minimum value cannot be greater than maximum value.");
		}

		Reflect.set(this, "minValue", minValue);
		return this;
	}

	/**
	 * Sets the minimum value of the number argument.
	 * @param maxValue The minimum value this number argument can be.
	 * @returns The option instance
	 * @throws If the minimum value is less than 0.
	 * @throws If choices are provided.
	*/
	public setMaxValue(maxValue: number) {
		if (this.choices.length) {
			throw new Error("You cannot set a minimum value if choices are provided.");
		}

		if (maxValue < 0) {
			throw new Error("Maximum value cannot be less than 0.");
		}

		if (this.minValue && maxValue <= this.minValue) {
			throw new Error("Maximum value cannot be less than or equal to the minimum value.");
		}

		Reflect.set(this, "maxValue", maxValue);
		return this;
	}

	public validate(arg: string) {
		for (const [i, choice] of this.choices.entries()) {
			if (choice[1] === this.parseFloatOrNumber(arg)) {
				return choice[1];
			}

			// we've reached the end of the choices; no need for further validation
			if (i === this.choices.length - 1) {
				return undefined;
			}
		}

		if (this.minValue || this.maxValue) {
			return new RegExp(`^${this.buildRegexString()}$`)
				.test(arg)
				? this.parseFloatOrNumber(arg)
				: undefined;
		}

		return this.parseFloatOrNumber(arg);
	}

	public parseFloatOrNumber(stringNum: string) {
		const number = Number.parseFloat(stringNum);
		return Number.isNaN(number) ? undefined : number;
	}
}

/**
 * A boolean option.
 * @extends MessageCommandOption
 */
export class MessageCommandBooleanOption extends MessageCommandOption {
	public constructor() {
		super({
			type: MessageCommandOptionType.Boolean,
			defaultRegex: /(true|false)/,
		});
	}

	public buildRegexString() {
		return this.defaultRegex.source;
	}

	public validate(arg: string) {
		const matches = arg.match(this.defaultRegex);

		if (matches?.[0] === "true") {
			return true;
		}

		if (matches?.[0] === "false") {
			return false;
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
		super({
			type: MessageCommandOptionType.Member,
			defaultRegex: /<@!?(\d{17,19})>/,
		});
	}

	public buildRegexString() {
		return this.defaultRegex.source;
	}

	public validate(arg: string): Snowflake | undefined {
		const matches = arg.matchAll(new RegExp(MessageMentions.UsersPattern, "g")).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * A channel mentionable option.
 * @extends MessageCommandOption
 */
export class MessageCommandChannelOption extends MessageCommandOption {
	public constructor() {
		super({
			type: MessageCommandOptionType.Channel,
			defaultRegex: /<#(\d{17,19})>/,
		});
	}

	public buildRegexString() {
		return this.defaultRegex.source;
	}

	public validate(option: string): Snowflake | undefined {
		const matches = option.matchAll(new RegExp(this.defaultRegex, "g")).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * A role mentionable option.
 * @extends MessageCommandOption
 */
export class MessageCommandRoleOption extends MessageCommandOption {
	public constructor() {
		super({
			type: MessageCommandOptionType.Role,
			defaultRegex: /<@&(\d{17,19})>/,
		});
	}

	public buildRegexString() {
		return this.defaultRegex.source;
	}

	public validate(arg: string): Snowflake | undefined {
		const matches = arg.matchAll(new RegExp(this.defaultRegex, "g")).next().value;
		return matches ? matches[1] : undefined;
	}
}

/**
 * A mentionable option.
 * @extends MessageCommandOption
 */
export class MessageCommandMentionableOption extends MessageCommandOption {
	public constructor() {
		super({
			type: MessageCommandOptionType.Mentionable,
			defaultRegex: /<@!?(\d{17,19})>|<#(\d{17,19})>|<@&(\d{17,19})>/,
		});
	}

	public buildRegexString() {
		return this.defaultRegex.source;
	}

	public validate(arg: string): Snowflake | undefined {
		const matches = arg.matchAll(this.defaultRegex).next().value;
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
	Mentionable = "mention",
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
