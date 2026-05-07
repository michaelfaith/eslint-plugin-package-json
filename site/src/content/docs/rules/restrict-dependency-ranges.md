---
title: restrict-dependency-ranges
description: Restricts the range of dependencies to allow or disallow specific types of ranges.
---

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule allows you to require that specific dependencies use a particular kind of semver range (e.g. `^`).
There are several options for specifying which dependencies a range type restriction should be applied to, including dependency type, package name (or name regex pattern), and version range (e.g. '<1').

```ts
export default [
  {
    "package-json/restrict-dependency-ranges": [
      "error",
      // Require that packages with 0.x.x versions are pinned
      {
        forVersions: "<1",
        rangeType: "pin",
      },
    ],
  },
];
```

If you provide multiple options and a dependency matches more than one of the options, the last option that matches will take precedent for that dependency.
This allows you to define more general rules that apply to all dependencies (or large groups of dependencies), and then define more granular options to apply exceptions or focus on some subset of dependencies.

## Options

`type DependencyType = 'dependencies' | 'devDependencies' | 'optionalDependencies' | 'peerDependencies';`\
`type RangeType = 'caret' | 'pin' | 'tilde';`

| Name                 | Type                     | Required |
| :------------------- | :----------------------- | :------- |
| `forDependencyTypes` | DependencyType[]         |          |
| `forPackages`        | string[]                 |          |
| `forVersions`        | string                   |          |
| `rangeType`          | RangeType \| RangeType[] | Yes      |

You can provide a single options object consisting of the above, or an array of such objects.

### `forDependencyTypes`

You can use this to apply a range type restriction for an entire group of dependencies by which type of dependencies they belong to.

Options are

- dependencies
- devDependencies
- optionalDependencies
- peerDependencies

```ts
export default [
  {
    "package-json/restrict-dependency-ranges": [
      "error",
      // Require that all dev dependencies are pinned
      {
        forDependencyTypes: ["devDependencies"],
        rangeType: "pin",
      },
    ],
  },
];
```

### `forPackages`

This can be the exact name of a package, or a regex pattern used to match a group of packages by name (e.g. `@typescript-eslint/*`).

```ts
export default [
  {
    "package-json/restrict-dependency-ranges": [
      "error",
      // Restrict typescript to tilde ranges
      {
        forPackages: ["typescript"],
        rangeType: "tilde",
      },
    ],
  },
];
```

### `forVersions`

You can use this to apply a restriction to a specific semver range.
For example, a common use case is to pin "unstable" dependencies (packages that have a version in the `0.x.x` range).
You can do this by setting `forVersions` to `'<1'`.

```ts
export default [
  {
    "package-json/restrict-dependency-ranges": [
      "error",
      // Require that all deps should use ^
      {
        rangeType: "caret",
      },
    ],
  },
];
```

### `rangeType`

This is the only required option, and identifies which range type or types you want to apply to packages that match any of the other match options (or all dependencies if no other options are provided).

```ts
export default [
  {
    "package-json/restrict-dependency-ranges": [
      "error",
      // Require that all deps should use ^
      {
        rangeType: "caret",
      },
    ],
  },
];
```

## Example

```ts
export default [
  {
    "package-json/restrict-dependency-ranges": [
      "error",
      [
        // Apply base requirement that all deps should use ^
        {
          rangeType: "caret",
        },

        // Restrict typescript to tilde ranges
        {
          forPackages: ["typescript"],
          rangeType: "tilde",
        },

        // Require that packages with 0.x.x versions are pinned
        {
          forVersions: "<1",
          rangeType: "pin",
        },
      ],
    ],
  },
];
```

Example of **incorrect** code for the above configuration:

```json
{
  "devDependencies": {
    "eslint": "^9.18.0",
    "markdownlint": "^0.37.4",
    "typescript": "^5.8.0"
  }
}
```

Example of **correct** code for the above configuration:

```json
{
  "devDependencies": {
    "eslint": "^9.18.0",
    "markdownlint": "0.37.4",
    "typescript": "~5.8.0"
  }
}
```
