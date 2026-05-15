---
title: require-private
description: Requires the `private` property to be present.
---

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule checks for the existence of the `"private"` property in a package.json, and reports a violation if it doesn't exist.

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
  "private": false
}
```
