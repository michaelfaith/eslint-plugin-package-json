---
title: valid-peerDependenciesMeta-relationship
description: Enforces that any dependencies declared in `peerDependenciesMeta` are also defined in the package's `peerDependencies`.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule enforces that every dependency declared inside `peerDependenciesMeta` is also declared in `peerDependencies`.

`peerDependenciesMeta` is meant to provide metadata about peer dependencies.
So entries that do not correspond to an existing `peerDependencies` dependency are considered redundant.

Example of **incorrect** code for this rule:

```json
{
  "peerDependenciesMeta": {
    "some-package": {
      "optional": true
    }
  }
}
```

Examples of **correct** code for this rule:

```json
{
  "peerDependencies": {
    "some-package": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "some-package": {
      "optional": true
    }
  }
}
```

```json
{
  "peerDependencies": {
    "some-package": "^1.0.0"
  }
}
```

## Suggestions

When this rule reports an invalid `peerDependenciesMeta` entry, it provides an editor suggestion to remove that property.
