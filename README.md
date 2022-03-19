# djs-message-commands

## Description

A utility package to help you construct and validate message commands for [discord.js](https://discord.js.org/#/).

## Background

Ever since discord.js v13, slash commands have been far superior for both the developers and users, and for good reason.

Using classic message commands, it becomes hard to:

-   Parse commands into reliable, consistent formats
-   Handle _way_ too many edge cases (e.g. spacing between each argument, missing arguments, etc.)
-   Validate argument types (dear god)
-   Restrict specific arguments to certain defined values (e.g. only allow certain roles, a specific number etc.)
-   Create/manage commands in a scalable way
-   Handle permission/role descrepancies
-   _and a lot more..._ you know what I'm talking about.

While these problems have been widely acknowledged by the community, they are still a pain to deal with, as other packages don't quite hit the mark in terms of ease of use, e.g. consistency with discord.js, robustness etc.

This package aims to provide a safe and easy way to manage, create, and validate message commands, with an architecture reminiscent of discord.js' slash command builders. It also includes additional utility components you may find useful.

> _Note: This package tries to be as unopinionated as possible, but the only caveat is that it follows [discord.js' guide on managing file structure,](https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files) which may not be what you use._

### Defining a command the naive way:

```ts
// bot-setup.ts
client.on("messageCreate", async message => {
	if (message.author.bot) return;
	// handles DMs
	if (!message.guild) return;

	const args = message.content.trim().split(" ");

	if (args[0] === `${MESSAGE_PREFIX}ping`) {
		await message.channel.send("Pong!");
		// code execution....
	}

	if (args[0] === `${MESSAGE_PREFIX}bees`) {
		await message.channel.send("I like bees");
		// other code execution....
	}
});
```

How discord.js handles slash commands:

```ts
module.exports = {
	builder: new SlashCommandBuilder().setName("foo").setDescription("bar"),

	execute: async interaction => {
		// some code here...
	},
};
```

This package follows a similar pattern:

```ts
module.exports = {
	builder: new MessageCommandBuilder().setName("foo").setDescription("bar"),

	execute: async message => {
		// some code here...
	},
};
```

## Features

-   Create robust and easily testable message commands
-   Uses a discord.js-esque builder system
-   Built-in parser to parse strings into numbers, booleans, mentionables, etc.

## Installation

yarn:

```
yarn add djs-message-commands
```

npm:

```
npm install djs-message-commands
```

## Documentation

Read the in-depth documentation here!

## License
MIT