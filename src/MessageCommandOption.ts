/**
 * A composable option/argument to add to a message command.
 */
export class MessageCommandOption {
	public name: string;
	public description: string;
	public choices?: unknown[];
	public type: OptionType;

	public constructor(type: OptionType) {
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
		this.name = name;
		return this;
	}

    /**
     * Set the description of the option. 
     * @param description The description of the option.
     * @returns The option instance.
     */
	public setDescription(description: string) {
		this.description = description;
		return this;
	}

    /**
     * Add a choice, which restricts an option to multiple defined values.
     * 
     * Similar to discord.js' `SlashCommandOption.addChoice` method.
     * 
     * Use either this or {@link MessageCommandOption.setChoices}.
     * @param choice An available choice for the option
     * @returns The option instance.
     */
	public addChoice<ValueType = string>(choice: [name: string, value: ValueType]) {
		if (!this.choices) {
			this.choices = [];
		}

		this.choices.push(choice);
		return this;
	}

    /**
     * Set the choices, which restricts an option to multiple defined values.
     * 
     * Similar to discord.js' `SlashCommandOption.setChoices` method.
     * 
     * Use either this or {@link MessageCommandOption.addChoice}.
     * @param choices The available choices for the option.
     * @returns The option instance.
     */
	public setChoices<ValueType>(choices: [name: string, value: ValueType][]) {
		this.choices = choices;
		return this;
	}
}

/**
 * An enum containing user-friendly aliases for the option types.
 */
export enum OptionType {
	BOOLEAN = "true/false",
	NUMBER = "number",
	STRING = "text",
	MENTIONABLE = "mention",
}

/**
 * An enum similar to {@link OptionType}, but for developer ease.
 */
export enum OptionType_DEV {
    BOOLEAN = "boolean",
    NUMBER = "number",
    STRING = "string",
    MENTIONABLE = "mentionable",
}