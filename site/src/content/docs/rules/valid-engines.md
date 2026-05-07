---
title: valid-engines
description: Enforce that the `engines` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `engines` property:

- It must be an object.
- It should be a key to string value object, and the values should all be non-empty.

Example of **incorrect** code for this rule:

```json
{
  "engines": {
    "node": 24
  }
}
```

Example of **correct** code for this rule:

```json
{
  "engines": {
    "node": "^24.11.0"
  }
}
```
