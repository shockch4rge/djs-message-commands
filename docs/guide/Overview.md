# Overview

## Description

A utility package to help you construct and validate message commands for [discord.js](https://discord.js.org/#/).

## Background

Message commands are far inferior to slash commands for both the developer/user.

Using message commands, it becomes hard to:

-   Parse commands into reliable, consistent formats
-   Handle _way_ too many edge cases (e.g. spacing between each argument, missing arguments, etc.)
-   Validate argument types (dear god)
-   Restrict specific arguments to certain defined values (e.g. only allow certain roles, a specific number etc.)
-   Create/manage commands in a scalable way
-   Handle permission/role descrepancies
-   _and a lot more..._ you know what I'm talking about.

While these problems have been widely acknowledged by the community, they are still a pain to deal with, as other packages don't quite hit the mark in terms of ease of use, e.g. consistency with discord.js, robustness etc.

This package aims to provide a safe and easy way to manage, create, and validate message commands, with an architecture reminiscent of discord.js' slash command builders. It also includes additional utility components you may find useful.

::: tip
Note: This package tries to be as unopinionated as possible, but I will recommend certain aspects that may conflict with your project structure. It will also follow [discord.js' guide on managing your file structure.](https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files)\_
:::

## Features

-   Create robust and easily testable message commands
-   Uses a discord.js-esque builder system
