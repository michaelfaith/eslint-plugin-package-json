---
title: valid-keywords
description: Enforce that the `keywords` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `keywords` property:

- It must be an array.
- The array should only consist of non-empty strings

Example of **incorrect** code for this rule:

```json
{
  "keywords": "music"
}
```

Example of **correct** code for this rule:

```json
{
  "keywords": ["nin", "A Silver Mt. Zion"]
}
```
