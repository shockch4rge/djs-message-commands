# MessageCommandMemberOption

<Badge type="tip" text="class" vertical="middle" />

#### extends [MessageCommandOption](./MessageCommandOption.md)

## Methods

### **validate** <Badge type="tip" text="override" vertical="middle" />

#### Parameters

-   **option**: `string`

#### Returns

-   `Snowflake`

::: details TypeScript Source Code

```ts:no-line-numbers
public override validate(option: string): Snowflake | undefined {
    const matches = option.matchAll(MessageMentions.USERS_PATTERN).next().value;
    return matches ? matches[1] : undefined;
}
```

:::
