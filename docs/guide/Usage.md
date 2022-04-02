# Usage

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

In this slash command example, discord.js recommends the following structure:

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

Each command lives in their own file, which works really well. Unfortunately, as of now, discord.js doesn't provide any tools to create message commands, making it a daunting and time-consuming task to implement our own system to handle them. This package aims to provide a construct for creating message commands, and at the same time maintain a common interface between slash and message commands.

How a message command is created:

<CodeGroup>
<CodeGroupItem title="JS" active=true>

```js
// **/commands/message/ping.js
const { MessageCommandBuilder } = require("djs-message-commands");

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
import { MessageCommandBuilder } from "djs-message-commands";

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

As you can see, most of the code is identical to SlashCommandBuilder. 

Here's a more in-depth example of how you can build a message command:

```ts

// Message command to set the nickname of a member.

const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
        .setName("set-nickname")
        .setDescription("Set the nickname of someone else sneakily.")
		// the command can be triggered with any of these aliases
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
	),

	execute: async (client, message, options) => {
		/**
		 * The expected message should look something like this:
		 * !set-nickname <@!123451234512345123> "CoolNickname-123"
		 */
		const [memberId, nickname] = options as [Snowflake, string];

		// addMemberOption returns a Snowflake, so you have to fetch/get the member yourself.
		const member = await message.guild.members.fetch(memberId);

		if (member) {
			await member.setNickname(nickname);
		}
	},
};

module.exports = command;
```

## Handling permissions and roles

The usage of roles and permissions requirements are demonstrated below. Roles and permissions are handled in the [`validate()`](../references/MessageCommandBuilder.md#validate) method, before command execution.

<CodeGroup>
<CodeGroupItem title="JS">

```js
module.exports = {
	builder: new MessageCommandBuilder()
		.setName("add-role")
		.setDescription("Add a role to a member.")
		// require these role IDs to use this command
		// role IDs specified here that don't exist in the guild will be ignored
		.setRoles(["12345123451234512", "54321123451234512"])
		// require the 'MANAGE_ROLES' permission to use this command
		.setPermissions(["MANAGE_ROLES"])
		.addMemberOption(option =>
			option
				.setName("member")
				.setDescription("The member to add the role to"))
		.addRoleOption(option =>
			option
				.setName("role")
				.setDescription("The role to add to the member")
		)
	),

	execute: async (client, message, options) => {
		const [memberId, roleId] = options;

		const member = await message.guild.members.fetch(memberId);

		if (member) {
			const role = message.guild.roles.cache.get(roleId);

			if (role) {
				await member.roles.add(role);
			}
		}
	},
}
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts
const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("add-role")
		.setDescription("Add a role to a member.")
		// require these role IDs to use this command
		// role IDs specified here that don't exist in the guild will be ignored
		.setRoles(["12345123451234512", "54321123451234512"])
		// require the 'MANAGE_ROLES' permission to use this command
		.setPermissions(["MANAGE_ROLES"])
		.addMemberOption(option =>
			option
				.setName("member")
				.setDescription("The member to add the role to"))
		.addRoleOption(option =>
			option
				.setName("role")
				.setDescription("The role to add to the member")
		)
	),

	execute: async (client, message, options) => {
		const [memberId, roleId] = options as [Snowflake, Snowflake];

		const member = await message.guild.members.fetch(memberId);

		if (member) {
			const role = message.guild.roles.cache.get(roleId);

			if (role) {
				await member.roles.add(role);
			}
		}
	},
}

module.exports = command;
```

</CodeGroupItem>
</CodeGroup>

## Choiceable options

Some options can be given pre-determined values for the user to choose from. This is similar to [discord.js' implementation](https://discordjs.guide/interactions/slash-commands.html#choices).

::: warning
Note that once you set any choices, they are the only values the user can choose from.
:::

For example, we have a message command with a string option here:


<CodeGroup>
<CodeGroupItem title="JS">

```js
module.exports = {
	builder: new MessageCommandBuilder()
		.setName("set-audio-quality")
		.setDescription("Set the audio quality of...something.")
		.setAliases(["saq", "set-aq"])
		.addStringOption(option =>
			option
				.setName("quality")
				.setDescription("The available quality options.")
		),

	execute: async (client, message, options) => {
		// ...
	},
};
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts
const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("set-audio-quality")
		.setDescription("Set the audio quality of...something.")
		.setAliases(["saq", "set-aq"])
		.addStringOption(option =>
			option
				.setName("quality")
				.setDescription("The available quality options.")
		),

	execute: async (client, message, options) => {
		// ...
	},
};

