---
title: require-module
description: Requires the `module` property to be present.
---

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"module"` property in a package.json, and reports a violation if it doesn't exist.

Example of **incorrect** code for this rule:

```json
{
  "name": "my-package",
  "version": "13.0.0"
}
```

Example of **correct** code for this rule:

```json
{
  "name": "my-package",
  "version": "13.0.0",
  "module": "./index.js"
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
  "package-json/require-module": [
    "error",
    {
      "ignorePrivate": true
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
  "module": "./index.js"
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
