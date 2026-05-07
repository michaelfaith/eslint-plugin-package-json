---
title: no-redundant-publishConfig
description: Warns when publishConfig.access is used in unscoped packages.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule warns when `publishConfig.access` is used in unscoped packages, as it has no effect.

## Rule Details

Per [npm documentation](https://docs.npmjs.com/cli/v8/commands/npm-publish), unscoped packages (package names without `@`) are always public and cannot be made private.

Using `publishConfig.access` in these packages is redundant since the field only affects scoped packages.

The rule will:

- Warn when unscoped packages have `publishConfig.access` defined
- Remain silent for scoped packages (`@org/name`) where the field is meaningful

Examples of **incorrect** code for this rule:

```json
{
  "name": "my-package",
  "publishConfig": { "access": "public" }
}
```

```json
{
  "name": "my-package",
  "publishConfig": { "access": "restricted" }
}
```

```json
{
  "name": "my-package",
  "publishConfig": {
    "access": "public",
    "registry": "https://example.com"
  }
}
```

Examples of **correct** code for this rule:

```json
{
  "name": "@myorg/my-package",
  "publishConfig": { "access": "public" }
}
```

```json
{
  "name": "@myorg/my-package",
  "publishConfig": { "access": "restricted" }
}
```

```json
{
  "name": "my-package",
  "publishConfig": {
    "registry": "https://example.com"
  }
}
```

```json
{
  "name": "my-package"
}
```

## When Not to Use It

Disable this rule if you:

- Want to keep the `publishConfig.access` field as documentation even though it has no effect
- Are planning to convert your unscoped package to a scoped package in the future
