---
title: valid-contributors
description: Enforce that the `contributors` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `contributors` property:

- It must be an array of objects.
- Each object should have at least a `name`, and optionally `email` and `url`.
- `email` and `url`, if present, should be valid email and url formats.

Example of **incorrect** code for this rule:

```json
{
  "contributors": "Trent Reznor"
}
```

Example of **correct** code for this rule:

```json
{
  "contributors": [
    {
      "name": "Trent Reznor",
      "email": "treznor@nin.com",
      "url": "https://nin.com"
    }
  ]
}
```
