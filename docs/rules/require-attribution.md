# require-attribution

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This ensures that proper attribution is included in a package, requiring that either `author` or `contributors` is defined, and that if `contributors` is present, it should include at least one contributor.

## Rule Details

When publishing a package, it's helpful to include some amount of attribution.
The npm supports two ways of defining attribution in a `package.json`:

- `author`: this is either a string with name, email, and url combined, or an object with `name`, `email`, and `url`.
  This is generally the original creator of the package, or sole maintainer in smaller projects.
- `contributors`: a list of all collaborators contributing to the project.
  Each item in the array has the same `name`, `email`, and `url` properties as `author` has.

### Examples with Default Options (preferContributorsOnly: false)

Examples of **incorrect** code for this rule with default options:

```json
{
  "name": "nin"
}
```

```json
{
  "author": "Trent Reznor <treznor@nin.com> (https://nin.com)",
  "contributors": []
}
```

Examples of **correct** code for this rule with default options:

```json
{
  "author": "Trent Reznor <treznor@nin.com> (https://nin.com)"
}
```

```json
{
  "author": {
    "name": "Trent Reznor",
    "email": "treznor@nin.com",
    "url": "https://nin.com"
  }
}
```

```json
{
  "contributors": [
    {
      "name": "Trent Reznor",
      "email": "treznor@nin.com",
      "url": "https://nin.com"
    },
    {
      "name": "Atticus Ross",
      "email": "atticus@nin.com",
      "url": "https://nin.com"
    }
  ]
}
```

```json
{
  "author": {
    "name": "Trent Reznor",
    "email": "treznor@nin.com",
    "url": "https://nin.com"
  },
  "contributors": [
    {
      "name": "Trent Reznor",
      "email": "treznor@nin.com",
      "url": "https://nin.com"
    },
    {
      "name": "Atticus Ross",
      "email": "atticus@nin.com",
      "url": "https://nin.com"
    }
  ]
}
```

### Examples with preferContributorsOnly: true

Examples of **incorrect** code for this rule with default options:

```json
{
  "name": "nin"
}
```

```json
{
  "author": "Trent Reznor <treznor@nin.com> (https://nin.com)",
  "contributors": []
}
```

```json
{
  "author": "Trent Reznor <treznor@nin.com> (https://nin.com)"
}
```

```json
{
  "author": {
    "name": "Trent Reznor",
    "email": "treznor@nin.com",
    "url": "https://nin.com"
  }
}
```

```json
{
  "author": {
    "name": "Trent Reznor",
    "email": "treznor@nin.com",
    "url": "https://nin.com"
  },
  "contributors": [
    {
      "name": "Trent Reznor",
      "email": "treznor@nin.com",
      "url": "https://nin.com"
    },
    {
      "name": "Atticus Ross",
      "email": "atticus@nin.com",
      "url": "https://nin.com"
    }
  ]
}
```

Examples of **correct** code for this rule with default options:

```json
{
  "contributors": [
    {
      "name": "Trent Reznor",
      "email": "treznor@nin.com",
      "url": "https://nin.com"
    },
    {
      "name": "Atticus Ross",
      "email": "atticus@nin.com",
      "url": "https://nin.com"
    }
  ]
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name                     | Description                                                               | Type    | Default |
| :----------------------- | :------------------------------------------------------------------------ | :------ | :------ |
| `ignorePrivate`          | Skip attribution requirements for packages with `"private": true`.        | Boolean | `true`  |
| `preferContributorsOnly` | Require that only `contributors` is present, and `author` is not defined. | Boolean | `false` |

<!-- end auto-generated rule options list -->

### ignorePrivate

When enabled, `ignorePrivate` skips all attribution checks for packages that have `"private": true` set.
This is useful for internal packages that won't be published to npm.

```json
{
  "package-json/require-attribution": [
    "error",
    {
      "ignorePrivate": true
    }
  ]
}
```

### preferContributorsOnly

When enabled, `preferContributorsOnly` requires that only `contributors` may be defined for attribution, and will report if `author` is also present.

```json
{
  "package-json/require-attribution": [
    "error",
    {
      "preferContributorsOnly": true
    }
  ]
}
```

## When Not to Use It

If your package is not going to be published, and attribution is not important, then this rule can safely be disabled.
