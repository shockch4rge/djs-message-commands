/**
 * A composable option/argument to add to a message command.
 */
export class MessageCommandOption {
	public name: string;
	public description: string;
	public choices: unknown[];
	public type: MessageCommandOptionType;

	public constructor(type: MessageCommandOptionType) {
		this.name = "No name implemented";
		this.description = "No description implemented";
		this.choices = [];
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

	public setType(type: MessageCommandOptionType) {
		this.type = type;
		return this;
	}

	/**
	 * Add a choice, which restricts an option to a specific value.
	 *
	 * Similar to discord.js' `SlashCommandOption.addChoice` method.
	 *
	 * Use either this or {@link MessageCommandOption.setChoices}.
	 * @param choice An available choice for the option
	 * @returns The option instance.
	 */
	public addChoice(choice: [name: string, value: string]) {
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
	 * Set some choices, which restricts an option to specific values.
	 *
	 * Similar to discord.js' `SlashCommandOption.setChoices` method.
	 *
	 * Use either this or {@link MessageCommandOption.addChoice}.
	 * @param choices The available choices for the option.
	 * @returns The option instance.
	 */
	public setChoices(choices: [name: string, value: string][]) {
        choices.forEach(choice => {
            if (choice.every(c => c === "")) {
                throw new Error("You must provide a name and value for every option choice.");
            }
        })

		this.choices = choices;
		return this;
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
}

/**
 * An enum similar to {@link MessageCommandOptionType}, but for developer ease.
 */
export const enum OptionType_DEV {
	BOOLEAN = "boolean",
	NUMBER = "number",
	STRING = "string",
	MENTIONABLE = "mentionable",
}