module.exports = command;
```

</CodeGroupItem>
</CodeGroup>

But what if we wanted to limit the quality options to a set few? We can do that with the `setChoices` method:

<CodeGroup>
<CodeGroupItem title="JS">

```js
const AudioQuality = {
	Low: "low",
	Medium: "medium",
	High: "high",
}

module.exports = {
	builder: new MessageCommandBuilder()
		.setName("set-audio-quality")
		.setDescription("Set the audio quality of...something.")
		.setAliases(["saq", "set-aq"])
		.addStringOption(option =>
			option
				.setName("quality")
				.setDescription("The available audio quality choices.")
				/**
				 *	for each tuple, the first element is 
				 *  the choice name (displayed to user), 
				 * 	and the second is the value (value at runtime).
				 */
				.setChoices([
					["Low", AudioQuality.Low],
					["Medium", AudioQuality.Medium],
					["High", AudioQuality.High],
				])
		),

	execute: async (client, message, options) => {
		// input can only exist as "Low", "Medium", or "High"
		const [quality] = options;
	},
};
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts
const enum AudioQuality {
	Low = "low",
	Medium = "medium",
	High = "high",
}

const command: MessageCommandData = {
	builder: new MessageCommandBuilder()
		.setName("set-audio-quality")
		.setDescription("Set the audio quality of...something.")
		.setAliases(["saq", "set-aq"])
		.addStringOption(option =>
			option
				.setName("quality")
				.setDescription("The available audio quality choices.")
				/**
				 *	for each tuple, the first element is 
				 *  the choice name (displayed to user), 
				 * 	and the second is the value (value at runtime).
				 */
				.setChoices([
					["Low", AudioQuality.Low],
					["Medium", AudioQuality.Medium],
					["High", AudioQuality.High],
				])
	),

	execute: async (client, message, options) => {
		// input can only exist as "Low", "Medium", or "High"
		const [quality] = options as [AudioQuality];
	},
};

module.exports = command;
```

</CodeGroupItem>
</CodeGroup>

::: danger
Note that choiceable options are only available for [MessageCommandStringOption](../references/MessageCommandStringOption.md) and [MessageCommandNumberOption](../references/MessageCommandNumberOption.md).
:::

## Validating the message content

A message command sent by the user should look something like this:

![example message command](../assets/img/option-types-index.png)

Let's dissect the command by splitting the arguments by whitespaces:

1. First, we have `!test`. This is what triggers the command.
2. `"this is a string"` is the first **string** argument. Note the double quotes surrounding it! String options are denoted by this format.
3. `32` is a **number** argument.
4. `true` is a boolean argument. This can be either `true` or `false`. Values like `1`, `0`, `on` & `off` are invalid.
5. `@Adobe Xd` is a member mention.
6. `@bot` is a role mention.
7. `#bot-testing` is a channel mention.

The central flow of this package lies in [MessageCommandBuilder](../references/MessageCommandBuilder.md)'s [`validate()`](../references/MessageCommandBuilder.md#validate) method. Here, it checks:

- If the member has the required permissions and roles
- The type of argument passed into each option slot, including choices
- The number of arguments

You may check out the source code here, but in short, it returns an object containing:

- An array of error messages
- An 'options' array.

To get any returned errors, check if the length of the errors array is more than 0:

<CodeGroup>
<CodeGroupItem title="JS">

```js
const { errors, options } = command.builder.validate(message);

if (errors.length > 0) {
	console.log(errors);
}
```

</CodeGroupItem>
<CodeGroupItem title="TS">

```ts
const { errors, options } = command.builder.validate(message);

if (errors.length > 0) {
	console.log(errors);
}
```

</CodeGroupItem>
</CodeGroup>