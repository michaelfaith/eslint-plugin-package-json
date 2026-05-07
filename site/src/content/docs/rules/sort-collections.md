---
title: sort-collections
description: Selected collections must be in a consistent order (lexicographical for most; lifecycle-aware for scripts).
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Whenever npm changes package dependencies through `npm install`, it sorts (lexicographically) all dependencies in the `package.json` file.
However, developers will manually update `package.json` and accidentally leave dependencies out of order.
Doing so leads to "noise" in commits when a later change re-sorts the packages.

For most collections (`dependencies`, `peerDependencies`, `exports` entries, etc.) this rule enforces a simple ascending lexicographical ordering (based on raw string keys).

`scripts` are an exception: they use a lifecycle‑aware ordering, which groups `pre<name>` / `<name>` / `post<name>` together (even if the middle one is missing).
See [Scripts Lifecycle Ordering](#scripts-lifecycle-ordering) for more details and examples.

This rule therefore aims to keep the configured collections sorted deterministically and to colocate lifecycle hook scripts for readability.

## Rule Details

The following patterns are considered errors:

```json
{
  "scripts": {
    "lint": "eslint .",
    "test": "jest",
    "start": "node server.js"
  }
}
```

In the above `scripts` collection, `test` should be moved to the last line, after `lint` and `start`.

```json
{
  "devDependencies": {
    "eslint": "^5.8.0",
    "lodash": "^4.17.11",
    "lodash.debounce": "4.17.11",
    "mocha": "^5.2.0",
    "nyc": "^13.1.0",
    "prettier": "^1.14.3"
  }
}
```

In the above `devDependencies` collection, manual editing has put the dependencies out of lexicographical order.

The following patterns are **not** considered errors:

```json
{
  "scripts": {
    "lint": "eslint .",
    "start": "node server.js",
    "test": "jest"
  }
}
```

```json
{
  "devDependencies": {
    "eslint": "^5.8.0",
    "lodash": "^4.17.11",
    "lodash.debounce": "4.17.11",
    "mocha": "^5.2.0",
    "nyc": "^13.1.0",
    "prettier": "^1.14.3"
  }
}
```

Note that in lexicographical ordering, `lodash` comes before `lodash.debounce`.

### Scripts Lifecycle Ordering

Summary:

- Lifecycle scripts form a group: `pre<name>` → `<name>` → `post<name>`.
- The group is positioned where `<name>` would appear in lexicographical order, even if `<name>` itself is missing.
- Groups with different base names (`build`, `install`, `test`, ...) are ordered relative to each other by their base name.
- All other script names (including namespaced ones like `lint:fix`, `watch:dist`) then follow the `sort-package-json` ordering after lifecycle grouping.

This matches the behavior of [`prettier-plugin-packagejson`](https://github.com/matzkoh/prettier-plugin-packagejson).

Example (missing main script (`install`); group still kept together):

```json
{
  "scripts": {
    "preinstall": "echo pre",
    "postinstall": "echo post",
    "prepare": "echo prepare"
  }
}
```

Incorrect vs. correct ordering of a complete lifecycle group:

Incorrect:

```json
{
  "scripts": {
    "build": "echo build",
    "postbuild": "echo post",
    "prebuild": "echo pre"
  }
}
```

Correct:

```json
{
  "scripts": {
    "prebuild": "echo pre",
    "build": "echo build",
    "postbuild": "echo post"
  }
}
```

## Options

Pass an array of package properties to lint sorting on those collections.
To specify a nested property, use dot notation.
All of their values must be objects.

Example of only sorting `devDependencies` and `pnpm.patchedDependencies`:

```json
{
  "package-json/sort-collections": [
    "error",
    ["devDependencies", "pnpm.patchedDependencies"]
  ]
}
```

Defaults:

```json
[
  "config",
  "dependencies",
  "devDependencies",
  "exports",
  "optionalDependencies",
  "overrides",
  "peerDependencies",
  "peerDependenciesMeta",
  "scripts"
]
```

This rule is **autofixable**; run `eslint` with the `--fix` option to sort any incorrect collections in place.

## Error Messages

This rule provides different error messages depending on the type of collection being sorted:

- **For `scripts`**: _"Entries in 'scripts' are not in lexicographical order and grouped by lifecycles"_
- **For other collections**: _"Entries in '{{ key }}' are not in lexicographical order"_

This distinction helps clarify the different sorting behaviors between lifecycle-aware scripts and simple lexicographical ordering for other collections.
