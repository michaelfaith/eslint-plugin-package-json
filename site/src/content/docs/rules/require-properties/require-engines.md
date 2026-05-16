---
title: require-engines
description: Requires the `engines` property to be present.
---

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"engines"` property in a package.json, and reports a violation if it doesn't exist.

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
  "engines": {
    "node": ">=18"
  }
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name            | Description                                                                                 | Type    | Default |
| :-------------- | :------------------------------------------------------------------------------------------ | :------ | :------ |
| `ignorePrivate` | Determines if this rule should be enforced when the package's `private` property is `true`. | Boolean | `false` |

<!-- end auto-generated rule options list -->

```json
{
  "package-json/require-engines": [
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
  "engines": {
    "node": ">=18"
  }
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
