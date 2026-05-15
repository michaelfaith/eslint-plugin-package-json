---
title: valid-dependencies
description: Enforce that the `dependencies` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `dependencies` property is a validated according the following criteria:

- The value is an object
- Each property's key is a valid package name
- Each property's value is a valid version range

Example of **incorrect** code for this rule:

```json
{
  "dependencies": {
    "invalid-version": "catalob:"
  }
}
```

Example of **correct** code for this rule:

```json
{
  "dependencies": {
    "nin": "catalog:",
    "thee-silver-mt-zion": "^1.2.3",
    "david-bowie": "*"
  }
}
```
