# MessageCommandStringOption

<Badge type="tip" text="class" vertical="middle" />

#### extends [MessageCommandOptionChoiceable](./MessageCommandOptionChoiceable.md)

## Methods

### **validate** <Badge type="tip" text="override" vertical="middle" />

#### Parameters

-   **option**: `string`

#### Returns

-   `string`

::: details TypeScript Source Code

```ts:no-line-numbers
public override validate(option: string): string | undefined {
    for (const choice of this.choices) {
        if (choice[1] === option) {
            return choice[1];
        }
    }

    const matches = option.matchAll(/^"(.+)"$/gi).next().value;
    return matches ? matches[1] : undefined;
}
```

:::
