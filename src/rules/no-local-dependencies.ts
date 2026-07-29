import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import {
  isJSONStringLiteral,
  isNotNullish,
} from '../utils/predicates/index.ts';

const isLocalDependency = (value: string) =>
  value.startsWith('file:') ||
  value.startsWith('link:') ||
  value.startsWith('./') ||
  value.startsWith('../') ||
  value.startsWith('.\\') ||
  value.startsWith('..\\');

const getBundledDependencyNames = (
  value: AST.JSONProperty['value'] | undefined,
) => {
  const names = new Set<string>();

  if (value?.type === 'JSONArrayExpression') {
    for (const element of value.elements
      .filter(isNotNullish)
      .filter(isJSONStringLiteral)) {
      names.add(element.value);
    }
  }

  return names;
};

export const rule = createRule({
  create(context) {
    const ignorePrivate = context.options[0]?.ignorePrivate ?? true;
    let isPrivate = false;
    let dependencyNodes: AST.JSONProperty[] = [];

    const bundleDependencyValues = new Map<string, AST.JSONProperty['value']>();

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral]:matches([key.value=bundleDependencies], [key.value=bundledDependencies])'(
        node: AST.JSONProperty & {
          key: AST.JSONStringLiteral;
        },
      ) {
        bundleDependencyValues.set(node.key.value, node.value);
      },

      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONLiteral][key.value=private]'(
        node: AST.JSONProperty & {
          value: AST.JSONKeywordLiteral;
        },
      ) {
        if (node.value.value === true) {
          isPrivate = true;
        }
      },

      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression][key.value=dependencies]'(
        node: AST.JSONProperty & {
          value: AST.JSONObjectExpression;
        },
      ) {
        dependencyNodes = node.value.properties;
      },

      'Program:exit'() {
        if (ignorePrivate && isPrivate) {
          return;
        }

        let bundleDependenciesValue =
          bundleDependencyValues.get('bundleDependencies');
        // npm only falls back to the `bundledDependencies` spelling when
        // `bundleDependencies` is absent or falsy, so the two never combine.
        if (!(
          bundleDependenciesValue &&
          (bundleDependenciesValue.type !== 'JSONLiteral' ||
            Boolean(bundleDependenciesValue.value))
        )) {
          bundleDependenciesValue = bundleDependencyValues.get(
            'bundledDependencies',
          );
        }

        if (
          bundleDependenciesValue?.type === 'JSONLiteral' &&
          bundleDependenciesValue.value === true
        ) {
          return;
        }

        const bundledDependencyNames = getBundledDependencyNames(
          bundleDependenciesValue,
        );

        for (const dependencyPropertyNode of dependencyNodes) {
          const dependencyKey = dependencyPropertyNode.key;
          if (
            isJSONStringLiteral(dependencyKey) &&
            bundledDependencyNames.has(dependencyKey.value)
          ) {
            continue;
          }

          const dependencyValue = dependencyPropertyNode.value;
          if (
            isJSONStringLiteral(dependencyValue) &&
            isLocalDependency(dependencyValue.value)
          ) {
            context.report({
              data: {
                name: dependencyValue.value,
              },
              messageId: 'localDependencyFound',
              node: dependencyValue,
            });
          }
        }
      },
    };
  },
  meta: {
    defaultOptions: [{ ignorePrivate: true }],
    docs: {
      description:
        'Requires that dependencies do not use local file paths, which will likely result in errors when installing from a registry.',
    },
    messages: {
      localDependencyFound: 'Local dependency "{{ name }}" is not allowed.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          ignorePrivate: {
            description:
              "Determines if this rule should be enforced when the package's `private` property is `true`.",
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-local-dependencies',
});
