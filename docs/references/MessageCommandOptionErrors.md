# MessageCommandOptionErrors

<Badge type="tip" text="object" vertical="middle" />

## Properties

### MISSING_ARGS

When the message command was executed with more/less arguments than the command requires.

---

### INVALID_ARG_TYPE

When an argument to a command was not of the expected type.

---

### MISSING_ROLES

When the command requires a list of roles and the user does not have any of them.

---

### MISSING_PERMISSIONS

When the command requires a list of permissions and the user does not have any of them.

::: details TypeScript Source Code

```ts:no-line-numbers
const MessageCommandOptionErrors = {
	INVALID_ARG_TYPE: "INVALID_ARG_TYPE",
	MISSING_ARGS: "MISSING_ARGS",
	MISSING_PERMISSIONS: "MISSING_PERMISSIONS",
	MISSING_ROLES: "MISSING_ROLES",
} as const;

```

:::
