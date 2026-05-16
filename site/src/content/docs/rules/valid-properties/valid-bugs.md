---
title: valid-bugs
description: Enforce that the `bugs` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `bugs` property:

- it's a `string` URL
- or it's an `object` with either properties `email` or `url` (or both)
- `email` should be a valid email address
- `url` should be a valid URL

Example of **incorrect** code for this rule:

```json
{
  "bugs": "some@email.com"
}
```

Example of **correct** code for this rule:

```json
{
  "bugs": {
    "email": "support@nin.com",
    "url": "https://nin.com/support"
  }
}
```
