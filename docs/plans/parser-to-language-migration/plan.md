# Migration Plan

Following is a proposal for how we execute the migration from the `jsonc-eslint-parser` setup that we have today to the new language provided by `@eslint/json`.
The original feature request: #655.

## Milestone 1: Experimental Language Support

This milestone is us dipping our toe in the water and offering an opt-in experimental version of the plugin with configs and rules that can be used with `@eslint/json`.

Since this will be an opt-in feature, we should be able to introduce this in a minor version.
In order to not make it a breaking change, we'll have to add `@eslint/json` as an optional peer dependency.
Otherwise, we'd reduce our supported versions of `eslint` ([reference](./research.md#compatibility)).

**Release Timeframe:** v1.x release cycle

### New Exports

The core change here is that we'll export a new set of symbols, mirroring our current `plugin`, `configs`, and `rules`, but under a new entry point: `./experimental`.

In the case of the `rules`, we'll wrap each rule from the primary entry point with the `toCompatRule(rule)` function from `eslint-json-compat-utils`.
([reference](./research.md#tooling-options)).

For the `configs`, we'll export versions of the existing configs with the `parser` replaced by a `language` from `@eslint/json`.

```diff
recommended: {
  files: ['**/package.json'],
- languageOptions: {
-   parser: parserJsonc,
- },
+ language: 'json/json',
  name: 'package-json/recommended',
  plugins: {
    get 'package-json'(): ESLint.Plugin {
      return plugin;
    },
  },
  rules: recommendedRules,
},
```

For the new version of the `plugin`, we could either recombine the above pieces into a new plugin, or wrap the existing one in `toCompatPlugin(plugin)` from `eslint-json-compat-utils`.
I think either approach is valid.

> [!NOTE]
> We won't be including the `@eslint/json` plugin declaration in any of our configs, so that it doesn't clash with any existing usage in user-land configs.
> Users that aren't already using `@eslint/json` will need to install the plugin alongside our plugin, in order for the language to work.

### Documentation

Usage of the new experimental APIs should be documented in the [Getting Started](https://eslint-plugin-package-json.dev/getting-started/) page of the site.
The additional requirement to install `@eslint/json` as a dependency should be documented too.

## Milestone 2: Make the Experimental APIs the Default Exports

In this milestone we'll move the existing experimental APIs to be the primary exports.
We'll no longer be exporting the `jsonc-eslint-parser` compatible versions.

We will, however, still be using `jsonc-eslint-parser` under the covers, and wrapping the og versions of the rules with `eslint-json-compat-utils`.

Now that the experimental APIs will be the only experience, we can make `@eslint/json` a required peer dependency.
Because of this, we can only target a major version for this milestone.

**Release Timeframe:** v2.0.0

### Downstream Work

Once we hit this milestone, we can start migrating the underlying rules to use the `@eslint/json` language, one rule at a time.
So, during this time, we'll be exporting some set of rules that have already been migrated and are using the new AST, alongside rules that haven't been migrated and are still wrapped by `toCompatRule`.

> [!IMPORTANT]
> As we migration rules, we should leverage `meta.languages` on the rules to enforce the contract with the `@eslint/json` language.

## Milestone 3: All Rules Have Been Migrated

We'll hit this milestone once we've migrated all of the rules from `jsonc-eslint-parser` to the `@eslint/json` language.
At this point we can remove `jsonc-eslint-parser` and `eslint-json-compat-utils` as dependencies.

**Release Timeframe:** v2.x release cycle
