---
title: Rule List
description: All rules provided by the plugin.
---

Here's a list of all rules that this plugin provides.

<!-- prettier-ignore-start -->
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
📦 Set in the `recommended-publishable` configuration.\
🎨 Set in the `stylistic` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                      | Description                                                                                                                                                                                  | 💼   | 🔧 | 💡 |
| :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--- | :- | :- |
| [bin-name-casing](/rules/bin-name-casing)                                                 | Enforce that names for bin properties are in kebab case.                                                                                                                                     | 🎨   |    | 💡 |
| [exports-subpaths-style](/rules/exports-subpaths-style)                                   | Enforce consistent format for the exports field (implicit or explicit subpaths).                                                                                                             | 🎨   | 🔧 |    |
| [no-empty-fields](/rules/no-empty-fields)                                                 | Reports on unnecessary empty arrays and objects.                                                                                                                                             | ✅ 📦 |    | 💡 |
| [no-redundant-files](/rules/no-redundant-files)                                           | Prevents adding unnecessary / redundant files.                                                                                                                                               | ✅ 📦 |    | 💡 |
| [no-redundant-publishConfig](/rules/no-redundant-publishConfig)                           | Warns when publishConfig.access is used in unscoped packages.                                                                                                                                | ✅ 📦 |    | 💡 |
| [order-properties](/rules/order-properties)                                               | Package properties should be declared in standard order                                                                                                                                      | 🎨   | 🔧 |    |
| [repository-shorthand](/rules/repository-shorthand)                                       | Enforce either object or shorthand declaration for repository.                                                                                                                               | ✅ 📦 | 🔧 |    |
| [require-attribution](/rules/require-attribution)                                         | Ensures that proper attribution is included, requiring that either `author` or `contributors` is defined, and that if `contributors` is present, it should include at least one contributor. | ✅ 📦 |    | 💡 |
| [restrict-dependency-ranges](/rules/restrict-dependency-ranges)                           | Restricts the range of dependencies to allow or disallow specific types of ranges.                                                                                                           |      |    | 💡 |
| [restrict-private-properties](/rules/restrict-private-properties)                         | Disallows unnecessary properties in private packages.                                                                                                                                        |      | 🔧 | 💡 |
| [restrict-top-level-properties](/rules/restrict-top-level-properties)                     | Disallows specified top-level properties in package.json.                                                                                                                                    |      |    | 💡 |
| [scripts-name-casing](/rules/scripts-name-casing)                                         | Enforce that names for `scripts` are in kebab case (optionally separated by colons).                                                                                                         | 🎨   |    | 💡 |
| [sort-collections](/rules/sort-collections)                                               | Selected collections must be in a consistent order (lexicographical for most; lifecycle-aware for scripts).                                                                                  | ✅ 📦 | 🔧 |    |
| [specify-peers-locally](/rules/specify-peers-locally)                                     | Requires that all peer dependencies are also declared as dev dependencies                                                                                                                    | ✅ 📦 |    | 💡 |
| [unique-dependencies](/rules/unique-dependencies)                                         | Checks a dependency isn't specified more than once (i.e. in `dependencies` and `devDependencies`)                                                                                            | ✅ 📦 |    | 💡 |
| [valid-peerDependenciesMeta-relationship](/rules/valid-peerDependenciesMeta-relationship) | Enforces that any dependencies declared in `peerDependenciesMeta` are also defined in the package's `peerDependencies`.                                                                      | ✅ 📦 |    | 💡 |
| [valid-repository-directory](/rules/valid-repository-directory)                           | Enforce that if repository directory is specified, it matches the path to the package.json file                                                                                              | ✅ 📦 |    | 💡 |

## Require Properties

This group of rules allows you to require that the associated top-level property must be present in the `package.json`.

