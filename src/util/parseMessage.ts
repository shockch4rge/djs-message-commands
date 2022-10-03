/**
 * A utility function that returns helpful properties from a message command.
 * @param content The content of the message
 * @param prefix The prefix to match against
 * @param greedy Whether or not to match against one or more whitespaces between arguments in the message command
 * @returns An object containing the command name, raw string arguments, and whether or not the message command was prefixed correctly
 */
export function parseMessage(options: { content: string, prefix: string | null, greedySpaces?: boolean }) {
    const { content, prefix, greedySpaces: greedy = true } = options;
    const greedySpace = greedy ? /\s+/ : /\s/;
    const rawArgs = content.trim().split(greedySpace);

    return {
        rawArgs,
        commandName: prefix ? rawArgs[0].slice(prefix.length) : "",
        isPrefixed: rawArgs[0].slice(0, prefix?.length) === prefix,
    }
}