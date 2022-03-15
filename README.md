# djs-message-commands

## Description

A utility package to help you construct and validate message commands for discord.js.

## Background

Message commands are far inferior to slash commands for both the developer/user.

Due to many problems, it becomes hard to:

-   Parse commands into reliable, consistent formats
-   Check for _many_ edge cases (e.g. spacing between each argument, missing arguments, etc.)
-   Validate argument types (dear god)
-   Restrict specific arguments to certain defined values (e.g. only allow certain roles, a specific number etc.)
-   Find a proper way to create/manage commands
-   Handle permission/role descrepancies
-   _and a lot more..._ you know what I'm talking about.

Of course, all these problems have been acknowledged by the community, as messages simply weren't meant to be used in a command-based way.

This package aims to provide a safe and easy way to manage, create, and validate message commands, including utility components to help with the process.

This was heavily inspired by discord.js' builder pattern for slash commands.

> _Note: This package tries to be as unopinionated as possible, but I will recommend certain aspects that may conflict with your project structure. It will also follow the discord.js guide on how to manage your file structure._

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

Read the documentation here!

### Defining a simple command:

TypeScript:

```ts
// ./commands/ping.ts
import { MessageCommandBuilder, MessageCommandData } from "djs-message-commands";

const command: MessageCommandData = {
    // similar to SlashCommandBuilder
    builder: new MessageCommandBuilder()
        .setName("ping")
        .setDescription("A ping command."),

    execute: async (helper: MessageCommandHelper) => {
        await helper.message.reply("Pong!");
    }
}

module.exports = command;

...

// bot-setup.ts
import { MessageCommandData, MessageCommandData } from "djs-message-commands";

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(MESSAGE_PREFIX)) {
        // quick example; don't actually hard-code the route
        const command = require("./commands/ping") as MessageCommandData;
        const helper = new MessageCommandHelper(message);

        await command.execute(helper);
    }
});
```

JavaScript:

```js
const { MessageCommandBuilder } = require("djs-message-commands");
```
