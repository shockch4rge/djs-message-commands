# MessageCommandOptionData

<Badge type="tip" text="interface" vertical="middle" />

### name

-   **type**: `string`

The name of the option.

---

### description

-   **type**: `string`

The description of the option.

---

### type <Badge type="tip" text="readonly" vertical="middle" />

-   **type**: [MessageCommandOptionType](MessageCommandOptionType.md)

The type of the option.

::: details TypeScript Source Code

```ts:no-line-numbers
interface MessageCommandOptionData {
	name: string;
	description: string;
	required: boolean;
	readonly type: MessageCommandOptionType;
}
```

:::
