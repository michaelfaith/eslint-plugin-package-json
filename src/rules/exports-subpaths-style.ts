import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates.ts';

function isImplicitFormat(
  node: AST.JSONLiteral | AST.JSONObjectExpression,
): boolean {
  if (node.type === 'JSONLiteral') {
    return true;
  }

  // Implicit format = no subpath keys (keys starting with ".")
  // All keys are conditions: import, require, node, default, types, browser
  return node.properties.every(
    (property) =>
      !isJSONStringLiteral(property.key) || !property.key.value.startsWith('.'),
  );
}

export const rule = createRule({
  create(context) {
    const [{ prefer = 'explicit' } = {}] = context.options;

    function validateForExplicit(node: AST.JSONProperty) {
      const { value } = node;
      if (
        (value.type !== 'JSONLiteral' &&
          value.type !== 'JSONObjectExpression') ||
        !isImplicitFormat(value)
      ) {
        return;
      }

      context.report({
        fix(fixer) {
          const valueText = context.sourceCode.getText(value);
          const fixedValue = JSON.stringify(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- JSON.parse required for wrapping
            { '.': JSON.parse(valueText) },
            null,
            2,
          );
          return fixer.replaceText(value, fixedValue);
        },
        messageId: 'preferExplicit',
        node: value,
      });
    }

    function validateForImplicit(node: AST.JSONProperty) {
      const { value } = node;
      if (value.type !== 'JSONObjectExpression') {
        return;
      }

      // Only transform if there's exactly one property and it's "."
      if (
        value.properties.length !== 1 ||
        !isJSONStringLiteral(value.properties[0].key) ||
        value.properties[0].key.value !== '.'
      ) {
        return;
      }

      const dotProperty = value.properties[0];
      context.report({
        fix(fixer) {
          const valueText = context.sourceCode.getText(dotProperty.value);
          const fixedValue = JSON.stringify(JSON.parse(valueText), null, 2);
          return fixer.replaceText(value, fixedValue);
        },
        messageId: 'preferImplicit',
        node: value,
      });
    }

    return {
      JSONProperty(node) {
        if (
          node.key.type !== 'JSONLiteral' ||
          node.key.value !== 'exports' ||
          node.parent.parent.parent.type !== 'Program'
        ) {
          return;
        }

        if (prefer === 'explicit') {
          validateForExplicit(node);
        } else {
          validateForImplicit(node);
        }
      },
    };
  },
  meta: {
    defaultOptions: [{ prefer: 'explicit' }],
    docs: {
      category: 'Stylistic',
      description:
        'Enforce consistent format for the exports field (implicit or explicit subpaths).',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      preferExplicit:
        'Prefer explicit subpaths format with "." key for single root export.',
      preferImplicit:
        'Prefer implicit format without "." key for single root export.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          prefer: {
            description: 'Specifies which exports format to enforce.',
            enum: ['implicit', 'explicit'],
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'exports-subpaths-style',
});
