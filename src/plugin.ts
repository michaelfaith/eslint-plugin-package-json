import { createRequire } from 'node:module';

import { type ESLint, type Linter } from 'eslint';
import * as parserJsonc from 'jsonc-eslint-parser';

import type { PackageJsonRuleModule } from './createRule.ts';
import binNameCasing from './rules/bin-name-casing.ts';
import consistentPackageManagerDeclaration from './rules/consistent-package-manager-declaration.ts';
import consistentPropertyAliases from './rules/consistent-property-aliases.ts';
import exportsSubpathsStyle from './rules/exports-subpaths-style.ts';
import noEmptyFields from './rules/no-empty-fields.ts';
import noLocalDependencies from './rules/no-local-dependencies.ts';
import noRedundantFiles from './rules/no-redundant-files.ts';
import noRedundantPublishConfig from './rules/no-redundant-publishConfig.ts';
import orderProperties from './rules/order-properties.ts';
import preferRollingWorkspaceSpec from './rules/prefer-rolling-workspace-spec.ts';
import preferScopedName from './rules/prefer-scoped-name.ts';
import repositoryShorthand from './rules/repository-shorthand.ts';
import requireAttribution from './rules/require-attribution.ts';
import requireOverrideRestrictions from './rules/require-override-restrictions.ts';
import requirePackageJsonExport from './rules/require-package-json-export.ts';
import requireRules from './rules/require-properties.ts';
import restrictDependencyRanges from './rules/restrict-dependency-ranges.ts';
import restrictDistTags from './rules/restrict-dist-tags.ts';
import restrictPrivateProperties from './rules/restrict-private-properties.ts';
import restrictTopLevelProperties from './rules/restrict-top-level-properties.ts';
import scriptsNameCasing from './rules/scripts-name-casing.ts';
import sortCollections from './rules/sort-collections.ts';
import specifyPeersLocally from './rules/specify-peers-locally.ts';
import uniqueDependencies from './rules/unique-dependencies.ts';
import validAuthor from './rules/valid-author.ts';
import validPeerDependenciesMetaRelationship from './rules/valid-peerDependenciesMeta-relationship.ts';
import basicValidRules from './rules/valid-properties.ts';
import validRepositoryDirectory from './rules/valid-repository-directory.ts';

const require = createRequire(import.meta.url);

const rules: Record<string, PackageJsonRuleModule> = {
  'bin-name-casing': binNameCasing,
  'consistent-package-manager-declaration': consistentPackageManagerDeclaration,
  'consistent-property-aliases': consistentPropertyAliases,
  'exports-subpaths-style': exportsSubpathsStyle,
  'no-empty-fields': noEmptyFields,
  'no-local-dependencies': noLocalDependencies,
  'no-redundant-files': noRedundantFiles,
  'no-redundant-publishConfig': noRedundantPublishConfig,
  'order-properties': orderProperties,
  'prefer-scoped-name': preferScopedName,
  'prefer-rolling-workspace-spec': preferRollingWorkspaceSpec,
  'require-attribution': requireAttribution,
  'require-override-restrictions': requireOverrideRestrictions,
  'require-package-json-export': requirePackageJsonExport,
  ...requireRules,
  'repository-shorthand': repositoryShorthand,
  'restrict-dependency-ranges': restrictDependencyRanges,
  'restrict-dist-tags': restrictDistTags,
  'restrict-private-properties': restrictPrivateProperties,
  'restrict-top-level-properties': restrictTopLevelProperties,
  'scripts-name-casing': scriptsNameCasing,
  'sort-collections': sortCollections,
  'specify-peers-locally': specifyPeersLocally,
  'unique-dependencies': uniqueDependencies,
  'valid-author': validAuthor,
  ...basicValidRules,
  'valid-peerDependenciesMeta-relationship': validPeerDependenciesMetaRelationship,
  'valid-repository-directory': validRepositoryDirectory,
};

const recommendedRules = {
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.recommended)
      .map(([name]) => ['package-json/' + name, 'error' as const]),
  ),
} satisfies Linter.RulesRecord;

const recommendedPublishableRules = {
  ...recommendedRules,
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.category === 'Publishable')
      .map(([name]) => ['package-json/' + name, 'error' as const]),
  ),
} satisfies Linter.RulesRecord;

const stylisticRules = {
  ...Object.fromEntries(
    Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs?.category === 'Stylistic')
      .map(([name]) => ['package-json/' + name, 'error' as const]),
  ),
} satisfies Linter.RulesRecord;

const { name, version } = require('../package.json') as {
  name: string;
  version: string;
};

export const plugin = {
  configs: {
    recommended: {
      files: ['**/package.json'],
      languageOptions: {
        parser: parserJsonc,
      },
      name: 'package-json/recommended',
      plugins: {
        get 'package-json'(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: recommendedRules,
    },
    /** @deprecated use the recommended config instead. this config will be removed in a future major release */
    'recommended-publishable': {
      files: ['**/package.json'],
      languageOptions: {
        parser: parserJsonc,
      },
      name: 'package-json/recommended-publishable',
      plugins: {
        get 'package-json'(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: recommendedPublishableRules,
    },
    stylistic: {
      files: ['**/package.json'],
      languageOptions: {
        parser: parserJsonc,
      },
      name: 'package-json/stylistic',
      plugins: {
        get 'package-json'(): ESLint.Plugin {
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
