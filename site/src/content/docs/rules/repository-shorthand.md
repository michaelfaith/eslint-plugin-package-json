---
title: repository-shorthand
description: Enforce either object or shorthand declaration for repository.
---

💼 This rule is enabled in the following configs: ✔️ `legacy-recommended`, ✅ `recommended`, 📦 `recommended-publishable`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces that `repository` entries in a `package.json` use either object _(default)_ or shorthand notation to refer to GitHub repositories when possible.

## Rule Details

npm previously allowed a "shorthand" form like `"michaelfaith/eslint-plugin-package-json"` to specifying a full URL to a GitHub repository like `"https://github.com/michaelfaith/eslint-plugin-package-json"`.
However, current versions of npm now normalize that form to the object longhand with `type` and `url` and warn against the shorthand.

Examples of **incorrect** code for this rule with the default options:

```json
{
  "repository": "michaelfaith/eslint-plugin-package-json"
}
```

Examples of **correct** code for this rule with the default options:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/michaelfaith/eslint-plugin-package-json"
  }
}
```

## Options

```json
{
  "package-json/order-properties": [
    "error",
    {
      "form": "shorthand"
    }
  ]
}
```

### Form

The `form` property specifies whether to use:

- `"object"` _(default)_: an object with `"type"` and `"url"`
- `"shorthand"`: the shorthand string equivalent.

The `object` form is generally recommended as that's what `npm publish` prefers.

> If and when npm drops support for the `"shorthand"` form, this rule will likely remove its options.

## Further Reading

- [michaelfaith/eslint-plugin-package-json#223 🐛 Bug: prefer-repository-shorthand in conflict with npm publish requirements](https://github.com/michaelfaith/eslint-plugin-package-json/issues/223)
- [npm/cli#7299 [DOCS] package.json#repository should clarify normalization steps and future plans.](https://github.com/npm/cli/issues/7299)
