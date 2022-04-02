# MessageCommandOption

<Badge type="tip" text="abstract" vertical="middle" /> <Badge type="tip" text="class" vertical="middle" />

A composable option/argument to add to a message command.

## Constructor

#### Parameters:

-   **data**: [MessageCommandOptionType](MessageCommandOptionType.md)`|`[MessageCommandOptionData](MessageCommandOptionData.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public constructor(data: MessageCommandOptionType | MessageCommandOptionData) {
    this.name = typeof data === "object" ? data.name : "No name implemented";
    this.description = typeof data === "object" ? data.description : "No description implemented";
    this.required = typeof data === "object" ? data.required : true;
    this.type = typeof data === "object" ? data.type : data;
}
```

:::

## Properties

### **name**

-   **type**: `string`

The name of the option.

---

### **description**

-   **type**: `string`

The description of the option.

---

### **type** <Badge type="tip" text="readonly" vertical="middle" />

-   **type**: [MessageCommandOptionType](MessageCommandOptionType.md)

The type of the option.

## Methods

### **setName**

#### Parameters:

-   **name**: `string`

#### Returns:

-   [MessageCommandOption](MessageCommandOption.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setName(name: string): MessageCommandOption {
    if (name === "") {
        throw new Error("Option name must be at least one character long.");
    }

    this.name = name;
    return this;
}
```

:::

---

### **setDescription**

#### Parameters:

-   **name**: `string`

#### Returns:

-   [MessageCommandOption](MessageCommandOption.md)

::: details TypeScript Source Code

```ts:no-line-numbers
public setDescription(description: string): MessageCommandOption {
    if (description === "") {
        throw new Error("Option description must be at least one character long.");
    }

    this.description = description;
    return this;
}
```

:::

---

### **validate** <Badge type="tip" text="abstract" vertical="middle" />

#### Parameters:

-   **name**: `string`

#### Returns:

-   `unknown`

::: details TypeScript Source Code

```ts:no-line-numbers
public abstract validate(name: string): unknown
```

:::
