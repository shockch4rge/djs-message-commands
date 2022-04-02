# MessageCommandNumberOption

<Badge type="tip" text="class" vertical="middle" />

#### extends [MessageCommandOptionChoiceable](./MessageCommandOptionChoiceable.md)

## Methods

### **validate** <Badge type="tip" text="override" vertical="middle" />

#### Parameters

-   **option**: `string`

#### Returns

-   `number`

::: details TypeScript Source Code

```ts:no-line-numbers
public override validate(option: string): number | undefined {
    const number = Number.parseInt(option);
    return Number.isNaN(number) ? undefined : number;
}
```

:::
