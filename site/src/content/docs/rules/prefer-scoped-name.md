---
title: 'prefer-scoped-name'
description: 'Enforce that `name` uses a specific scope or set of scopes.'
---

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces that the package `name` uses a scope (ex. `@scope/name`).

## Rule Details

This rule is not included in any default configurations because it requires custom configuration based on your project.
Configure either a single preferred scope, multiple allowed scopes, or combine them if you have one preferred scope but
allow for others without causing a lint error.

## Options

<!-- begin auto-generated rule options list -->

| Name        | Description    | Type   |
| :---------- | :------------- | :----- |
| `allowed`   | Allowed scopes | String or String[] |
| `preferred` | Prefered scope | String |


### `allowed`

Allows a single scope or list of scopes in named packages. This option will never be used in a fix, and will only error
if a scope is used that is not in the allowed list. With only this option, un-scoped names are allowed.

```json
{
  "package-json/prefer-scoped-name": [
    "error",
    {
      "allowed": "@foo"
    }
  ]
}
```

```json
{
  "package-json/prefer-scoped-name": [
    "error",
    {
      "allowed": [ "@foo", "@bar" ]
    }
  ]
}
```

### `preferred`

Enforce a single preferred scope for named packages. This will error if a named package has no scope or if
the scope does not match the preferred value.

```json
{
  "package-json/prefer-scoped-name": [
    "error",
    {
      "preferred": "@foo"
    }
  ]
}
```

### `preferred` and `allowed` together

When used together, errors will only be raised when there is no scope or the scope does not match any of the values.
Fixes will only apply to the dis-allowed scopes and will be changed to the value of `preferred`.

```json
{
  "package-json/prefer-scoped-name": [
    "error",
    {
      "preferred": "@foo",
      "allowed": [ "@bar", "@baz" ]
    }
  ]
}
```

<!-- end auto-generated rule options list -->
