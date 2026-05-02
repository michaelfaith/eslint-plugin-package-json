import { type ESLint, type Linter } from "eslint";
import * as parserJsonc from "jsonc-eslint-parser";
import { createRequire } from "node:module";

import type { PackageJsonRuleModule } from "./createRule.ts";

import { rule as binNameCasing } from "./rules/bin-name-casing.ts";
import { rule as exportsSubpathsStyle } from "./rules/exports-subpaths-style.ts";
import { rule as noEmptyFields } from "./rules/no-empty-fields.ts";
import { rule as noRedundantFiles } from "./rules/no-redundant-files.ts";
import { rule as noRedundantPublishConfig } from "./rules/no-redundant-publishConfig.ts";
import { rule as orderProperties } from "./rules/order-properties.ts";
import { rule as preferRepositoryShorthand } from "./rules/repository-shorthand.ts";
import { rule as requireAttribution } from "./rules/require-attribution.ts";
import { rules as requireRules } from "./rules/require-properties.ts";
import { rule as restrictDependencyRanges } from "./rules/restrict-dependency-ranges.ts";
import { rule as restrictPrivateProperties } from "./rules/restrict-private-properties.ts";
import { rule as restrictTopLevelProperties } from "./rules/restrict-top-level-properties.ts";
import { rule as scriptsNameCasing } from "./rules/scripts-name-casing.ts";
import { rule as sortCollections } from "./rules/sort-collections.ts";
import { rule as specifyPeersLocally } from "./rules/specify-peers-locally.ts";
import { rule as uniqueDependencies } from "./rules/unique-dependencies.ts";
import { rule as validName } from "./rules/valid-name.ts";
import { rule as validPeerDependenciesMetaRelationship } from "./rules/valid-peerDependenciesMeta-relationship.ts";
import { rules as basicValidRules } from "./rules/valid-properties.ts";
import { rule as validRepositoryDirectory } from "./rules/valid-repository-directory.ts";
import { rule as validVersion } from "./rules/valid-version.ts";

const require = createRequire(import.meta.url);

const rules: Record<string, PackageJsonRuleModule> = {
  "bin-name-casing": binNameCasing,
  "exports-subpaths-style": exportsSubpathsStyle,
  "no-empty-fields": noEmptyFields,
  "no-redundant-files": noRedundantFiles,
  "no-redundant-publishConfig": noRedundantPublishConfig,
  "order-properties": orderProperties,
  "require-attribution": requireAttribution,
  ...requireRules,
  "repository-shorthand": preferRepositoryShorthand,
  "restrict-dependency-ranges": restrictDependencyRanges,
  "restrict-private-properties": restrictPrivateProperties,
  "restrict-top-level-properties": restrictTopLevelProperties,
  "scripts-name-casing": scriptsNameCasing,
  "sort-collections": sortCollections,
  "specify-peers-locally": specifyPeersLocally,
  "unique-dependencies": uniqueDependencies,
  ...basicValidRules,
  "valid-name": validName,
  "valid-peerDependenciesMeta-relationship":
    validPeerDependenciesMetaRelationship,
  "valid-repository-directory": validRepositoryDirectory,
  "valid-version": validVersion,
};

const recommendedRules = {
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.recommended)
      .map(([name]) => ["package-json/" + name, "error" as const]),
  ),
} satisfies Linter.RulesRecord;

const recommendedPublishableRules = {
  ...recommendedRules,
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.category === "Publishable")
      .map(([name]) => ["package-json/" + name, "error" as const]),
  ),
} satisfies Linter.RulesRecord;

const stylisticRules = {
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.category === "Stylistic")
      .map(([name]) => ["package-json/" + name, "error" as const]),
  ),
} satisfies Linter.RulesRecord;

const { name, version } = require("../package.json") as {
  name: string;
  version: string;
};

export const plugin = {
  configs: {
    recommended: {
      files: ["**/package.json"],
      languageOptions: {
        parser: parserJsonc,
      },
      name: "package-json/recommended",
      plugins: {
        get "package-json"(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: recommendedRules,
    },
    "recommended-publishable": {
      files: ["**/package.json"],
      languageOptions: {
        parser: parserJsonc,
      },
      name: "package-json/recommended-publishable",
      plugins: {
        get "package-json"(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: recommendedPublishableRules,
    },
    stylistic: {
      files: ["**/package.json"],
      languageOptions: {
        parser: parserJsonc,
      },
      name: "package-json/stylistic",
      plugins: {
        get "package-json"(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: stylisticRules,
    },
  },
  meta: {
    name,
    version,
  },
  rules,
} satisfies ESLint.Plugin;
