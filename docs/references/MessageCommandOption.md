# MessageCommandOption

<Badge type="tip" text="abstract" vertical="middle" /> <Badge type="tip" text="class" vertical="middle" />

A composable option/argument to add to a message command.

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

---

### **setDescription**

#### Parameters:

-   **name**: `string`

#### Returns:

-   [MessageCommandOption](MessageCommandOption.md)

---

### **validate** <Badge type="tip" text="abstract" vertical="middle" />

#### Parameters:

-   **name**: `string`

#### Returns:

-   `unknown`
