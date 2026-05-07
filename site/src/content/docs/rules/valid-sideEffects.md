---
title: valid-sideEffects
description: Enforce that the `sideEffects` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `sideEffects` property:

- It must be either a boolean or an array.
- If the value is an array, it should only consist of non-empty strings

Example of **incorrect** code for this rule:

```json
{
  "sideEffects": "false"
}
```

Example of **correct** code for this rule:

```json
{
  "sideEffects": false
}
```

```json
{
  "sideEffects": ["./dist/polyfills.js"]
}
```
