---
title: valid-publishConfig
description: Enforce that the `publishConfig` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `publishConfig` property:

- It must be an object.
- Each property in the object that maps to an existing package.json property (e.g. `exports`) must pass the same validations that would be applied to the top-level property
- For properties that don't map to other top-level package.json properties (e.g. `access`), they have their own set of validations that are applied, based on the `npm` spec

Example of **incorrect** code for this rule:

```json
{
  "publishConfig": {
    "provenance": "true"
  }
}
```

Example of **correct** code for this rule:

```json
{
  "publishConfig": {
    "provenance": true
  }
}
```
