---
title: unique-dependencies
description: Checks a dependency isn't specified more than once (i.e. in `dependencies` and `devDependencies`)
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule checks that every dependency is just added once to a [`package.json` key specifying dependencies](https://github.com/michaelfaith/eslint-plugin-package-json/blob/main/src/rules/unique-dependencies.ts#L8-L16).

It also checks that any dependencies declared in the `dependencies` group, are not also present in `peerDependencies` or `devDependencies`.

Example of **incorrect** code for this rule:

```json
{
  "dependencies": {
    "foo": "1.0.0",
    "bar": "2.0.0",
    "foo": "1.0.0"
  }
}
```

```json
{
  "dependencies": {
    "foo": "1.0.0"
  },
  "devDependencies": {
    "foo": "1.0.0"
  }
}
```

Example of **correct** code for this rule:

```json
{
  "dependencies": {
    "foo": "1.0.0"
  }
}
```
