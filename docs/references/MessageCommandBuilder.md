# MessageCommandBuilder

<Badge type="tip" text="class" vertical="middle" />

## Properties

### name

-   **type**: `string`

The name of the command. Only serves as a guideline for users and doesn't do any verification. Throws an error if omitted.

---

### description

-   **type**: `string`

The description of the command. Only serves as a guideline for users and doesn't do any verification. Throws an error if omitted.

---

### aliases

-   **type**: `string[]`

The aliases that this command identifies by.

---

### options

-   **type**: [MessageCommandOption](MessageCommandOption.md)[]

The available options/arguments that can be supplied to by this command.

## Methods

### **setName**

#### Parameters:

-   **name**: `string`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

Sets the name of the command.

---

### **setDescription**

#### Parameters:

-   **description**: `string`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

Sets the description of the command.

---

### **setAliases**

#### Parameters:

-   **aliases**: `string[]`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **setRoles**

#### Parameters:

-   **ids**: `Snowflake[]`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **setPermissions**

-   **permissions**: `PermissionResolvable[]`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **addStringOption**

#### Parameters:

-   **composer**: `(option: MessageCommandStringOption) => MessageCommandStringOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **addNumberOption**

#### Parameters:

-   **composer**: `(option: MessageCommandNumberOption) => MessageCommandNumberOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **addBooleanOption**

#### Parameters:

-   **composer**: `(option: MessageCommandBooleanOption) => MessageCommandBooleanOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **addMemberOption**

#### Parameters:

-   **composer**: `(option: MessageCommandMemberOption) => MessageCommandMemberOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **addChannelOption**

#### Parameters:

-   **composer**: `(option: MessageCommandChannelOption) => MessageCommandChannelOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **addRoleOption**

#### Parameters:

-   **composer**: `(option: MessageCommandRoleOption) => MessageCommandRoleOption`

#### Returns:

-   [MessageCommandBuilder](MessageCommandBuilder.md)

---

### **toRegex**

#### Parameters:

-   **prefix**: `string`

The guild's message prefix.

#### Returns:

-   `RegExp`

---

### **validate**

#### Parameters:

-   **message**: `Message`

The message that invoked the command.

#### Returns:

-   `Object`
