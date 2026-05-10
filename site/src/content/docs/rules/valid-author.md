---
title: valid-author
description: Enforce that the `author` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

npm requires that the `author` field in `package.json` follows certain specifications if it is present.

This rule uses [`package-json-validator`][pjv] to validate the `author` field in `package.json` files against the [npm specification][npm-spec].

## Rule Details

This rule aims to ensure that the `author` field complies with npm specifications.

The field can be either a string or an object with specific properties.

Examples of **incorrect** code for this rule:

```json
{
  "author": ""
}
```

```json
{
  "author": null
}
```

```json
{
  "author": "John <invalid>"
}
```

```json
{
  "author": "John (not-url)"
}
```

```json
{
  "author": {}
}
```

```json
{
  "author": { "email": "john@example.com" }
}
```

```json
{
  "author": { "name": "", "email": "john@example.com" }
}
```

```json
{
  "author": { "name": "John", "email": "invalid" }
}
```

```json
{
  "author": { "name": "John", "url": "invalid" }
}
```

Examples of **correct** code for this rule:

```json
{
  "author": "John Doe"
}
```

```json
{
  "author": "John <john@example.com>"
}
```

```json
{
  "author": "John (https://example.com)"
}
```

```json
{
  "author": "John <john@example.com> (https://example.com)"
}
```

```json
{
  "author": { "name": "John" }
}
```

```json
{
  "author": { "name": "John", "email": "john@example.com" }
}
```

```json
{
  "author": { "name": "John", "url": "https://example.com" }
}
```

```json
{
  "author": {
    "name": "John",
    "email": "john@example.com",
    "url": "https://example.com"
  }
}
```

## When Not to Use It

If you don't care about strict compliance with npm's author field specification, or if you don't use this field in your projects, you can disable this rule.

[pjv]: https://github.com/michaelfaith/package-json-validator
[npm-spec]: https://docs.npmjs.com/files/package.json
