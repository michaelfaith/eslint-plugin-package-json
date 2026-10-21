import detectIndent from 'detect-indent';
import { detectNewlineGraceful } from 'detect-newline';
import type { Rule } from 'eslint';
import { type AST, getStaticJSONValue } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { findPropertyWithKeyValue } from '../utils/findPropertyWithKeyValue.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

interface PackageManagerSpec {
  name: string;
  version: string;
  /** Whether moving this declaration to the other field would drop information */
  isLossy: boolean;
}

// eslint-disable-next-line jsdoc/text-escaping
/** `name@version`, optionally followed by a Corepack integrity hash (e.g. `+sha512.<hex>`) */
const PACKAGE_MANAGER_FIELD_REGEX = /^(?<name>[^@\s]+)@(?<version>[^+\s]+)(?<hash>\+\S+)?$/;

/**
 * Same as the `name` group from `PACKAGE_MANAGER_NAME_REGEX`, so that the result can be read back
 */
const PACKAGE_MANAGER_NAME_REGEX = /^[^@\s]+$/;

const isExactVersion = (version: string) => semver.valid(version) === version;

const parsePackageManagerField = (node: AST.JSONExpression): PackageManagerSpec | undefined => {
  if (!isJSONStringLiteral(node)) {
    return undefined;
  }

  const groups = PACKAGE_MANAGER_FIELD_REGEX.exec(node.value)?.groups;

  // `devEngines` doesn't support the integrity hash
  return groups && isExactVersion(groups.version)
    ? { name: groups.name, version: groups.version, isLossy: !!groups.hash }
    : undefined;
};

const parseDevEnginesPackageManager = (
  node: AST.JSONExpression,
): PackageManagerSpec | undefined => {
  if (node.type !== 'JSONObjectExpression') {
    return undefined;
  }

  const { name, version, ...rest } = getStaticJSONValue(node);

  // The `packageManager` field only accepts a plain name and an exact version (not a range),
  // and doesn't support `onFail` (or anything else)
  return typeof name === 'string' &&
    PACKAGE_MANAGER_NAME_REGEX.test(name) &&
    typeof version === 'string' &&
    isExactVersion(version)
    ? { name, version, isLossy: Object.keys(rest).length > 0 }
    : undefined;
};

/**
 * Whether `source` can be removed without losing anything that `target` doesn't already declare.
 */
const isRedundantWith = (source?: PackageManagerSpec, target?: PackageManagerSpec) =>
  !!source &&
  !!target &&
  !source.isLossy &&
  source.name === target.name &&
  source.version === target.version;

/**
 * Removes a property that has at least one sibling, along with its separating
 * comma and whitespace, so that no blank line is left behind.
 */
const removeProperty = (fixer: Rule.RuleFixer, property: AST.JSONProperty) => {
  const { properties } = property.parent;
  const index = properties.indexOf(property);
  const nextProperty = properties.at(index + 1);

  return fixer.removeRange(
    nextProperty
      ? [property.range[0], nextProperty.range[0]]
      : [properties[index - 1].range[1], property.range[1]],
  );
};

