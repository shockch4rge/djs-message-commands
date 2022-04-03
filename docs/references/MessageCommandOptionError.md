# MessageCommandOptionError

<Badge type="tip" text="interface" vertical="middle" />

## Properties

### **message**

-   **type**: `string`

The message of the error.

### **type**

-   **type**: `keyof` `typeof` [MessageCommandOptionError](./MessageCommandOptionError.md)

::: details TypeScript Source Code

```ts:no-line-numbers
interface MessageCommandOptionError {
	message: string;
	type: keyof typeof MessageCommandOptionErrors;
}
```

:::
