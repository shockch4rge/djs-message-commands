import { parseMessage } from "../util";

describe("parseMessage", () => {
    it("return command name, raw string arguments, and whether or not the message command was prefixed correctly", () => {
        const { rawArgs, commandName, isPrefixed } = parseMessage({ content: '!play \"bruh\" 123 false', prefix: "!" });
        expect(rawArgs).toEqual(["!play", "\"bruh\"", "123", "false"]);
        expect(commandName).toEqual("play");
        expect(isPrefixed).toEqual(true);
    });

    it("commandName should be empty with a null prefix, args should return everything", () => {
        const { rawArgs, commandName, isPrefixed } = parseMessage({ content: '!play \"bruh\" 123 false', prefix: null });
        expect(rawArgs).toEqual(["!play", "\"bruh\"", "123", "false"]);
        expect(commandName).toEqual("");
        expect(isPrefixed).toEqual(false);
    })
})