import { kebabCase } from 'change-case';
import { AST as JsonAST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';

export const rule = createRule({
  create(context) {
    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=bin]'(
        node: JsonAST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression') {
          for (const property of node.value.properties) {
            const key = property.key as JsonAST.JSONStringLiteral;
            const kebabCaseKey = kebabCase(key.value);
            if (kebabCaseKey !== key.value) {
              context.report({
                data: {
                  property: key.value,
                },
                messageId: 'invalidCase',
                node: key,
                suggest: [
                  {
                    data: {
                      property: key.value,
                    },
                    fix: (fixer) => {
                      return fixer.replaceText(
                        key,
                        JSON.stringify(kebabCaseKey),
                      );
                    },
                    messageId: 'convertToKebabCase',
                  },
                ],
              });
            }
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Stylistic',
      description: 'Enforce that names for bin properties are in kebab case.',
    },
    hasSuggestions: true,
    messages: {
      convertToKebabCase: 'Convert {{ property }} to kebab case.',
      invalidCase: 'Command name {{ property }} should be in kebab case.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'bin-name-casing',
});
