# MessageCommandBooleanOption

<Badge type="tip" text="class" vertical="middle" />

#### extends [MessageCommandOption](./MessageCommandOption.md)

## Methods

### **validate** <Badge type="tip" text="override" vertical="middle" />

#### Parameters

-   **option**: `string`

#### Returns

-   `boolean`

::: details TypeScript Source Code

```ts:no-line-numbers
public override validate(option: string): boolean | undefined {
    const matches = option.match(/^(true|false)$/g);

    if (matches) {
        if (matches[0] === "true") {
            return true;
        }
        if (matches[0] === "false") {
            return false;
        }
    }

    return undefined;
}
```

:::
