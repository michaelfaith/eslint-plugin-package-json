---
title: valid-package-definition
description: Enforce that package.json has all properties required by the npm spec
---

❌ This rule is deprecated.

<!-- end auto-generated rule header -->

npm issues warnings after install if the `package.json` has a missing or invalid required property.
This rule uses [`package-json-validator`][pjv] to validate all `package.json` files against the [npm specification][npm-spec], and add any violations to lint warnings.

## Rule Details

This rule aims to ensure that `package.json` complies with specifications.

Examples of **incorrect** code for this rule:

```json
{
  "author": "",
  "description": "",
  "keywords": [],
  "license": "ISC",
  "main": "index.js",
  "name": "noncompliant-version",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "version": "1.X.0"
}
```

Examples of **correct** code for this rule:

```json
{
  "author": "",
  "description": "",
  "keywords": [],
  "license": "ISC",
  "main": "index.js",
  "name": "compliant-version",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "version": "1.0.0"
}
```

## Options

### `ignoreProperties`

Pass an array of top-level package properties to ignore.
When provided, any errors related to the properties won't cause the rule to report a violation.
This can be useful if you're using any of the more granular `valid-*` rules alongside this one.
That way you're not double-reporting violations.

Example of excluding the bin property:

```json
{
  "package-json/valid-bin": "error",
  "package-json/validate-package-definition": [
    "error",
    { "ignoreProperties": ["bin"] }
  ]
}
```

For now, the `recommended` config sets `ignoreProperties` to ignore those that are covered by the newer, more granular `valid-*` rules.
Once all `valid-*` rules are implemented, `valid-package-definition` will be removed from `recommended`.
See [#850 💬 Discussion: Which require- and valid- rules should be in the recommended config?](https://github.com/michaelfaith/eslint-plugin-package-json/issues/850) for the list of rules that will be added.

## When Not to Use It

npm may complain, but it works perfectly with many package files that do not violate spec.
If you don't mind those complaints then you can disable this rule.

[pjv]: https://github.com/gorillamania/package.json-validator
[npm-spec]: https://docs.npmjs.com/files/package.json
