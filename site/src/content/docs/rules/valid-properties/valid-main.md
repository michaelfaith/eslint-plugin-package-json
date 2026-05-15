---
title: valid-main
description: Enforce that the `main` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule checks that the `main` property is a non-empty string.

Example of **incorrect** code for this rule:

```json
{
  "main": ["index.js", "secondary.js"]
}
```

Example of **correct** code for this rule:

```json
{
  "main": "index.js"
}
```
