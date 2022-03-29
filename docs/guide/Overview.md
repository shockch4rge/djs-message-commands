# djs-message-commands

A utility package to help you construct and validate message commands for [discord.js](https://discord.js.org/#/).

## Installation

<CodeGroup>
  <CodeGroupItem title="npm" active=true>

```bash:no-line-numbers
npm install djs-message-commands
```

  </CodeGroupItem>
  
  <CodeGroupItem title="yarn">

```bash:no-line-numbers
yarn add djs-message-commands
```

  </CodeGroupItem>

  <CodeGroupItem title="pnpm">

```bash:no-line-numbers
pnpm install djs-message-commands
```

  </CodeGroupItem>
</CodeGroup>

## Features

-   Create robust and easily testable message commands
-   Uses a discord.js-esque builder system
-   Built-in parser to parse strings into numbers, booleans, mentionables, etc.

## Background

Ever since discord.js v13, slash commands have been far superior to message commands for both the developers and users.

**Using classic message commands, it becomes hard to:**

-   Parse commands into reliable, consistent formats
-   Handle _way_ too many edge cases (e.g. spacing between each argument, missing arguments, etc.)
-   Validate argument types (dear god)
-   Restrict specific arguments to pre-determined values (e.g. only allow specific strings, numbers etc.)
-   Create/manage commands in a scalable way
-   Handle permission/role descrepancies
-   _and a lot more..._ you know what I'm talking about.

While these problems have been widely acknowledged by the community, they are still a pain to deal with, as other packages don't quite hit the mark in terms of ease of use, e.g. consistency with discord.js, robustness etc.

This package aims to provide a safe and easy way to manage, create, and validate message commands, with an architecture reminiscent of discord.js' slash command builders.

::: tip

-   Required options are not supported as of now. They might come in a later release.
-   While this package tries to be unopinionated, it still follows [discord.js' guide on managing file structure.](https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files) I recommend looking into this guide as most of the code will be similar to theirs.

:::

## Quick Start

How discord.js recommends structuring slash commands:

```js
// **/commands/slash/foo.js
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
	builder: new SlashCommandBuilder().setName("foo").setDescription("bar"),

	execute: async interaction => {
		// some code here...
	},
};
```

This package follows a similar pattern.

```js
// **/commands/message/foo.js
import { MessageCommandBuilder } from "djs-message-commands";

module.exports = {
	builder: new MessageCommandBuilder().setName("foo").setDescription("bar"),

	execute: async (message, options) => {
		// some code here...
	},
};
```

### Receiving message commands

```js
// index.js

// Collection util class from discord.js
const commands = new Collection();

// saving the commands defined in the 'commands' directory
for (const file of fs.readdirSync("./commands/message")) {
	const command = require(`./commands/message/${file}`);
	// use the builder's name as the key
	commands.set(command.builder.name, command);

	// set potential aliases the command may have with the same data
	for (const alias of command.builder.aliases) {
		commands.set(alias, command);
	}
}

client.on("messageCreate", async message => {
	if (message.author.bot) return;

	const args = message.content.trim().split(/\s+/);
	// if the prefix doesn't match, ignore the message
	if (args[0].slice(0, PREFIX.length) !== PREFIX) return;

	await message.channel.sendTyping();

	const commandName = args[0].slice(PREFIX.length);
	const command = commands.get(commandName);

	if (!command) {
		// handle command not found
		return;
	}

	// get errors and parsed options
	const { errors, options } = command.builder.validate(message);

	if (errors.length > 0) {
		console.warn(errors);
		return;
	}

	try {
		await command.execute(client, message, options);
	} catch (err) {
		// handle execution error...
	}
});
```

### Handling options

```js
// **/commands/message/foo.js
import { MessageCommandBuilder } from "djs-message-commands";

module.exports = {
	builder: new MessageCommandBuilder()
		.setName("foo")
		.setDescription("bar")
		.addStringOption(option =>
			option
				// you can name this however you want
				.setName("string-option")
				.setDescription("foo option description")
		)
		.addNumberOption(option => option.setName("number-option").setDescription("foo option description"))
		.addBooleanOption(option => option.setName("boolean-option").setDescription("foo option description"))
		.addMemberOption(option => option.setName("member-option").setDescription("foo option description"))
		.addChannelOption(option => option.setName("channel-option").setDescription("foo option description"))
		.addRoleOption(option => option.setName("role-option").setDescription("foo option description")),

	execute: async (client, message, options) => {
		const [string, number, boolean, memberId, channelId, roleId] = options;

		// any mentionable option (members/roles/channels) will return the target's ID.
		// to get the actual object, use fetch() or cache.get()
		const member = await message.guild.members.fetch(memberId);
		// OR
		const member = await message.guid.members.cache.get(memberId);
	},
};
```

Usage with TypeScript:

```ts
// **/commands/message/foo.ts
import { MessageCommandBuilder } from "djs-message-commands";

module.exports = {
	builder: new MessageCommandBuilder(),
	// same options defined above...

	// the 'options' parameter will be an unknown array
	execute: async (client, message, options) => {
		// assert types in the order that you chained them in.
		// e.g. if you did addStringOption() and then addBooleanOption(), the order would be [string, boolean].
		const [string, number, boolean, memberId, channelId, roleId] = options as [
			string,
			number,
			boolean,
			string,
			string,
			string
		];
	},
};
```

The package exposes a utility method, `toRegex()`, in the builder class:

```js
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


console.log(builder.toRegex());
// /^>>(test|t|TEST)\s+"(.+)"\s+(\d+)\s+(true|false)\s+<@!?(\d{17,19})>$/gm
```

## Contribution

If you have any enquiries, please open an issue or pull request on the [GitHub repository](https://github.com/Shockch4rge/djs-message-commands)!

## License

MIT
