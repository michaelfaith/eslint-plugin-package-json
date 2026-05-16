---
title: require-sideEffects
description: Requires the `sideEffects` property to be present.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule checks for the existence of the `sideEffects` property in a package.json, and reports a violation if it doesn't exist.

Example of **incorrect** code for this rule:

```json
{
  "name": "thee-silver-mt-zion",
  "version": "13.0.0"
}
```

Example of **correct** code for this rule:

```json
{
  "name": "thee-silver-mt-zion",
  "version": "13.0.0",
  "sideEffects": false
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name            | Description                                                                                 | Type    | Default |
| :-------------- | :------------------------------------------------------------------------------------------ | :------ | :------ |
| `ignorePrivate` | Determines if this rule should be enforced when the package's `private` property is `true`. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

```json
{
  "package-json/require-sideEffects": [
    "error",
    {
      "ignorePrivate": false
    }
  ]
}
```

Example of **incorrect** code for this rule with the `{ "ignorePrivate": false }` option:

```json
{
  "private": true
}
```

Example of **correct** code for this rule with the `{ "ignorePrivate": false }` option:

```json
{
  "private": true,
  "sideEffects": false
}
```

Example of **incorrect** code for this rule with the `{ "ignorePrivate": true }` option:

```json
{
  "private": false
}
```

```json
{}
```

Example of **correct** code for this rule with the `{ "ignorePrivate": true }` option:

```json
{
  "private": true
}
```
