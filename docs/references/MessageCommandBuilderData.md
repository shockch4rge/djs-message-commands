# MessageCommandBuilderData

<Badge type="tip" text="interface" vertical="middle" />

### name

-   **type**: `string`

The name of the command.


### description

-   **type**: `string`

The description of the command.


### aliases?

-   **type**: `string[]`

Any aliases the command may be executed with.

### roles?

-   **type**: `Snowflake[]`

### permissions?

-   **type**: `PermissionResolvable[]`

### options?

-   **type**: [MessageCommandOption](MessageCommandOption.md)`[]`



::: details Typescript Source Code
```ts
interface MessageCommandBuilderData {
    name: string;
    description: string;
    aliases?: string[];
    roles?: Snowflake[];
    permissions?: PermissionResolvable[];
    options?: MessageCommandOption[];
}
```
:::