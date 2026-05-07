---
title: restrict-top-level-properties
description: Disallows specified top-level properties in package.json.
---

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule allows you to disallow specific top-level properties in `package.json`.
This is useful when you want to keep `package.json` minimal and enforce that certain tool configurations live in their own dedicated files.

<!-- prettier-ignore-start -->

```ts
export default [
	{
		"package-json/restrict-top-level-properties": [
			"error",
			{
				ban: [
					{
						message: "Configure pnpm options in pnpm-workspace.yaml.",
						property: "pnpm",
					},
					"prettier",
				],
			},
		],
	},
];
```

<!-- prettier-ignore-end -->

## Options

<!-- prettier-ignore-start -->
<!-- begin auto-generated rule options list -->

| Name       | Description                                                                                                                                     | Type   | Default | Required |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :------ | :------- |
| `ban`      | List of top-level properties to ban. Each entry can be a property name string or an object with a property name and an optional custom message. | Array  | `[]`    |          |
| `message`  | Custom message to append to the error report.                                                                                                   | String |         |          |
| `property` | The top-level property name to ban.                                                                                                             | String |         | Yes      |

<!-- end auto-generated rule options list -->
<!-- prettier-ignore-end -->

### `ban`

An array of entries describing which top-level properties are banned.
Each entry is either:

- A **string** — the property name to ban.
- An **object** `{ property: string; message?: string }` — the property name to ban, with an optional custom message included in the error report.

If the same property is listed multiple times, the last declaration takes precedence.

Examples of **incorrect** code for this rule, given the config above:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "prettier": {
    "semi": false
  }
}
```

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "pnpm": {
    "overrides": {}
  }
}
```

Examples of **correct** code for this rule:

```json
{
  "name": "my-app",
  "version": "1.0.0"
}
```

## Common Tool-Specific Properties

Many tools support configuration inlined directly in `package.json`.
Below is a ready-to-use `ban` list of commonly used tool-specific properties that you may want to move to dedicated config files.

<details>
<summary>Simple list</summary>

```json
[
  "babel",
  "browserslist",
  "commitlint",
  "eslintConfig",
  "jest",
  "lint-staged",
  "pnpm",
  "prettier",
  "release-it",
  "renovate",
  "stylelint",
  "typedoc"
]
```

</details>

<details>
<summary>With custom messages</summary>

```json
[
  {
    "property": "babel",
    "message": "Configure Babel in a dedicated config file."
  },
  {
    "property": "browserslist",
    "message": "Configure Browserslist in a dedicated config file."
  },
  {
    "property": "commitlint",
    "message": "Configure commitlint in a dedicated config file."
  },
  {
    "property": "eslintConfig",
    "message": "Configure ESLint in a dedicated config file."
  },
  {
    "property": "jest",
    "message": "Configure Jest in a dedicated config file."
  },
  {
    "property": "lint-staged",
    "message": "Configure lint-staged in a dedicated config file."
  },
  {
    "property": "pnpm",
    "message": "Configure pnpm in a dedicated config file."
  },
  {
    "property": "prettier",
    "message": "Configure Prettier in a dedicated config file."
  },
  {
    "property": "release-it",
    "message": "Configure release-it in a dedicated config file."
  },
  {
    "property": "renovate",
    "message": "Configure Renovate in a dedicated config file."
  },
  {
    "property": "stylelint",
    "message": "Configure Stylelint in a dedicated config file."
  },
  {
    "property": "typedoc",
    "message": "Configure TypeDoc in a dedicated config file."
  }
]
```

</details>
