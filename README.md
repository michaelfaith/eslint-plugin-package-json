<h1 align="center">eslint-plugin-package-json</h1>

<p align="center">Rules for consistent, readable, and valid package.json files. 🗂️</p>

<p align="center">
	<a href="#contributors" target="_blank">
<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<img alt="All Contributors: 22 👪" src="https://img.shields.io/badge/all_contributors-22_👪-21bb42.svg" />
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->
</a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/eslint-plugin-package-json" target="_blank"><img alt="Codecov Test Coverage" src="https://codecov.io/gh/JoshuaKGoldberg/eslint-plugin-package-json/branch/main/graph/badge.svg"/></a>
	<a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="Contributor Covenant" src="https://img.shields.io/badge/code_of_conduct-enforced-21bb42" /></a>
	<a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/blob/main/LICENSE.md" target="_blank"><img alt="License: MIT" src="https://img.shields.io/github/license/JoshuaKGoldberg/eslint-plugin-package-json?color=21bb42"></a>
	<img alt="Style: Prettier" src="https://img.shields.io/badge/style-prettier-21bb42.svg" />
	<a href="https://www.npmjs.com/package/eslint-plugin-package-json"><img alt="npm package version" src="https://img.shields.io/npm/v/eslint-plugin-package-json?color=21bb42" /></a>
</p>

## Installation

