---
title: valid-gypfile
description: Enforce that the `gypfile` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule checks that the `gypfile` property is a boolean.

Example of **incorrect** code for this rule:

```json
{
  "gypfile": "false"
}
```

Example of **correct** code for this rule:

```json
{
  "gypfile": false
}
```

**See also:** [npm Documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#gypfile)
