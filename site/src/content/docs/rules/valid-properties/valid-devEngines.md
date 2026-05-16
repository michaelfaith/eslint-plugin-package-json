---
title: valid-devEngines
description: Enforce that the `devEngines` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule does the following checks on the value of the `devEngines` property:

<!-- prettier-ignore-start -->

- It should be an `object` with any of the following properties
  - `cpu`
  - `libc`
  - `os`
  - `packageManager`
  - `runtime`
- The value of each property should be an object or an Array of objects with the following properties
  - `name` (required): the name of the engine, e.g. "node", "npm", "yarn", "bun"
  - `version` (optional): the version of the engine, which should be a valid semver range
  - `onFail` (optional): should be one of the following values: `warn`, `error`, `ignore` or `download`

<!-- prettier-ignore-end -->

Example of **incorrect** code for this rule:

```json
{
  "devEngines": {
    "node": ">=24.0.0"
  }
}
```

Example of **correct** code for this rule:

```json
{
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
