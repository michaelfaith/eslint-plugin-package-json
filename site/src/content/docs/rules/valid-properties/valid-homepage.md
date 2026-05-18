---
title: 'valid-homepage'
description: 'Enforce that the `homepage` property is valid.'
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `homepage` property:

- It must be a `string`
- The value should be a valid URL

Example of **incorrect** code for this rule:

```json
{
  "homepage": "trent@nin.com"
}
```

Example of **correct** code for this rule:

```json
{
  "homepage": "https://nin.com"
}
```
