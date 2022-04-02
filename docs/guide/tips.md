# Tips

## Conflicting aliases

When reading command files, you may accidentally define the same aliases for different commands:

In this example, we have a `send-mail` command. Take note of the aliases.

<CodeGroup>
<CodeGroupItem title="JS">

```js{7}
// **/commands/message/send-mail.js

module.exports = {
    builder: new MessageCommandBuilder()
        .setName("send-mail")
        .setDescription("Send someone a DM.")
        .setAliases(["sm", "mail"]),

    execute: async (client, message, options) => {
        // ...
    },
}
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts{7}
// **/commands/message/send-mail.ts

const command: MessageCommandData = {
    builder: new MessageCommandBuilder()
        .setName("send-mail")
        .setDescription("Send someone a DM.")
        .setAliases(["sm", "mail"]),

    execute: async (client, message, options) => {
        // ...
    },
}

module.exports = command;
```

</CodeGroupItem>
</CodeGroup>

We then have a `send-modmail` command, but it has one identical alias with the above.

<CodeGroup>
<CodeGroupItem title="JS">

```js{7}
// **/commands/message/send-modmail.js

module.exports = {
    builder: new MessageCommandBuilder()
        .setName("send-modmail")
        .setDescription("Send staff some modmail.")
        .setAliases(["sm", "modmail"]), // both have "sm"

    execute: async (client, message, options) => {
        // ...
    },
}
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts{7}
// **/commands/message/send-modmail.ts

const command: MessageCommandData = {
    builder: new MessageCommandBuilder()
        .setName("send-modmail")
        .setDescription("Send staff some modmail.")
        .setAliases(["sm", "modmail"]), // both have "sm"

    execute: async (client, message, options) => {
        // ...
    },
}

module.exports = command;
```

</CodeGroupItem>
</CodeGroup>

As a workaround, you may want to check for already-defined aliases and throw an error when encountering one. With the [Collections](https://discordjs.guide/additional-info/collections.html#collections) data structure, we can do such a thing.

<CodeGroup>
<CodeGroupItem title="JS">

```js{9-11}
function loadCommands() {
    const commands = new Collection();

    for (const file of fs.readdirSync("./commands/message")) {
        const command = require(`./commands/message/${file}`);
        commands.set(command.builder.name, command);

        for (const alias of command.builder.aliases) {
            if (commands.has(alias)) {
                throw new Error(`${command.builder.name} already has the alias ${alias}.`);
            }

            commands.set(alias, command);
        }
    }

    return commands;
}
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts{9-11}
function loadCommands() {
    const commands = new Collection<string, SlashCommandData>();

    for (const file of fs.readdirSync("./commands/message")) {
        const command = require(`./commands/message/${file}`) as SlashCommandData;
        commands.set(command.builder.name, command);

        for (const alias of command.builder.aliases) {
            if (commands.has(alias)) {
                throw new Error(`${command.builder.name} already has the alias ${alias}.`);
            }

            commands.set(alias, command);
        }
    }

    return commands;
}
```

</CodeGroupItem>
</CodeGroup>

## Regular expression implementation

The package exposes a utility method, [`toRegex()`](../references/MessageCommandBuilder.md#toregex), in the builder class:

```js
const PREFIX = "!";

const builder = new MessageCommandBuilder()
		.setName("test")
		.setDescription("testing description")
		.setAliases(["t", "TEST"])
		.addStringOption(option =>
			option
				.setName("string-option")
				.setDescription("foo option description")
		)
		.addNumberOption(option =>
			option
				.setName("number-option")
				.setDescription("foo option description")
		)
		.addBooleanOption(option =>
			option
				.setName("boolean-option")
				.setDescription("foo option description")
		)
		.addMemberOption(option =>
			option
				.setName("member-option")
				.setDescription("foo option description")
		));


console.log(builder.toRegex(PREFIX));
// /^!(test|t|TEST)\s+"(.+)"\s+(\d+)\s+(true|false)\s+<@!?(\d{17,19})>$/gm
```