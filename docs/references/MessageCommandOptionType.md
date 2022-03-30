# MessageCommandOptionType

<Badge type="warning" text="readonly" vertical="middle" /> <Badge type="tip" text="enum" vertical="middle" />

## Properties

-   **STRING** = "text"
-   **NUMBER** = "number"
-   **BOOLEAN** = "true/false"
-   **MEMBER** = "member mention"
-   **ROLE** = "role mention"
-   **CHANNEL** = "channel mention"

::: details TypeScript Source Code
```ts:no-line-numbers
const enum MessageCommandOptionType {
	BOOLEAN = "true/false",
	NUMBER = "number",
	STRING = "text",
	MEMBER = "member",
	CHANNEL = "channel",
	ROLE = "role",
}
```
:::

