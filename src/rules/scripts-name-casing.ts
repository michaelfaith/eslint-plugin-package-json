import { kebabCase } from 'change-case';
import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';

const BUILT_IN_SCRIPTS_IN_CAMEL_CASE = new Set([
  // See https://docs.npmjs.com/cli/v11/using-npm/scripts
  'prepublishOnly',
  // https://pnpm.io/scripts#pnpmdevpreinstall
  'pnpm:devPreinstall',
]);

export const rule = createRule({
  create(context) {
    const { ignoreNames = [], ignorePatterns = [] } = context.options[0] ?? {};
    const ignoreRegexes = ignorePatterns.map((pattern) => new RegExp(pattern));

    const isIgnored = (name: string) =>
      ignoreNames.includes(name) ||
      ignoreRegexes.some((regex) => regex.test(name));

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=scripts]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression') {
          for (const property of node.value.properties) {
            const keyNode = property.key as AST.JSONStringLiteral;
            const key = keyNode.value;
            if (BUILT_IN_SCRIPTS_IN_CAMEL_CASE.has(key) || isIgnored(key)) {
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
    defaultOptions: [{}],
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
    schema: [
      {
        additionalProperties: false,
        properties: {
          ignoreNames: {
            items: {
              type: ['string'],
            },
            type: ['array'],
            description: 'Specific script names to ignore.',
          },
          ignorePatterns: {
            items: {
              type: ['string'],
            },
            type: ['array'],
            description: 'Regex patterns for script names to ignore.',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'scripts-name-casing',
});
