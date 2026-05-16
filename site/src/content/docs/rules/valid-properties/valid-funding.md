---
title: valid-funding
description: Enforce that the `funding` property is valid.
---

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `funding` property is a validated according the following criteria:

- The value is an object, a string, or an array of objects and strings
- If it's an object, it should have properties `type` and `url`, and `url` should be a valid URL
- If it's a string, it should be a URL.

Example of **incorrect** code for this rule:

```json
{
  "funding": {
    "email": "some@mail.com",
    "type": "patreon"
  }
}
```

Examples of **correct** code for this rule:

```json
{
  "funding": {
    "type": "patreon",
    "url": "https://patreon.com/treznor"
  }
}
```

```json
{
  "funding": "http://npmjs.com/donate"
}
```

```json
{
  "funding": [
    {
      "type": "individual",
      "url": "http://npmjs.com/donate"
    },
    "http://npmjs.com/donate-also",
    {
      "type": "patreon",
      "url": "https://patreon.com/treznor"
    }
  ]
}
```
