# Usage

## Installation

<code-group>
<code-block title="npm">
```bash
npm install djs-message-commands
```
</code-block>

<code-block title="yarn">
```bash
yarn add djs-message-commands
```
</code-block>

<code-block title="pnpm">
```bash
pnpm install djs-message-commands
```
</code-block>
</code-group>

## Notation

While the arguments passed to message commands are commonly referred to, well, as 'arguments', I will refer to them as 'options' for consistency with discord.js' SlashCommandBuilder documentation.

## Defining message commands

This is the most barebones _(and probably most common way)_ that one would naively create a message command.

```ts
// bot-setup.ts
client.on("messageCreate", async message => {
	if (message.author.bot) return;
	// handles DMs
	if (!message.guild) return;

	const args = message.content.trim().split(" ");

	if (args[0] === `${MESSAGE_PREFIX}ping`) {
		await message.channel.send("Pong!");
		// other code execution....
	}

	if (args[0] === `${MESSAGE_PREFIX}bees`) {
		await message.channel.send("I like bees");
		// other code execution....
	}
});
```

In this slash command example, discord.js recommends this structure:

```ts
// ./commands/ping.ts
interface SlashCommandData {
	builder: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

const command: SlashCommandData = {
	builder: new SlashCommandBuilder().setName("ping").setDescription("ping description"),

	execute: async interaction => {
		await interaction.reply("Pong!");
	},
};

module.exports = command;

/*
    ...Skipping a lot of command deployment stuff that is out of scope...
*/

// bot-setup.ts
client.on("interactionCreate", async interaction => {
	if (interaction.isCommand()) {
			const command = require(`../commands/${interaction.commandName}`) as SlashCommandData;

            if (command) {
                await command.execute(interaction);
            }
		};
	};
});
```

This works really well. So....what if we adopted a similar pattern for constructing message commands?

```ts
// ./commands/ping.ts
interface MessageCommandData {
	builder: MessageCommandBuilder;
	execute: (args: string[], message: Message) => Promise<void>;
}

const command: MessageCommandData = {
	builder: new MessageCommandBuilder().setName("ping").setDescription("ping description"),

	execute: async (args, message) => {
		await message.channel.send("Pong!");
	},
};

// bot-setup.ts
client.on("messageCreate", async message => {
	const args = message.content.split(" ");

	if (args[0] === `${MESSAGE_PREFIX}ping`) {
		const command = require("../commands/ping") as MessageCommandData;
		await command.execute(args, message);
	}
});
```

In this package, MessageCommandBuilder exposes a few methods for setting up the command.

```ts

const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
        .setName("set-nickname")
        .setDescription("Set the nickname of someone else, sneakily.")
        .setAliases(["nick"])
        /*
            add an option that only allows mentionable types
            allowed: <@!1234567890>
            disallowed: 4, randomstring, true
        */
        .addMentionableOption((option: MessageCommandOption) =>
            option
                // name & description are required; will throw error if omitted
                .setName("nickname")
                .setDescription("The nickname to set")
        /*
            add an option that only allows string types
            allowed: foo, bar
            disallowed: 4, true, <@!1234567890>
        */
        .addStringOption((option: MessageCommandOption) =>
            option
                .setName("nickname-string")
                .setDescription("The nickname to set")
        )

	execute: async (args, message) => {
		await message.channel.send("Pong!");
	},
};

module.exports = command;
```
