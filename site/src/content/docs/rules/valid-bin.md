---
title: valid-bin
description: Enforce that the `bin` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `bin` property:

- It must be either a non-empty string or an object.
- If the value is an object, it should only consist of non-empty string values.

Example of **incorrect** code for this rule:

```json
{
  "bin": {
    "invalid-bin": 123
  }
}
```

Example of **correct** code for this rule:

```json
{
  "bin": "./bin/cli.js"
}
```

```json
{
  "bin": {
    "my-cli": "./bin/cli.js"
  }
}
```
