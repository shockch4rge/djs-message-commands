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

-   **type**: `MessageCommandOption[]`

The available options/arguments that can be supplied to by this command.

## Methods

### **setName(name)**

#### Parameters:

-   **name**: `string`

#### Returns:

-   `MessageCommandBuilder`

Sets the name of the command.

---

### **setDescription(description)**

#### Parameters:

-   **description**: `string`

#### Returns:

-   `MessageCommandBuilder`

Sets the description of the command.

---

### **setAliases(aliases)**

#### Parameters:

-   **aliases**: `string[]`

#### Returns:

-   `MessageCommandBuilder`

---

### **setRoles(ids)**

#### Parameters:

-   **ids**: `Snowflake[]`

#### Returns:

-   `MessageCommandBuilder`

---

### **setPermissions(permissions)**

-   **permissions**: `PermissionResolvable[]`

#### Returns:

-   `MessageCommandBuilder`

---

### **addStringOption(composer)**

#### Parameters:

-   **composer**: `(option: MessageCommandStringOption) => MessageCommandStringOption`

#### Returns:

-   `MessageCommandBuilder`

---

### **addNumberOption(composer)**

#### Parameters:

-   **composer**: `(option: MessageCommandNumberOption) => MessageCommandNumberOption`

#### Returns:

-   `MessageCommandBuilder`

---

### **addBooleanOption(composer)**

#### Parameters:

-   **composer**: `(option: MessageCommandBooleanOption) => MessageCommandBooleanOption`

#### Returns:

-   `MessageCommandBuilder`

---

### **addMemberOption(composer)**

#### Parameters:

-   **composer**: `(option: MessageCommandMemberOption) => MessageCommandMemberOption`

#### Returns:

-   `MessageCommandBuilder`

---

### **addChannelOption(composer)**

#### Parameters:

-   **composer**: `(option: MessageCommandChannelOption) => MessageCommandChannelOption`

#### Returns:

-   `MessageCommandBuilder`

---

### **addRoleOption(composer)**

#### Parameters:

-   **composer**: `(option: MessageCommandRoleOption) => MessageCommandRoleOption`

#### Returns:

-   `MessageCommandBuilder`
