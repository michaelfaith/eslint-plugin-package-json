import type { AST as JsonAST } from 'jsonc-eslint-parser';

import { fixRemoveObjectProperty, type ObjectProperty } from 'eslint-fix-utils';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates.ts';

export const rule = createRule({
  create(context) {
    const banList = Object.fromEntries(
      /* v8 ignore next - not possible to cover due to presence of `defaultOptions` */
      (context.options[0]?.ban ?? []).map((entry) =>
        typeof entry === 'string'
          ? [entry, '']
          : [entry.property, entry.message ?? ''],
      ),
    );

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression'(
        node: JsonAST.JSONObjectExpression,
      ) {
        for (const property of node.properties) {
          if (!isJSONStringLiteral(property.key)) {
            continue;
          }

          const propertyName = property.key.value;

          if (Object.hasOwn(banList, propertyName)) {
            const customMessage = banList[propertyName];

            context.report({
              data: {
                customMessage: customMessage ? `: ${customMessage}` : '',
                property: propertyName,
              },
              messageId: 'bannedProperty',
              node: property.key,
              suggest: [
                {
                  fix: fixRemoveObjectProperty(
                    context,
                    property as unknown as ObjectProperty,
                  ),
                  messageId: 'removePropertySuggestion',
                },
              ],
            });
          }
        }
      },
    };
  },
  meta: {
    defaultOptions: [{ ban: [] }],
    docs: {
      category: 'Best Practices',
      description: 'Disallows specified top-level properties in package.json.',
      recommended: false,
    },
    hasSuggestions: true,
    messages: {
      bannedProperty:
        'The `{{ property }}` property is not allowed{{ customMessage }}',
      removePropertySuggestion: 'Remove the property.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          ban: {
            description:
              'List of top-level properties to ban. Each entry can be a property name string or an object with a property name and an optional custom message.',
            items: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  additionalProperties: false,
                  properties: {
                    message: {
                      description:
                        'Custom message to append to the error report.',
                      type: 'string',
                    },
                    property: {
                      description: 'The top-level property name to ban.',
                      type: 'string',
                    },
                  },
                  required: ['property'],
                  type: 'object',
                },
              ],
            },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'restrict-top-level-properties',
});
