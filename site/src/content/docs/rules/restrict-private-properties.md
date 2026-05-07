---
title: restrict-private-properties
description: Disallows unnecessary properties in private packages.
---

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule disallows unnecessary properties in private packages that are never published to npm.

## Rule Details

When a package is marked as `"private": true`, it will never be published to npm.
This makes certain properties unnecessary since they only affect how packages are published or consumed from the registry.

By default, this rule flags `files` and `publishConfig` in private packages:

- `files`: Controls which files are included when publishing to npm
- `publishConfig`: Configures how the package is published to npm

The rule will flag all blocked properties and **provides auto-fix for empty values** (empty arrays `[]` or empty objects `{}`).
For non-empty values, the rule provides a suggestion that can be applied in your IDE, allowing you to review and remove them manually if desired.

Examples of **incorrect** code for this rule with default options:

```json
{
  "name": "my-app",
  "private": true,
  "files": ["dist"]
}
```

```json
{
  "name": "my-app",
  "private": true,
  "publishConfig": {
    "access": "public"
  }
}
```

```json
{
  "name": "my-app",
  "private": true,
  "files": []
}
```

Examples of **correct** code for this rule with default options:

```json
{
  "name": "my-app",
  "private": true
}
```

```json
{
  "name": "my-library",
  "files": ["dist"]
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name                | Description                                              | Type     | Default                    |
| :------------------ | :------------------------------------------------------- | :------- | :------------------------- |
| `blockedProperties` | Array of property names to disallow in private packages. | String[] | [`files`, `publishConfig`] |

<!-- end auto-generated rule options list -->

### blockedProperties

You can customize which properties are flagged in private packages.

For example, to also flag `dependencies` in private packages:

```json
{
  "package-json/restrict-private-properties": [
    "error",
    {
      "blockedProperties": ["files", "publishConfig", "dependencies"]
    }
  ]
}
```

This can be useful for private packages that won't be published.

Or to check for different properties entirely:

```json
{
  "package-json/restrict-private-properties": [
    "error",
    {
      "blockedProperties": ["main", "exports"]
    }
  ]
}
```

## When Not to Use It

Disable this rule if you:

- Want to keep these properties as documentation of what would be published
- Plan to make the package public in the future
- Use these properties for tooling that reads them even for private packages

## Further Reading

- [npm package.json `files` field](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files)
- [npm package.json `publishConfig` field](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig)
- [npm package.json `private` field](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#private)
