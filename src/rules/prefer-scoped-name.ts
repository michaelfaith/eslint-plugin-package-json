import type { Rule } from 'eslint';
import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

export const rule = createRule({
  create(context) {
    const { preferred, allowed = [] } = context.options[0] ?? {};

    // No policy is applied unless a preference or allow-list is configured.
    if (!preferred && allowed.length === 0) {
      return {};
    }

    const acceptedScopes = new Set([...(preferred ? [preferred] : []), ...allowed]);

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=name]'(
        node: AST.JSONProperty,
      ) {
        if (!isJSONStringLiteral(node.value)) {
          return;
        }

        const name = node.value.value;
        const slashIndex = name.indexOf('/');
        const actualScope =
          name.startsWith('@') && slashIndex > 1 ? name.slice(0, slashIndex) : undefined;

        // With only the allow-list configured, unscoped names are allowed.
        if (!actualScope && !preferred) {
          return;
        }

        // Another rule validates invalid package name syntax.
        if (name.startsWith('@') && !actualScope) {
          return;
        }

        if (actualScope && acceptedScopes.has(actualScope)) {
          return;
        }

        const isPrivate = node.parent.properties.some(
          (property) =>
            isJSONStringLiteral(property.key) &&
            property.key.value === 'private' &&
            property.value.type === 'JSONLiteral' &&
            property.value.value === true,
        );

        const messageId = actualScope
          ? preferred
            ? 'usePreferredScope'
            : 'useAllowedScope'
          : 'missingPreferredScope';

        const data = actualScope
          ? { preferred: preferred ?? '', scope: actualScope }
          : { name, preferred: preferred ?? '' };

        const replacement = preferred
          ? preferred + '/' + (actualScope ? name.slice(slashIndex + 1) : name)
          : undefined;
        const fix: Rule.ReportFixer | undefined = replacement
          ? (fixer) => fixer.replaceText(node.value, JSON.stringify(replacement))
          : undefined;

        context.report({
          data,
          ...(isPrivate && fix ? { fix } : {}),
          messageId,
          node: node.value,
          ...(!isPrivate && fix
            ? { suggest: [{ fix, messageId: 'usePreferredScopeSuggestion' }] }
            : {}),
        });
      },
    };
  },
  meta: {
    defaultOptions: [{}],
    docs: {
      category: 'Best Practices',
      description: 'Enforce that package names use a specific scope or set of scopes.',
      recommended: false,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      missingPreferredScope:
        'Use the preferred scope "{{preferred}}" in package name; found "{{name}}".',
      useAllowedScope: 'Use an allowed scope; found "{{scope}}".',
      usePreferredScope: 'Use the preferred scope "{{preferred}}"; found "{{scope}}".',
      usePreferredScopeSuggestion: 'Change to the preferred scope.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowed: {
            description: 'Additional permitted scopes, each starting with @.',
            items: { pattern: '^@[^/]+$', type: 'string' },
            type: 'array',
          },
          preferred: {
            description: 'The scope to suggest or fix for private packages.',
            pattern: '^@[^/]+$',
            type: 'string',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'prefer-scoped-name',
});
