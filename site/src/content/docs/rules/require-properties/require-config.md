---
title: 'require-config'
description: 'Requires the `config` property to be present.'
---

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"config"` property in a package.json, and reports a violation if it doesn't exist.

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
  "config": { "port": "8080" }
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
  "package-json/require-config": [
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
  "config": { "port": "8080" }
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