| Name                                                                                   | Description                                                 | 💼   | 🔧 | 💡 |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :--- | :- | :- |
| [require-author](/rules/require-properties/require-author)                             | Requires the `author` property to be present.               |      |    |    |
| [require-bin](/rules/require-properties/require-bin)                                   | Requires the `bin` property to be present.                  |      |    |    |
| [require-browser](/rules/require-properties/require-browser)                           | Requires the `browser` property to be present.              |      |    |    |
| [require-bugs](/rules/require-properties/require-bugs)                                 | Requires the `bugs` property to be present.                 |      |    |    |
| [require-bundleDependencies](/rules/require-properties/require-bundleDependencies)     | Requires the `bundleDependencies` property to be present.   |      |    |    |
| [require-config](/rules/require-properties/require-config)                             | Requires the `config` property to be present.               |      |    |    |
| [require-contributors](/rules/require-properties/require-contributors)                 | Requires the `contributors` property to be present.         |      |    |    |
| [require-cpu](/rules/require-properties/require-cpu)                                   | Requires the `cpu` property to be present.                  |      |    |    |
| [require-dependencies](/rules/require-properties/require-dependencies)                 | Requires the `dependencies` property to be present.         |      |    |    |
| [require-description](/rules/require-properties/require-description)                   | Requires the `description` property to be present.          | ✅ 📦 |    |    |
| [require-devDependencies](/rules/require-properties/require-devDependencies)           | Requires the `devDependencies` property to be present.      |      |    |    |
| [require-devEngines](/rules/require-properties/require-devEngines)                     | Requires the `devEngines` property to be present.           |      |    |    |
| [require-directories](/rules/require-properties/require-directories)                   | Requires the `directories` property to be present.          |      |    |    |
| [require-engines](/rules/require-properties/require-engines)                           | Requires the `engines` property to be present.              |      |    |    |
| [require-exports](/rules/require-properties/require-exports)                           | Requires the `exports` property to be present.              | ✅ 📦 |    |    |
| [require-files](/rules/require-properties/require-files)                               | Requires the `files` property to be present.                | ✅ 📦 |    |    |
| [require-funding](/rules/require-properties/require-funding)                           | Requires the `funding` property to be present.              |      |    |    |
| [require-gypfile](/rules/require-properties/require-gypfile)                           | Requires the `gypfile` property to be present.              |      |    |    |
| [require-homepage](/rules/require-properties/require-homepage)                         | Requires the `homepage` property to be present.             |      |    |    |
| [require-keywords](/rules/require-properties/require-keywords)                         | Requires the `keywords` property to be present.             |      |    |    |
| [require-libc](/rules/require-properties/require-libc)                                 | Requires the `libc` property to be present.                 |      |    |    |
| [require-license](/rules/require-properties/require-license)                           | Requires the `license` property to be present.              | ✅ 📦 |    |    |
| [require-main](/rules/require-properties/require-main)                                 | Requires the `main` property to be present.                 |      |    |    |
| [require-man](/rules/require-properties/require-man)                                   | Requires the `man` property to be present.                  |      |    |    |
| [require-module](/rules/require-properties/require-module)                             | Requires the `module` property to be present.               |      |    |    |
| [require-name](/rules/require-properties/require-name)                                 | Requires the `name` property to be present.                 | ✅ 📦 |    |    |
| [require-optionalDependencies](/rules/require-properties/require-optionalDependencies) | Requires the `optionalDependencies` property to be present. |      |    |    |
| [require-os](/rules/require-properties/require-os)                                     | Requires the `os` property to be present.                   |      |    |    |
| [require-packageManager](/rules/require-properties/require-packageManager)             | Requires the `packageManager` property to be present.       |      |    |    |
| [require-peerDependencies](/rules/require-properties/require-peerDependencies)         | Requires the `peerDependencies` property to be present.     |      |    |    |
| [require-peerDependenciesMeta](/rules/require-properties/require-peerDependenciesMeta) | Requires the `peerDependenciesMeta` property to be present. |      |    |    |
| [require-private](/rules/require-properties/require-private)                           | Requires the `private` property to be present.              |      | 🔧 |    |
| [require-publishConfig](/rules/require-properties/require-publishConfig)               | Requires the `publishConfig` property to be present.        |      |    |    |
| [require-repository](/rules/require-properties/require-repository)                     | Requires the `repository` property to be present.           | ✅ 📦 |    |    |
| [require-scripts](/rules/require-properties/require-scripts)                           | Requires the `scripts` property to be present.              |      |    |    |
| [require-sideEffects](/rules/require-properties/require-sideEffects)                   | Requires the `sideEffects` property to be present.          | ✅ 📦 |    |    |
| [require-type](/rules/require-properties/require-type)                                 | Requires the `type` property to be present.                 | ✅ 📦 | 🔧 |    |
| [require-types](/rules/require-properties/require-types)                               | Requires the `types` property to be present.                |      |    |    |
| [require-version](/rules/require-properties/require-version)                           | Requires the `version` property to be present.              | ✅ 📦 |    |    |

## Valid Properties

This group of rules allows you to enforce that the value of the associated top-level property is valid.  All of these rules are include in the `recommended` config.

