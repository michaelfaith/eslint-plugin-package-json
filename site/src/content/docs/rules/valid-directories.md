---
title: valid-directories
description: Enforce that the `directories` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `directories` property is an object.

Example of **incorrect** code for this rule:

```json
{
  "directories": true
}
```

Example of **correct** code for this rule:

```json
{
  "directories": {
    "bin": "dist/bin",
    "man": "docs"
  }
}
```
