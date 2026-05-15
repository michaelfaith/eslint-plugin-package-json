---
title: require-devEngines
description: Requires the `devEngines` property to be present.
---

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"devEngines"` property in a package.json, and reports a violation if it doesn't exist.

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
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^20.19.0 || >=22.12.0",
      "onFail": "download"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "^10.0.0",
      "onFail": "error"
    }
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
  "package-json/require-devEngines": [
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
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^20.19.0 || >=22.12.0",
      "onFail": "download"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "^10.0.0",
      "onFail": "error"
    }
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
