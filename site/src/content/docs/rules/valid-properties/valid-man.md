---
title: valid-man
description: Enforce that the `man` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `man` property:

- It must be a string or an array of strings
- The string(s) must end with a number (and optionally .gz)

Example of **incorrect** code for this rule:

```json
{
  "man": ["./man/doc.md"]
}
```

Example of **correct** code for this rule:

```json
{
  "man": ["./man/doc.1", "./man/doc.2"]
}
```

```json
{
  "man": "./man/doc.1"
}
```
