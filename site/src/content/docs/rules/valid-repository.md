---
title: valid-repository
description: Enforce that the `repository` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `bin` property:

- It should be of type `object` or `string`.
- If it's an `object`, it should have `type`, `url`, and optionally `directory`.
- `type` and `directory` (if present) should be non-empty strings
- `url` should be a valid repo url
- If it's a `string`, it should be the shorthand repo string from a supported provider.

Example of **incorrect** code for this rule:

```json
{
  "repository": {
    "url": "git+https://github.com/michaelfaith/eslint-plugin-package-json.git"
  }
}
```

Example of **correct** code for this rule:

```json
{
  "repository": "github:michaelfaith/eslint-plugin-package-json"
}
```

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/michaelfaith/eslint-plugin-package-json.git"
  }
}
```
