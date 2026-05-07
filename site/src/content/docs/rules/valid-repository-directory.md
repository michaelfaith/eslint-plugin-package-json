---
title: valid-repository-directory
description: Enforce that if repository directory is specified, it matches the path to the package.json file
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

This rule enforces that `"repository"` > `"directory"` points to the right directory for a `package.json`.
If `"directory"` isn't specified, this rule will do nothing.

Example of **incorrect** code for this rule for a `package.json` located at `packages/example/package.json`:

```json
{
  "repository": {
    "directory": "something-else"
  }
}
```

Example of **correct** code for this rule for a `package.json` located at `packages/example/package.json`:

```json
{
  "repository": {
    "directory": "packages/example"
  }
}
```
