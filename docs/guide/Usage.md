# Usage

::: tip
Parameters that are passed in with a message command are commonly referred to as 'arguments'. However, this package will refer to them as 'options' to maintain consistency with discord.js.
:::

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

Obviously, a giant pile of if/else statements is not scalable, and neither does it look nice. So how would we fix this issue?

In this slash command example, discord.js recommends this structure:

<CodeGroup>
<CodeGroupItem title="JS" active=true>

```js
// **/commands/slash/ping.js
module.exports = {
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get the latency of the bot"),

	execute: async interaction => {
		await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
	},
};

...

// /bot-setup.js
const commands = loadCommands();

client.on("interactionCreate", async interaction => {
	if (interaction.isCommand()) {
		const command = commands.get(interaction.commandName);
		if (!command) return;

		await command.execute(interaction);
	};
});

function loadCommands() {
	const commands = new Collection();

	for (const file of fs.readdirSync("./commands/slash")) {
		const command = require(`./commands/slash/${file}`);
		commands.set(command.builder.name, command);
	}

	return commands;
}
```

</CodeGroupItem>

<CodeGroupItem title="TS">

```ts
// **/commands/slash/ping.ts
interface SlashCommandData {
	builder: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

const command: SlashCommandData = {
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get the latency of the bot"),

	execute: async interaction => {
		await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
	},
}

module.exports = command;

...

// /bot-setup.ts
const commands = loadCommands();

client.on("interactionCreate", async interaction => {
	if (interaction.isCommand()) {
		const command = commands.get(interaction.commandName);
		if (!command) return;

		await command.execute(interaction);
	};
});

function loadCommands() {
	const commands = new Collection<string, SlashCommandData>();

	for (const file of fs.readdirSync("./commands/slash")) {
		const command = require(`./commands/slash/${file}`) as SlashCommandData;
		commands.set(command.builder.name, command);
	}

	return commands;
}
```

</CodeGroupItem>
</CodeGroup>

This works really well. So what if we could adopt a similar pattern for constructing message commands?

<CodeGroup>

<CodeGroupItem title="JS" active=true>

```js
// **/commands/message/ping.js
module.exports = {
	builder: new MessageCommandBuilder()
		.setName("ping")
		.setDescription("Get the bot's latency!"),

	execute: async (client, message, options) => {
		await message.channel.send(`Pong! ${client.ws.ping}ms`);
	},
};

...

// /bot-setup.js
const PREFIX = "!";
const commands = loadCommands();

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

	await command.execute(client, message, options);
});

function loadCommands() {
	const commands = new Collection();

	for (const file of fs.readdirSync("./commands/message")) {
		const command = require(`./commands/message/${file}`);
		commands.set(command.builder.name, command);

		// set potential aliases the command may have with the same command data
		for (const alias of command.builder.aliases) {
			commands.set(alias, command);
		}
	}

	return commands;
}
```

</CodeGroupitem>

<CodeGroupItem title="TS">

```ts
// **/commands/message/ping.ts
interface MessageCommandData {
	builder: MessageCommandBuilder;
	execute: (client: Client, message: Message, options: unknown[]) => Promise<void>;
}

const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("ping")
		.setDescription("Get the bot's latency!"),

	execute: async (client, message, options) => {
		await message.channel.send(`Pong! ${client.ws.ping}ms`);
	},
};

module.exports = command;

...

// bot-setup.ts
const PREFIX = "!";
const commands = loadCommands();

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

	await command.execute(client, message, options);
});

function loadCommands() {
	const commands = new Collection<string, MessageCommandData>();

	for (const file of fs.readdirSync("./commands/message")) {
		const command = require(`./commands/message/${file}`) as MessageCommandData;
		commands.set(command.builder.name, command);

		// set potential aliases the command may have with the same command data
		for (const alias of command.builder.aliases) {
			commands.set(alias, command);
		}
	}

	return commands;
}
```

</CodeGroupItem>

</CodeGroup>

In this package, MessageCommandBuilder exposes a few methods for setting up the command.

```ts

const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
        .setName("set-nickname")
        .setDescription("Set the nickname of someone else sneakily.")
        .setAliases(["nick", "set-nick"])
	  	/*
			add an option that only allows member mention types
			allowed: <@!123456789012345123>
			disallowed: 4, "randomstring", true
			regex: /^<@!?\d{17,19}>$/
	  	*/
	  	.addMemberOption((option: MessageCommandMemberOption) =>
		  	option
				.setName("member")
				.setDescription("The member to set the nickname")
		/*
			add an option that only allows string types
			allowed: "foo", "CoolNickname-123"
			disallowed: 4, true, <@!1234512345123>
			regex: /^"(.+)"$/
	   	*/
	   	.addStringOption((option: MessageCommandStringOption) =>
		   	option
				.setName("nickname")
				.setDescription("The nickname to set")
	   )

	execute: async (message, options) => {
		/**
		 * The message content should look something like this:
		 * !set-nickname <@!123451234512345123> "CoolNickname-123"
		 */
		const [memberId, nickname] = options as [Snowflake, string]

		// addMemberOption returns a Snowflake, so you have to fetch/get the member yourself.
		const member = await message.guild.members.fetch(memberId);

	},
};

module.exports = command;
```

## Choiceable options

Some options can be given pre-determined values for the user to choose from. This is similar to discord.js' [Command Options](https://discord.js.org/#/docs/main/stable/typedef/CommandOptions).

For example, we have a message command with a string option here:

```ts
const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("question")
		.setDescription("Answer a question!")
		.addStringOption(option =>
			option.setName("answer").setDescription("The answer available")
		),

	execute: async (message, options) => {
		// ...
	},
};
```

But what if we wanted to limit the answers to a defined few? We can do that with the `setChoices` method:

```ts
const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("question")
		.setDescription("Answer a question!")
		.addStringOption(option =>
			option
				.setName("answer")
				.setDescription("The answer available")
				/**
				 *	for each tuple, the first element is 
				 *  the choice name (displayed to user), 
				 * 	and the second one is the value (value at runtime).
				 */
				.setChoices([
					["Yes", "Yes"],
					["No", "No"],
					["Maybe", "Maybe"],
				])
	),

	execute: async (message, options) => {
		// answer can only exist as 'Yes', 'No', or 'Maybe'
		const [answer] = options as [string];
	},
};
```

## Important notes
