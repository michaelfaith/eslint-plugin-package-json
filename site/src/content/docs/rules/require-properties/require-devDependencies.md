---
title: require-devDependencies
description: Requires the `devDependencies` property to be present.
---

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"devDependencies"` property in a package.json, and reports a violation if it doesn't exist.

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
  "devDependencies": {
    "gybe": "^1.2.3"
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
  "package-json/require-devDependencies": [
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
  "devDependencies": {
    "gybe": "^1.2.3"
  }
}
```

Example of **incorrect** code for this rule with the `{ "ignorePrivate": true }` option:

```json
{
  "private": false
}
```

Example of **correct** code for this rule with the `{ "ignorePrivate": true }` option:

```json
{
  "private": true
}
```