This package requires [ESLint](http://eslint.org) >=8:

```shell
npm install eslint eslint-plugin-package-json --save-dev
```

## Usage

### Flat Config

This plugin's recommended configuration enables its rules on `**/package.json` files, parsing them with [`jsonc-eslint-parser`](https://github.com/ota-meshi/jsonc-eslint-parser).

In your ESLint configuration file:

```ts
import packageJson from "eslint-plugin-package-json/configs/recommended";

export default [
	// your other ESLint configurations
	packageJson,
];
```

If you want to override the recommended rules:

```ts
import packageJson from "eslint-plugin-package-json/configs/recommended";

export default [
	// your other ESLint configurations
	{
		...packageJson,
		rules: {
			...packageJson.rules,
			"package-json/valid-package-definition": "off",
		},
	},
];
```

See [ESLint's _Configuration Files_ guide](https://eslint.org/docs/latest/use/configure/configuration-files-new) for details on how to customize your rules and other config settings.

### Legacy Config

Usage with ESLint's legacy ("eslintrc") format requires also installing [`jsonc-eslint-parser`](https://github.com/ota-meshi/jsonc-eslint-parser):

```shell
npm install jsonc-eslint-parser --save-dev
```

Add an override to your ESLint configuration file that specifies `jsonc-eslint-parser`, this plugin, and its recommended rules for your `package.json` file:

```js
module.exports = {
	overrides: [
		{
			extends: ["plugin:package-json/recommended"],
			files: ["package.json"],
			parser: "jsonc-eslint-parser",
			plugins: ["package-json"],
		},
	],
};
```

You may also want to individually configure rules.
See [ESLint's _Configure Rules_ guide](https://eslint.org/docs/latest/use/configure/rules) for details on how to customize your rules.

```js
module.exports = {
	overrides: [
		{
			extends: ["plugin:package-json/recommended"],
			files: ["package.json"],
			parser: "jsonc-eslint-parser",
			plugins: ["package-json"],
			rules: {
				"package-json/valid-package-definition": "error",
			},
		},
	],
};
```

### Usage Alongside Prettier

**[`prettier-plugin-packagejson`](https://github.com/matzkoh/prettier-plugin-packagejson)** is a [Prettier plugin](https://prettier.io/docs/en/plugins) that enforces the same `package.json` keys ordering as the [`order-properties`](docs/rules/order-properties.md) and [sort-collections](docs/rules/sort-collections.md) rules with default options.
We recommend using both the Prettier plugin and `eslint-plugin-package-json`'s recommended configuration.
The default settings don't conflict, and Prettier plugins can quickly fix up ordering in your editor on save and/or as a Git hook.

## Supported Rules

<!-- prettier-ignore-start -->
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
❌ Deprecated.

| Name                                                                   | Description                                                                                       | 💼 | 🔧 | 💡 | ❌  |
| :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :- | :- | :- | :- |
| [no-redundant-files](docs/rules/no-redundant-files.md)                 | Prevents adding unnecessary / redundant files.                                                    |    |    | 💡 |    |
| [order-properties](docs/rules/order-properties.md)                     | Package properties must be declared in standard order                                             | ✅  | 🔧 |    |    |
| [repository-shorthand](docs/rules/repository-shorthand.md)             | Enforce either object or shorthand declaration for repository.                                    | ✅  | 🔧 |    |    |
| [sort-collections](docs/rules/sort-collections.md)                     | Dependencies, scripts, and configuration values must be declared in alphabetical order.           | ✅  | 🔧 |    |    |
| [unique-dependencies](docs/rules/unique-dependencies.md)               | Checks a dependency isn't specified more than once (i.e. in `dependencies` and `devDependencies`) | ✅  |    | 💡 |    |
| [valid-local-dependency](docs/rules/valid-local-dependency.md)         | Checks existence of local dependencies in the package.json                                        | ✅  |    |    |    |
| [valid-name](docs/rules/valid-name.md)                                 | Enforce that package names are valid npm package names                                            | ✅  |    |    |    |
| [valid-package-def](docs/rules/valid-package-def.md)                   | Enforce that package.json has all properties required by the npm spec                             |    |    |    | ❌  |
| [valid-package-definition](docs/rules/valid-package-definition.md)     | Enforce that package.json has all properties required by the npm spec                             | ✅  |    |    |    |
| [valid-repository-directory](docs/rules/valid-repository-directory.md) | Enforce that if repository directory is specified, it matches the path to the package.json file   | ✅  |    | 💡 |    |
| [valid-version](docs/rules/valid-version.md)                           | Enforce that package versions are valid semver specifiers                                         | ✅  |    |    |    |

<!-- end auto-generated rules list -->
<!-- prettier-ignore-end -->

These rules only run on `package.json` files; they will ignore all other files being linted.
They can lint `package.json` files at project root and in any subfolder of the project, making this plugin great for monorepos.

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 💖

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://alan.norbauer.com"><img src="https://avatars.githubusercontent.com/u/1009?v=4?s=100" width="100px;" alt="Alan"/><br /><sub><b>Alan</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Aaltano" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=altano" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AndreasLindbergPAF"><img src="https://avatars.githubusercontent.com/u/59874563?v=4?s=100" width="100px;" alt="Andreas Lindberg"/><br /><sub><b>Andreas Lindberg</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Aandreaslindbergpaf" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://technotes.khitrenovich.com/"><img src="https://avatars.githubusercontent.com/u/3424762?v=4?s=100" width="100px;" alt="Anton Khitrenovich"/><br /><sub><b>Anton Khitrenovich</b></sub></a><br /><a href="#ideas-khitrenovich" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://azat.io"><img src="https://avatars.githubusercontent.com/u/5698350?v=4?s=100" width="100px;" alt="Azat S."/><br /><sub><b>Azat S.</b></sub></a><br /><a href="#ideas-azat-io" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=azat-io" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://davidlj95.com"><img src="https://avatars.githubusercontent.com/u/8050648?v=4?s=100" width="100px;" alt="David LJ"/><br /><sub><b>David LJ</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=davidlj95" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://heggria.site"><img src="https://avatars.githubusercontent.com/u/34475327?v=4?s=100" width="100px;" alt="Heggria"/><br /><sub><b>Heggria</b></sub></a><br /><a href="#ideas-heggria" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Zamiell"><img src="https://avatars.githubusercontent.com/u/5511220?v=4?s=100" width="100px;" alt="James"/><br /><sub><b>James</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=Zamiell" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/zetlen"><img src="https://avatars.githubusercontent.com/u/1643758?v=4?s=100" width="100px;" alt="James Zetlen"/><br /><sub><b>James Zetlen</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=zetlen" title="Code">💻</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Azetlen" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=zetlen" title="Documentation">📖</a> <a href="#infra-zetlen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-zetlen" title="Maintenance">🚧</a> <a href="#tool-zetlen" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://piranna.github.io/"><img src="https://avatars.githubusercontent.com/u/532414?v=4?s=100" width="100px;" alt="Jesús Leganés-Combarro"/><br /><sub><b>Jesús Leganés-Combarro</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=piranna" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kendallgassner"><img src="https://avatars.githubusercontent.com/u/15275462?v=4?s=100" width="100px;" alt="Kendall Gassner"/><br /><sub><b>Kendall Gassner</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=kendallgassner" title="Code">💻</a> <a href="#maintenance-kendallgassner" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/KristjanESPERANTO"><img src="https://avatars.githubusercontent.com/u/35647502?v=4?s=100" width="100px;" alt="Kristjan ESPERANTO"/><br /><sub><b>Kristjan ESPERANTO</b></sub></a><br /><a href="#ideas-kristjanesperanto" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Akristjanesperanto" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=kristjanesperanto" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lo1tuma"><img src="https://avatars.githubusercontent.com/u/169170?v=4?s=100" width="100px;" alt="Mathias Schreck"/><br /><sub><b>Mathias Schreck</b></sub></a><br /><a href="#ideas-lo1tuma" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Cellule"><img src="https://avatars.githubusercontent.com/u/4157103?v=4?s=100" width="100px;" alt="Michael "Mike" Ferris"/><br /><sub><b>Michael "Mike" Ferris</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=cellule" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nschonni"><img src="https://avatars.githubusercontent.com/u/1297909?v=4?s=100" width="100px;" alt="Nick Schonning"/><br /><sub><b>Nick Schonning</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=nschonni" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rakleed"><img src="https://avatars.githubusercontent.com/u/19418601?v=4?s=100" width="100px;" alt="Pavel"/><br /><sub><b>Pavel</b></sub></a><br /><a href="#ideas-rakleed" title="Ideas, Planning, & Feedback">🤔</a> <a href="#tool-rakleed" title="Tools">🔧</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=rakleed" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://sasial.dev"><img src="https://avatars.githubusercontent.com/u/44125644?v=4?s=100" width="100px;" alt="Sasial"/><br /><sub><b>Sasial</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=sasial-dev" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sirugh"><img src="https://avatars.githubusercontent.com/u/1278869?v=4?s=100" width="100px;" alt="Stephen"/><br /><sub><b>Stephen</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=sirugh" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://hyoban.cc"><img src="https://avatars.githubusercontent.com/u/38493346?v=4?s=100" width="100px;" alt="Stephen Zhou"/><br /><sub><b>Stephen Zhou</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Ahyoban" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=hyoban" title="Code">💻</a> <a href="#ideas-hyoban" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=hyoban" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ota-meshi.github.io/"><img src="https://avatars.githubusercontent.com/u/16508807?v=4?s=100" width="100px;" alt="Yosuke Ota"/><br /><sub><b>Yosuke Ota</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Aota-meshi" title="Bug reports">🐛</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=ota-meshi" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/b3rnhard"><img src="https://avatars.githubusercontent.com/u/10774404?v=4?s=100" width="100px;" alt="b3rnhard"/><br /><sub><b>b3rnhard</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/issues?q=author%3Ab3rnhard" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/michaelfaith"><img src="https://avatars.githubusercontent.com/u/8071845?v=4?s=100" width="100px;" alt="michael faith"/><br /><sub><b>michael faith</b></sub></a><br /><a href="#infra-michaelfaith" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/JoshuaKGoldberg/eslint-plugin-package-json/commits?author=michaelfaith" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

## Appreciation

Many thanks to [@zetlen](https://github.com/zetlen) for creating the initial version and core infrastructure of this package! 💖

> 💙 This package was templated with [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
