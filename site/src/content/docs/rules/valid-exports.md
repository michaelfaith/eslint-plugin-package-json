---
title: valid-exports
description: Enforce that the `exports` property is valid.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `exports` property is a validated according the following criteria:

- It should be of type `string` or `object`.
- If it's a `string`, it should be a path to an entry point.
- If it's an export condition object, its properties should have values that are either a path to an entry point, or another exports condition object.

Example of **incorrect** code for this rule:

```json
{
  "exports": {
    "import": true
  }
}
```

Example of **correct** code for this rule:

```json
{
  "exports": "./index.js"
}
```

```json
{
  "exports": {
    ".": "./index.js",
    "./secondary": "./secondary.js"
  }
}
```

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./esm/index.d.mts",
        "default": "./esm/index.mjs"
      },
      "require": {
        "types": "./cjs/index.d.cts",
        "default": "./cjs/index.cjs"
      }
    }
  }
}
```
