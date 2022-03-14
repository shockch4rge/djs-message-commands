# djs-message-commands

## Description

A utility package to help you construct and validate message commands for discord.js.

Knowing that message commands are far inferior to slash commands in terms of the developer/user experience, this package aims to provide a safe and easy way to manage, create, and validate message commands.

This was heavily inspired by discord.js' builder pattern for slash commands.

> _Note: This package tries to be as unopinionated as possible, but I will recommend certain aspects that may conflict with your project structure. It will also follow discord.js' recommended file structure._

## Features

-   Validate your commands with types for each option
-   Provide limited choices for each command option

## Installation

yarn:

```
yarn add djs-message-commands
```

npm:

```
npm install djs-message-commands
```

## Usage

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

