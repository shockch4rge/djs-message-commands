## Prerequisites

-   Node v16.x or higher.
-   Any package manager (npm, yarn, pnpm)

## Installation

With npm:

```bash
npm install djs-message-commands
```

With yarn:

```bash
yarn add djs-message-commands
```

With pnpm:

```bash
pnpm install djs-message-commands
```

With djs-message-commands comes a few features:

-   **Command aliases**

    Commands with long names can be given multiple aliases, reducing the user fatigue required to execute it and at the same time keeping full detail.

-   **Roles and permissions checking**

    Each command can be prerequisited by a list of roles and permissions before executing it, so that you can focus on a pure command implementation by separating adminstrative validation.

-   **Options**

    Similar to discord.js' SlashCommandOption, these are simply parameters of a message command. They are used to define the type of arguments that are expected to be passed in by the user.

-   **Options (choices)**

    For some option types, you can define a list of choices that the user can choose from.

## Background

Ever since discord.js v13, slash commands have been far superior to message commands for both the developers and users.

**Implementing a system for message commands is hard because:**

-   Commands need to be parsed into reliable, consistent formats, while handling _way_ too many edge cases (e.g. spacing between each argument, missing arguments, etc.)
-   Restricting specific arguments to pre-determined values (e.g. only allow specific strings, numbers etc.) and validating argument types requires special implementation and complicated regular expressions.
-   A scalable way to create commands had to be scrutinised over.
-   Handle permission/role descrepancies. Checking administrative privileges was often mixed in with command execution.
-   _and a lot more..._ you know what I'm talking about.

While these problems have been widely acknowledged by the community, they are still a pain to deal with, as other packages don't quite hit the mark in terms of ease of use, e.g. consistency with discord.js, robustness etc.

This package aims to provide a safe and easy way to manage, create, and validate message commands, with an architecture reminiscent of discord.js' slash command builders.

> -   Required options are not supported as of now. They might come in later release.
> -   While this package tries to be unopinionated, it still follows [discord.js' guide on managing file structure.](https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files) I recommend looking into this guide for more in-depth details.

## Quick Start

### Importing

JavaScript:

```js
const { MessageCommandBuilder } = require('djs-message-commands');
```

TypeScript:
```ts
// with "allowSyntheticDefaultImports": false
// recommended way to import, even when set to true
import { MessageCommandBuilder } from "djs-message-commands";

// with "allowSyntheticDefaultImports": true
import DMC from "djs-message-commands";
    // or any other name you want
```

### Defining commands

```js
// **/commands/message/foo.js
const { MessageCommandBuilder } = require("djs-message-commands");

module.exports = {
	builder: new MessageCommandBuilder().setName("foo").setDescription("bar"),

	execute: async (client, message, options) => {
		// some code here...
	},
};
```

### Receiving commands

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
	const [errors, options] = command.builder.validate(message);

	if (errors) {
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
const { MessageCommandBuilder } = require("djs-message-commands");

module.exports = {
	builder: new MessageCommandBuilder()
		.setName("send-dm")
		.setDescription("Sends a DM to a member.")
		.addStringOption(option =>
			option
				// you can name this however you want
				.setName("content")
				.setDescription("The text to send.")
		)
		.addNumberOption(option =>
			option.setName("repeats").setDescription("How many times to repeat the message.")
		)
		.addMemberOption(option => option.setName("member").setDescription("The member to send the DM to.")),

	execute: async (client, message, options) => {
		const [content, repeats, memberId] = options;

		// any mentionable option extracts the Snowflake from the message
		// to get the actual target, use fetch() or cache.get()
		const member = await message.guild?.members.fetch(memberId);
		// OR
		const member = await message.guild?.members.cache.get(memberId);

		if (member) {
			for (let i = 0; i < repeats; i++) {
				// send the message based on the number of repeats
				await member.send(content);
			}
		}
	},
};
```

## Contribution

If you have any enquiries, please open an issue or pull request on the [GitHub repository](https://github.com/Shockch4rge/djs-message-commands)!

## License

MIT