export const rule = createRule({
  create(context) {
    type PreferValue = [(typeof context.options)[0] & {}][0]['prefer'] & {};
    const prefer: PreferValue = context.options[0]?.prefer ?? 'devEngines';

    const { sourceCode } = context;
    const { text } = sourceCode;

    const indentedNewline = (indent: string) => detectNewlineGraceful(text) + indent;

    const formatJson = (value: unknown, baseIndent: string) => {
      const { indent, type } = detectIndent(text);
      const indentUnit = type === 'tab' ? '\t' : indent;
      return JSON.stringify(value, null, indentUnit).split('\n').join(indentedNewline(baseIndent));
    };

    const getLineIndent = (node: AST.JSONNode) => {
      const line = sourceCode.lines[node.loc.start.line - 1];
      return line.slice(0, line.length - line.trimStart().length);
    };

    const addProperty = (
      fixer: Rule.RuleFixer,
      object: AST.JSONObjectExpression,
      key: string,
      value: unknown,
    ) => {
      const lastProperty = object.properties.at(-1);
      if (lastProperty) {
        const indent = getLineIndent(lastProperty);
        return fixer.insertTextAfterRange(
          lastProperty.range,
          `,${indentedNewline(indent)}${JSON.stringify(key)}: ${formatJson(value, indent)}`,
        );
      }

      return fixer.replaceText(object, formatJson({ [key]: value }, getLineIndent(object)));
    };

    const report = (
      node: AST.JSONProperty,
      messageId: 'preferDevEngines' | 'preferPackageManager',
      fix?: {
        lossless: boolean;
        messageId:
          | 'moveToDevEngines'
          | 'moveToPackageManager'
          | 'removeDevEnginesPackageManager'
          | 'removePackageManager';
        run: Rule.ReportFixer;
      },
    ) => {
      context.report({
        messageId,
        node,
        ...(fix &&
          (fix.lossless
            ? { fix: fix.run }
            : { suggest: [{ fix: fix.run, messageId: fix.messageId }] })),
      });
    };

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression': (
        node: AST.JSONObjectExpression,
      ) => {
        const packageManagerProperty = findPropertyWithKeyValue(node.properties, 'packageManager');
        const devEnginesProperty = findPropertyWithKeyValue(node.properties, 'devEngines');
        const devEngines =
          devEnginesProperty?.value.type === 'JSONObjectExpression'
            ? devEnginesProperty.value
            : undefined;
        const devEnginesPackageManagerProperty =
          devEngines && findPropertyWithKeyValue(devEngines.properties, 'packageManager');

        if (prefer === 'devEngines') {
          if (!packageManagerProperty) {
            return;
          }

          const source = parsePackageManagerField(packageManagerProperty.value);

          // `devEngines` already declares one, so the top-level field can only be removed
          if (devEnginesPackageManagerProperty) {
            report(packageManagerProperty, 'preferDevEngines', {
              lossless: isRedundantWith(
                source,
                parseDevEnginesPackageManager(devEnginesPackageManagerProperty.value),
              ),
              messageId: 'removePackageManager',
              run: (fixer) => removeProperty(fixer, packageManagerProperty),
            });
            return;
          }

          // Moving needs a parsable value and somewhere valid to move it to
          if (!source || (devEnginesProperty && !devEngines)) {
            report(packageManagerProperty, 'preferDevEngines');
            return;
          }

          const packageManager = { name: source.name, version: source.version };
          report(packageManagerProperty, 'preferDevEngines', {
            lossless: !source.isLossy,
            messageId: 'moveToDevEngines',
            run: (fixer) =>
              devEngines
                ? [
                    removeProperty(fixer, packageManagerProperty),
                    addProperty(fixer, devEngines, 'packageManager', packageManager),
                  ]
                : fixer.replaceText(
                    packageManagerProperty,
                    `"devEngines": ${formatJson({ packageManager }, getLineIndent(packageManagerProperty))}`,
                  ),
          });
          return;
        }

        if (!devEnginesProperty || !devEngines || !devEnginesPackageManagerProperty) {
          return;
        }

        // When `packageManager` is the only `devEngines` entry, the whole `devEngines` property
        // can be removed
        const isOnlyDevEngine = devEngines.properties.length === 1;
        const source = parseDevEnginesPackageManager(devEnginesPackageManagerProperty.value);

        // The top-level field already exists, so `devEngines.packageManager` can only be removed
        if (packageManagerProperty) {
          report(devEnginesPackageManagerProperty, 'preferPackageManager', {
            lossless: isRedundantWith(
              source,
              parsePackageManagerField(packageManagerProperty.value),
            ),
            messageId: 'removeDevEnginesPackageManager',
            run: (fixer) =>
              removeProperty(
                fixer,
                isOnlyDevEngine ? devEnginesProperty : devEnginesPackageManagerProperty,
              ),
          });
          return;
        }

        if (!source) {
          report(devEnginesPackageManagerProperty, 'preferPackageManager');
          return;
        }

        const packageManagerText = `"packageManager": ${JSON.stringify(`${source.name}@${source.version}`)}`;
        report(devEnginesPackageManagerProperty, 'preferPackageManager', {
          lossless: !source.isLossy,
          messageId: 'moveToPackageManager',
          run: (fixer) =>
            isOnlyDevEngine
              ? fixer.replaceText(devEnginesProperty, packageManagerText)
              : [
                  removeProperty(fixer, devEnginesPackageManagerProperty),
                  fixer.insertTextBefore(
                    devEnginesProperty,
                    `${packageManagerText},${indentedNewline(getLineIndent(devEnginesProperty))}`,
                  ),
                ],
        });
      },
    };
  },
  meta: {
    defaultOptions: [{ prefer: 'devEngines' }],
    docs: {
      category: 'Best Practices',
      description:
        'Enforce that the package manager is declared in either `packageManager` or `devEngines.packageManager`.',
      recommended: false,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      moveToDevEngines: 'Move the package manager declaration to "devEngines.packageManager".',
      moveToPackageManager: 'Move the package manager declaration to "packageManager".',
      preferDevEngines:
        'Declare the package manager in `devEngines.packageManager` instead of `packageManager`.',
      preferPackageManager:
        'Declare the package manager in `packageManager` instead of `devEngines.packageManager`.',
      removeDevEnginesPackageManager:
        'Remove `devEngines.packageManager`, since `packageManager` is already declared.',
      removePackageManager:
        'Remove `packageManager`, since `devEngines.packageManager` is already declared.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          prefer: {
            description: 'Specifies where the package manager should be declared.',
            enum: ['devEngines', 'packageManager'],
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'consistent-package-manager-declaration',
});
