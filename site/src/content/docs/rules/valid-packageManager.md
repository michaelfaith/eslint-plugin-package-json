---
title: valid-packageManager
description: Enforce that the `packageManager` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `packageManager` property is a validated according the following criteria:

- It should have a string value
- It should be in the form `"packageManager@version"`
- The `packageManager` portion should be one of `npm`, `pnpm`, `yarn`, `bun`, or `deno`
- The `version` portion should be a full semver version number, optionally followed by a sha hash for that version

Example of **incorrect** code for this rule:

```json
{
  "packageManager": "pnpm@>=10"
}
```

Examples of **correct** code for this rule:

```json
{
  "packageManager": "pnpm@10.3.0"
}
```

```json
{
  "packageManager": "pnpm@10.3.0+sha224.953c8233f7a92884eee2de69a1b92d1f2ec1655e66d08071ba9a02fa"
}
```
