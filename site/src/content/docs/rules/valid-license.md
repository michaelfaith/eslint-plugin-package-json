---
title: valid-license
description: Enforce that the `license` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `license` property:

- It must be a `string`
- The value should be a valid SPDX license, "UNLICENSED", or a note referencing a license file (e.g. "SEE LICENSE IN LICENSE.md")

Example of **incorrect** code for this rule:

```json
{
  "license": "GPL3"
}
```

Example of **correct** code for this rule:

```json
{
  "license": "GPL-3.0-only"
}
```

**See also:** [SPDX Documentation](https://spdx.org/licenses/)
