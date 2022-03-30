# MessageCommandBuilder

<Badge type="tip" text="class" vertical="middle" />

The entry point to constructing a message command.

## Constructor

#### Parameters:

-   **data?**: [MessageCommandBuilderData](MessageCommandBuilderData.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public constructor(data?: MessageCommandBuilderData) {
    this.name = data?.name ?? "No name implemented";
    this.description = data?.description ?? "No description implemented";
    this.aliases = data?.aliases ?? [];
    this.options = data?.options ?? [];
    this.roleIds = data?.roleIds ?? [];
    this.permissions = data?.permissions ?? [];
}
```

:::

---

## Properties

### name

-   **type**: `string`

The name of the command.

---

### description

-   **type**: `string`

The description of the command.

---

### aliases

-   **type**: `string[]`

Any aliases the command may be executed with.

---

### options

-   **type**: [MessageCommandOption](MessageCommandOption.md)`[]`

The available options/arguments that can be supplied to this command.

## Methods

### **setName**

Sets the name of the command. Must be called at least once if method-chaining.

#### Parameters:

-   **name**: `string`

The command name. Cannot be empty.

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setName(name: string): MessageCommandBuilder {
    if (name === "") {
        throw new Error("Command name must be at least one character long.");
    }

    this.name = name;
    return this;
}
```

:::

---

### **setDescription**

Sets the description of the command. Must be called at least once if method-chaining.

#### Parameters:

-   **description**: `string`

The command description. Cannot be empty.

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setDescription(description: string): MessageCommandBuilder {
    if (description === "") {
        throw new Error("Command description must be at least one character long.");
    }

    this.description = description;
    return this;
}
```

:::

---

### **setAliases**

Sets any aliases that this command should be identified by.

#### Parameters:

-   **aliases**: `string[]`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setAliases(aliases: string[]): MessageCommandBuilder {
    if (aliases.length <= 0) {
        throw new Error("There must be at least one alias provided in the array.");
    }

    if (aliases.some(a => a === "")) {
        throw new Error("Aliases must be at least one character long.");
    }

    this.aliases = aliases;
    return this;
}
```

:::

---

### **setRoles**

Sets the permitted guild roles that can use this command. If a role isn't found in the guild, it will be ignored.

#### Parameters:

-   **ids**: `Snowflake[]`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setRoles(ids: string[]): MessageCommandBuilder {
    if (ids.length <= 0) {
        throw new Error("There must be at least one role ID provided in the array.");
    }

    this.roleIds = ids;
    return this;
}
```

:::

---

### **setPermissions**

Sets the Discord permission roles that are allowed to use this command.

#### Parameters:

-   **permissions**: `PermissionResolvable[]`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setPermissions(permissions: PermissionResolvable[]): MessageCommandBuilder {
    if (permissions.length <= 0) {
        throw new Error("There must be at least one permission provided in the array.");
    }

    this.permissions = permissions;
    return this;
}
```

:::

---

### **addStringOption**

Adds an option that accepts a line of text, enclosed by `""`. This option can have pre-defined values.

Example: `"Hello, world!"` or `"42"`

#### Parameters:

-   **composer**: `(option: MessageCommandStringOption) => MessageCommandStringOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public addStringOption(composer: (option: MessageCommandStringOption) => MessageCommandStringOption): MessageCommandBuilder {
    const option = composer(new MessageCommandStringOption());
    this.options.push(option);
    return this;
}
```

:::

---

### **addNumberOption**

Add an option that accepts integer values. This option can have pre-defined values.

::: tip ACCEPTED:

`4`, `1242452352`, `-1`

:::

::: danger NOT ACCEPTED:

`"4"`, `true`

:::

#### Parameters:

-   **composer**: `(option: MessageCommandNumberOption) => MessageCommandNumberOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public addNumberOption(composer: (option: MessageCommandNumberOption) => MessageCommandNumberOption): MessageCommandBuilder {
    const option = composer(new MessageCommandNumberOption());
    this.options.push(option);
    return this;
}
```

:::

---

### **addBooleanOption**

Adds an option that accepts `true` or `false`.

#### Parameters:

-   **composer**: `(option: MessageCommandBooleanOption) => MessageCommandBooleanOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public addBooleanOption(composer: (option: MessageCommandBooleanOption) => MessageCommandBooleanOption): MessageCommandBuilder {
    const option = composer(new MessageCommandBooleanOption());
    this.options.push(option);
    return this;
}
```

:::

---

### **addMemberOption**

#### Parameters:

-   **composer**: `(option: MessageCommandMemberOption) => MessageCommandMemberOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public addMemberOption(composer: (option: MessageCommandMemberOption) => MessageCommandMemberOption): MessageCommandBuilder {
    const option = composer(new MessageCommandMemberOption());
    this.options.push(option);
    return this;
}
```

:::

---

### **addChannelOption**

#### Parameters:

-   **composer**: `(option: MessageCommandChannelOption) => MessageCommandChannelOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
addChannelOption(composer: (option: MessageCommandChannelOption) => MessageCommandChannelOption): MessageCommandBuilder {
    const option = composer(new MessageCommandChannelOption());
    this.options.push(option);
    return this;
}
```

:::

---

### **addRoleOption**

#### Parameters:

-   **composer**: `(option: MessageCommandRoleOption) => MessageCommandRoleOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public addRoleOption(composer: (option: MessageCommandRoleOption) => MessageCommandRoleOption): MessageCommandBuilder {
    const option = composer(new MessageCommandRoleOption());
    this.options.push(option);
    return this;
}
```

:::

---

### **toRegex**

#### Parameters:

-   **prefix**: `string`

The guild's message prefix.

#### Returns:

-   `RegExp`

::: details TypeScript Source Code

```ts:no-line-numbers
public toRegex(prefix: string): RegExp {
    const aliases = this.aliases.length > 0 ? `|${this.aliases.join("|")}` : "";

    let regex = `${prefix}(${this.name}${aliases})`;

    for (const option of this.options) {
        regex += `\\s+`;

        if (option instanceof MessageCommandOptionChoiceable) {
            if (option.choices.length <= 0) {
                switch (option.type) {
                    case MessageCommandOptionType.STRING:
                        regex += `\"(.+)\"`;
                        break;
                    case MessageCommandOptionType.NUMBER:
                        regex += `(\\d+)`;
                        break;
                }
            } else {
                regex += `\"(${option.choices.map(c => c[1]).join("|")})\"`;
            }

            continue;
        }

        switch (option.type) {
            case MessageCommandOptionType.BOOLEAN:
                regex += `(true|false)`;
                break;
            case MessageCommandOptionType.MEMBER:
                regex += `<@!?(\\d{17,19})>`;
                break;
            case MessageCommandOptionType.CHANNEL:
                regex += `<#(\\d{17,19})>`;
                break;
            case MessageCommandOptionType.ROLE:
                regex += `<@&(\\d{17,19})>`;
        }
    }

    return new RegExp(`^${regex}$`, "gm");
}
```

:::

---

### **validate**

#### Parameters:

-   **message**: `Message`

The message that invoked the command.

#### Returns:

-   `Object`

::: details TypeScript Source Code

```ts:no-line-numbers
public validate(message: Message): { errors: string[], options: unknown[] } {
		const errors: string[] = [];
		const parsedOptions: unknown[] = [];
		const args = message.content.trim().split(/\s+/).slice(1);

		for (const perm of this.permissions) {
			if (!message.member!.permissions.has(perm)) {
				errors.push(`Missing permission: ${perm}`);
			}
		}

		for (const id of this.roleIds) {
			if (!message.guild!.roles.cache.has(id)) {
				continue;
			}

			if (!message.member!.roles.cache.has(id)) {
				errors.push(`Missing role: ${roleMention(id)}`);
			}
		}

		if (args.length === this.options.length) {
			for (let i = 0; i < this.options.length; i++) {
				const option = this.options[i];
				const result = option.validate(args[i]);

				if (result === undefined) {
					errors.push(`Invalid option: ${option.name}`);
					continue;
				}

				parsedOptions.push(result);
			}
		} else {
			errors.push("The number of arguments provided does not match the number of parsedOptions.");
		}

		return {
			options: parsedOptions,
			errors,
		};
	}
```

:::
