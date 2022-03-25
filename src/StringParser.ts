import { MessageMentions, Snowflake } from "discord.js";


export class StringParser {
	public parse(string: string): string | Snowflake | number | boolean {
		const parsers = [
			this.toBoolean,
			this.toNumber,
			this.toFloat,
			this.toMemberId,
			this.toRoleId,
			this.toChannelId,
		];

		const results = parsers.map(parse => parse(string)).filter(value => value !== undefined);

		if (results.length <= 0) {
			return string;
		}

		return results[0]!;
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

	public toRoleId(string: string): Snowflake | undefined {
		const matches = string.matchAll(MessageMentions.ROLES_PATTERN).next().value;

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
