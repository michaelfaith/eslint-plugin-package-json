import { kebabCase } from 'change-case';
import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';

// See https://docs.npmjs.com/cli/v11/using-npm/scripts
const BUILT_IN_SCRIPTS_IN_CAMEL_CASE = new Set([
  'prepublishOnly',
  'pnpm:devPreinstall',
]);

export const rule = createRule({
  create(context) {
    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=scripts]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression') {
          for (const property of node.value.properties) {
            const keyNode = property.key as AST.JSONStringLiteral;
            const key = keyNode.value;
            if (BUILT_IN_SCRIPTS_IN_CAMEL_CASE.has(key)) {
              continue;
            }

            // Don't include a leading '.'
            const kebabCaseKey = (key.startsWith('.') ? key.slice(1) : key)
              .split(':')
              .map((segment) => kebabCase(segment))
              .join(':');
            if (kebabCaseKey !== (key.startsWith('.') ? key.slice(1) : key)) {
              context.report({
                data: {
                  property: key,
                },
                messageId: 'invalidCase',
                node: keyNode,
                suggest: [
                  {
                    data: {
                      property: key,
                    },
                    fix: (fixer) => {
                      return fixer.replaceText(
                        keyNode,
                        JSON.stringify(
                          key.startsWith('.')
                            ? `.${kebabCaseKey}`
                            : kebabCaseKey,
                        ),
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
      description:
        'Enforce that names for `scripts` are in kebab case (optionally separated by colons).',
    },
    hasSuggestions: true,
    messages: {
      convertToKebabCase: 'Convert {{ property }} to kebab case.',
      invalidCase: 'Script name {{ property }} should be in kebab case.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'scripts-name-casing',
});
