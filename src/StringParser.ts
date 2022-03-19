import { MessageMentions, Snowflake } from 'discord.js';

export class StringParser {
	public parse(string: string): string | number | boolean {
		const isBoolean = this.toBoolean(string);
		const isNumber = this.toNumber(string);
		const isFloat = this.toFloat(string);
		const isMemberId = this.toMemberId(string);
		const isChannelId = this.toChannelId(string);

		if (isBoolean !== undefined) {
			return isBoolean;
		}

		if (isNumber) {
			return isNumber;
		}

		if (isFloat) {
			return isFloat;
		}

		if (isMemberId) {
			return isMemberId;
		}

		if (isChannelId) {
			return isChannelId;
		}

		return string;
	}

	public toBoolean(string: string) {
		const matches = string.match(/^(true|false)$/gi);

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

	public toNumber(string: string) {
		const number = Number.parseInt(string);

		if (Number.isNaN(number)) {
			return undefined;
		}

		return number;
	}

	public toFloat(string: string) {
		const number = Number.parseFloat(string);

		if (Number.isNaN(number)) {
			return undefined;
		}

		return number;
	}

	public toMemberId(string: string): Snowflake | undefined {
		const matches = string.matchAll(MessageMentions.USERS_PATTERN).next().value;

		if (!matches) {
			return undefined;
		}

		return matches[1] as Snowflake;
	}

	public toChannelId(string: string): Snowflake | undefined {
		const matches = string.matchAll(MessageMentions.CHANNELS_PATTERN).next().value;

		if (!matches) {
			return undefined;
		}

		return matches[1] as Snowflake;
	}
}
