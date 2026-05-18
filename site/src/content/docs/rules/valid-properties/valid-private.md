---
title: 'valid-private'
description: 'Enforce that the `private` property is valid.'
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule checks that the `private` property is a boolean.

Example of **incorrect** code for this rule:

```json
{
  "private": "true"
}
```

Example of **correct** code for this rule:

```json
{
  "private": true
}
```
