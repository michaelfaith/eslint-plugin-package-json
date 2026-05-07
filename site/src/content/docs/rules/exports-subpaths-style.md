---
title: exports-subpaths-style
description: Enforce consistent format for the exports field (implicit or explicit subpaths).
---

💼 This rule is enabled in the 🎨 `stylistic` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces consistent formatting for the `exports` field in `package.json`, ensuring either explicit subpath notation with `"."` or implicit root-level exports.

## Rule Details

The Node.js `exports` field supports two equivalent formats for defining a single root export:

**Explicit format** (with `"."` subpath):

```json
{
  "exports": {
    ".": "./index.js"
  }
}
```

**Implicit format** (root-level value):

```json
{
  "exports": "./index.js"
}
```

Both formats are functionally equivalent for a single root export, but using one consistently improves readability and maintainability across packages.

> 💡 This rule is especially useful in monorepos where consistency across multiple `package.json` files is important.

### Examples with Default Options (prefer: "explicit")

Examples of **incorrect** code with default options:

```json
{
  "exports": "./index.js"
}
```

```json
{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```

Examples of **correct** code with default options:

```json
{
  "exports": {
    ".": "./index.js"
  }
}
```

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    }
  }
}
```

```json
{
  "exports": {
    ".": "./index.js",
    "./utils": "./utils.js"
  }
}
```

### Examples with prefer: "implicit"

Examples of **incorrect** code with `{ "prefer": "implicit" }`:

```json
{
  "exports": {
    ".": "./index.js"
  }
}
```

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    }
  }
}
```

Examples of **correct** code with `{ "prefer": "implicit" }`:

```json
{
  "exports": "./index.js"
}
```

```json
{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```

```json
{
  "exports": {
    ".": "./index.js",
    "./utils": "./utils.js"
  }
}
```

Note: Multiple subpaths always require the explicit object format and are not transformed by this rule.

## Options

<!-- begin auto-generated rule options list -->

| Name     | Description                                | Type   | Choices                | Default    |
| :------- | :----------------------------------------- | :----- | :--------------------- | :--------- |
| `prefer` | Specifies which exports format to enforce. | String | `implicit`, `explicit` | `explicit` |

<!-- end auto-generated rule options list -->

### prefer

The `prefer` option specifies which format to enforce:

- `"explicit"` _(default)_: Requires the `"."` subpath key for single root exports
- `"implicit"`: Prefers the shorthand format without `"."` for single root exports

```json
{
  "package-json/exports-subpaths-style": [
    "error",
    {
      "prefer": "explicit"
    }
  ]
}
```

Default: `"explicit"`

> ℹ️ The explicit format is generally recommended as it's more consistent when packages later add additional subpaths.

This rule is **autofixable**; run `eslint` with the `--fix` option to automatically convert between formats.

## When Not to Use It

If your project doesn't use the `exports` field or you don't have a preference for consistency in exports formatting, you can disable this rule.

## Further Reading

- [Node.js Package Entry Points](https://nodejs.org/api/packages.html#package-entry-points)
- [Node.js Subpath Exports](https://nodejs.org/api/packages.html#subpath-exports)
