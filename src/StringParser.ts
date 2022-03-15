import { MemberMention, MessageMentions } from 'discord.js';

export class StringParser {
	public parse(string: string): string | number | boolean {
		const isBoolean = this.toBoolean(string);
		const isNumber = this.toNumber(string);
		const isFloat = this.toFloat(string);
		const isMemberId = this.toMemberId(string);

		if (isBoolean) {
			return isBoolean;
		}

		if (isNumber !== -1) {
			return isNumber;
		}

		if (isFloat !== -1) {
			return isFloat;
		}

		if (isMemberId) {
			return isMemberId;
		}

		return string;
	}

	public toBoolean(string: string): boolean {
		return /^\s*(true)\s*$/i.test(string);
	}

	public toNumber(string: string): number {
		const number = Number.parseInt(string);

		if (Number.isNaN(number)) {
			return -1;
		}

		return number;
	}

	public toFloat(string: string): number {
		const number = Number.parseFloat(string);

		if (Number.isNaN(number)) {
			return -1;
		}

		return number;
	}

	public toMemberId(string: string): MemberMention | undefined {
		const matches = string.match(MessageMentions.USERS_PATTERN);

		if (!matches) {
			return undefined;
		}

		return matches[1] as MemberMention;
	}
}
