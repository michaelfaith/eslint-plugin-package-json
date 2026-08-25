import type { AST } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { EngineContext } from '../utils/EngineContext.ts';
import {
  getEngines,
  getInstalledPackageMeta,
  getRemotePackageMeta,
  type PackageMeta,
} from '../utils/packageMeta/index.ts';
import { isJSONStringLiteral } from '../utils/predicates/isJSONStringLiteral.ts';
import { getSemverRange, mergeSemverRanges } from '../utils/semver/index.ts';

export const rule = createRule({
  create(context) {
    const engines = new Map<string, semver.Range>();
    const dependencies: AST.JSONProperty[] = [];

    const checkPackageMeta = (
      engineContext: EngineContext,
      packageMeta: PackageMeta,
    ): void => {
      const dependencyEngines = getEngines(packageMeta);

      // For each engine definition from this package, validate if it is a subset
      // of the dependency's engines.
      for (const module of engineContext.engines) {
        const thisEngineVersion = engines.get(module);
        const dependencyEngineValue = dependencyEngines.get(module);

        if (dependencyEngineValue && dependencyEngineValue !== '*') {
          engineContext.markAsChecked(module);
        }
        const dependencyEngineVersion = getSemverRange(
          dependencyEngineValue ?? '*',
        );
        if (!dependencyEngineVersion || !thisEngineVersion) {
          continue;
        }
        if (!semver.subset(thisEngineVersion, dependencyEngineVersion)) {
          engineContext.markAsInvalid(module, dependencyEngineVersion);
        }
      }
    };

    const checkDependency = (
      engineContext: EngineContext,
      name: string,
      version: string,
      modules: string[],
      property: AST.JSONProperty,
    ): void => {
      const currentModule = `${name}@${version}`;

      // Get the package.json for this package/version from the local node_modules
      const installedPackageMeta = getInstalledPackageMeta(
        name,
        version,
        context,
      );

      if (installedPackageMeta) {
        checkPackageMeta(engineContext, installedPackageMeta);

        if (engineContext.isValid && engineContext.areAllChecked) {
          return;
        }
      }

      // Get the package.json for this package/version from the registry
      const remotePackageMeta = getRemotePackageMeta(name, version);
      for (const packageMeta of remotePackageMeta.cache) {
        checkPackageMeta(engineContext, packageMeta);

        if (engineContext.isValid && engineContext.areAllChecked) {
          return;
        }
      }

      const packageMetaList = remotePackageMeta.get();
      if (!packageMetaList) {
        return;
      }
      for (const packageMeta of packageMetaList) {
        checkPackageMeta(engineContext, packageMeta);

        if (engineContext.isValid && engineContext.areAllChecked) {
          return;
        }
      }

      // Report on all invalid cases
      for (const [module, allowedVersions] of engineContext.invalidEngines) {
        const thisPackageModuleVersionRange = engines.get(module);
        const dependencyModuleVersionRange =
          mergeSemverRanges(...allowedVersions.values()) ??
          [...allowedVersions.values()].pop();
        if (
          !dependencyModuleVersionRange ||
          !thisPackageModuleVersionRange ||
          semver.subset(
            thisPackageModuleVersionRange,
            dependencyModuleVersionRange,
          )
        ) {
          continue;
        }
        context.report({
          data: {
            allowedModuleRange: `${module}@${dependencyModuleVersionRange.format()}`,
            dependencyChain: currentModule,
            myModuleRange: `${module}@${thisPackageModuleVersionRange.raw}`,
          },
          node: property,
          messageId: 'incompatibleEngines',
        });
      }
    };

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=engines]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type !== 'JSONObjectExpression') {
          return;
        }
        for (const property of node.value.properties) {
          const { key, value } = property;
          if (isJSONStringLiteral(key) && isJSONStringLiteral(value)) {
            const semverRange = getSemverRange(value.value);
            if (semverRange) {
              engines.set(key.value, semverRange);
            }
          }
        }
      },
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=dependencies]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression') {
          dependencies.push(...node.value.properties);
        }
      },
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=peerDependencies]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression') {
          dependencies.push(...node.value.properties);
        }
      },
      'Program:exit'() {
        if (!engines.size) {
          return;
        }

        for (const property of dependencies) {
          const { key, value } = property;
          if (!isJSONStringLiteral(key) || !isJSONStringLiteral(value)) {
            continue;
          }

          const engineContext = new EngineContext(engines.keys());
          checkDependency(engineContext, key.value, value.value, [], property);
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        "Ensures that the engines for all dependencies and peerDependencies are compatible with the package's engines.",
    },
    messages: {
      incompatibleEngines:
        '"{{ dependencyChain }}" is not compatible with "{{ myModuleRange }}". Required: "{{ allowedModuleRange }}"',
    },
    schema: [],
    type: 'problem',
  },
  name: 'compatible-engines',
});
