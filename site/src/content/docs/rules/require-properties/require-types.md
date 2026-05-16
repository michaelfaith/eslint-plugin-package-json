---
title: require-types
description: Requires the `types` property to be present.
---

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"types"` property in a package.json, and reports a violation if it doesn't exist.

Example of **incorrect** code for this rule:

```json
{
  "name": "Thee Silver Mt. Zion",
  "version": "13.0.0"
}
```

Example of **correct** code for this rule:

```json
{
  "name": "Thee Silver Mt. Zion",
  "version": "13.0.0",
  "types": "./index.d.ts"
}
```

See [TypeScript Handbook > Publishing](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) for more information on publishing package types.

## Options

<!-- begin auto-generated rule options list -->

| Name            | Description                                                                                 | Type    | Default |
| :-------------- | :------------------------------------------------------------------------------------------ | :------ | :------ |
| `ignorePrivate` | Determines if this rule should be enforced when the package's `private` property is `true`. | Boolean | `false` |

<!-- end auto-generated rule options list -->

```json
{
  "package-json/require-types": [
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
  "types": "./index.d.ts"
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
