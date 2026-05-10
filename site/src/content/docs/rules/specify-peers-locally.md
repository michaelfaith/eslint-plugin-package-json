---
title: specify-peers-locally
description: Requires that all peer dependencies are also declared as dev dependencies
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

When you have a dependency declared in a package's `peerDependencies`, it's meant to be an expression of compatibility with that dependency.
It also establishes a contract with consumers of your package that they should install a version of that dependency within the range that you've declared.
Since you also need to use that package locally as part of development, it's generally a best practice to declare it in the package's `devDependencies` as well, so that it's installed and available for use.

## Rule Details

This rule requires that all dependencies declared in a package's `peerDependencies` are also declared in the package's `devDependencies`.

Example of **incorrect** code for this rule:

```json
{
  "peerDependencies": {
    "eslint": ">=8.0.0"
  }
}
```

Example of **correct** code for this rule:

```json
{
  "peerDependencies": {
    "eslint": ">=8.0.0"
  },
  "devDependencies": {
    "eslint": "9.39.1"
  }
}
```
