import type { AST as JsonAST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates.ts';

const isLocalDependency = (value: string) =>
  value.startsWith('file:') ||
  value.startsWith('link:') ||
  value.startsWith('./') ||
  value.startsWith('../') ||
  value.startsWith('.\\') ||
  value.startsWith('..\\');

export const rule = createRule({
  create(context) {
    const ignorePrivate = context.options[0]?.ignorePrivate ?? true;
    let isPrivate = false;
    let dependencyNodes: JsonAST.JSONProperty[] = [];

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONLiteral][key.value=private]'(
        node: JsonAST.JSONProperty & {
          value: JsonAST.JSONKeywordLiteral;
        },
      ) {
        if (node.value.value === true) {
          isPrivate = true;
        }
      },
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression][key.value=dependencies]'(
        node: JsonAST.JSONProperty & {
          value: JsonAST.JSONObjectExpression;
        },
      ) {
        dependencyNodes = node.value.properties;
      },
      'Program:exit'() {
        if (ignorePrivate && isPrivate) {
          return;
        }

        for (const dependencyPropertyNode of dependencyNodes) {
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
        'Requires that dependencies do not use local file paths, which will cause errors when installing from a registry.',
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