| Name                                                                             | Description                                                                           | 💼   | 🔧 | 💡 |
| :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ | :--- | :- | :- |
| [valid-author](/rules/valid-properties/valid-author)                             | Enforce that the `author` property is valid.                                          | ✅ 📦 |    |    |
| [valid-bin](/rules/valid-properties/valid-bin)                                   | Enforce that the `bin` property is valid.                                             | ✅ 📦 |    |    |
| [valid-browser](/rules/valid-properties/valid-browser)                           | Enforce that the `browser` property is valid.                                         | ✅ 📦 |    |    |
| [valid-bugs](/rules/valid-properties/valid-bugs)                                 | Enforce that the `bugs` property is valid.                                            | ✅ 📦 |    |    |
| [valid-bundleDependencies](/rules/valid-properties/valid-bundleDependencies)     | Enforce that the `bundleDependencies` (also `bundledDependencies`) property is valid. | ✅ 📦 |    |    |
| [valid-config](/rules/valid-properties/valid-config)                             | Enforce that the `config` property is valid.                                          | ✅ 📦 |    |    |
| [valid-contributors](/rules/valid-properties/valid-contributors)                 | Enforce that the `contributors` property is valid.                                    | ✅ 📦 |    |    |
| [valid-cpu](/rules/valid-properties/valid-cpu)                                   | Enforce that the `cpu` property is valid.                                             | ✅ 📦 |    |    |
| [valid-dependencies](/rules/valid-properties/valid-dependencies)                 | Enforce that the `dependencies` property is valid.                                    | ✅ 📦 |    |    |
| [valid-description](/rules/valid-properties/valid-description)                   | Enforce that the `description` property is valid.                                     | ✅ 📦 |    |    |
| [valid-devDependencies](/rules/valid-properties/valid-devDependencies)           | Enforce that the `devDependencies` property is valid.                                 | ✅ 📦 |    |    |
| [valid-devEngines](/rules/valid-properties/valid-devEngines)                     | Enforce that the `devEngines` property is valid.                                      | ✅ 📦 |    |    |
| [valid-directories](/rules/valid-properties/valid-directories)                   | Enforce that the `directories` property is valid.                                     | ✅ 📦 |    |    |
| [valid-engines](/rules/valid-properties/valid-engines)                           | Enforce that the `engines` property is valid.                                         | ✅ 📦 |    |    |
| [valid-exports](/rules/valid-properties/valid-exports)                           | Enforce that the `exports` property is valid.                                         | ✅ 📦 |    |    |
| [valid-files](/rules/valid-properties/valid-files)                               | Enforce that the `files` property is valid.                                           | ✅ 📦 |    |    |
| [valid-funding](/rules/valid-properties/valid-funding)                           | Enforce that the `funding` property is valid.                                         | ✅ 📦 |    |    |
| [valid-gypfile](/rules/valid-properties/valid-gypfile)                           | Enforce that the `gypfile` property is valid.                                         | ✅ 📦 |    |    |
| [valid-homepage](/rules/valid-properties/valid-homepage)                         | Enforce that the `homepage` property is valid.                                        | ✅ 📦 |    |    |
| [valid-keywords](/rules/valid-properties/valid-keywords)                         | Enforce that the `keywords` property is valid.                                        | ✅ 📦 |    |    |
| [valid-libc](/rules/valid-properties/valid-libc)                                 | Enforce that the `libc` property is valid.                                            | ✅ 📦 |    |    |
| [valid-license](/rules/valid-properties/valid-license)                           | Enforce that the `license` property is valid.                                         | ✅ 📦 |    |    |
| [valid-main](/rules/valid-properties/valid-main)                                 | Enforce that the `main` property is valid.                                            | ✅ 📦 |    |    |
| [valid-man](/rules/valid-properties/valid-man)                                   | Enforce that the `man` property is valid.                                             | ✅ 📦 |    |    |
| [valid-module](/rules/valid-properties/valid-module)                             | Enforce that the `module` property is valid.                                          | ✅ 📦 |    |    |
| [valid-name](/rules/valid-properties/valid-name)                                 | Enforce that the `name` property is valid.                                            | ✅ 📦 |    |    |
| [valid-optionalDependencies](/rules/valid-properties/valid-optionalDependencies) | Enforce that the `optionalDependencies` property is valid.                            | ✅ 📦 |    |    |
| [valid-os](/rules/valid-properties/valid-os)                                     | Enforce that the `os` property is valid.                                              | ✅ 📦 |    |    |
| [valid-packageManager](/rules/valid-properties/valid-packageManager)             | Enforce that the `packageManager` property is valid.                                  | ✅ 📦 |    |    |
| [valid-peerDependencies](/rules/valid-properties/valid-peerDependencies)         | Enforce that the `peerDependencies` property is valid.                                | ✅ 📦 |    |    |
| [valid-peerDependenciesMeta](/rules/valid-properties/valid-peerDependenciesMeta) | Enforce that the `peerDependenciesMeta` property is valid.                            | ✅ 📦 |    |    |
| [valid-private](/rules/valid-properties/valid-private)                           | Enforce that the `private` property is valid.                                         | ✅ 📦 |    |    |
| [valid-publishConfig](/rules/valid-properties/valid-publishConfig)               | Enforce that the `publishConfig` property is valid.                                   | ✅ 📦 |    |    |
| [valid-repository](/rules/valid-properties/valid-repository)                     | Enforce that the `repository` property is valid.                                      | ✅ 📦 |    |    |
| [valid-scripts](/rules/valid-properties/valid-scripts)                           | Enforce that the `scripts` property is valid.                                         | ✅ 📦 |    |    |
| [valid-sideEffects](/rules/valid-properties/valid-sideEffects)                   | Enforce that the `sideEffects` property is valid.                                     | ✅ 📦 |    |    |
| [valid-type](/rules/valid-properties/valid-type)                                 | Enforce that the `type` property is valid.                                            | ✅ 📦 |    |    |
| [valid-version](/rules/valid-properties/valid-version)                           | Enforce that the `version` property is valid.                                         | ✅ 📦 |    |    |
| [valid-workspaces](/rules/valid-properties/valid-workspaces)                     | Enforce that the `workspaces` property is valid.                                      | ✅ 📦 |    |    |

<!-- end auto-generated rules list -->
<!-- prettier-ignore-end -->
