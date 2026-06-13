import type { AST as JsonAST } from 'jsonc-eslint-parser';

import npa from 'npm-package-arg';

import { createRule } from "../createRule.ts";

export const rule = createRule({
  create(context) {
    const { allowed: _allowed, preferred } = (context.options[0] ?? {}) as { allowed: string | string[], preferred: string};

    // convert single allowed string scope to array
    let allowed: null | string[] = null;
    if (_allowed && !Array.isArray(_allowed)) {
      allowed = [_allowed];
    } else if (_allowed) {
      allowed = _allowed as string[];
    }

    if (!preferred && !allowed?.length) {
      return {};
    }

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONLiteral][key.value=name]': (node: JsonAST.JSONProperty) => {
        let pkgarg;
        try {
          // @ts-expect-error needs some type narrowing
          pkgarg = npa(node.value.value as string);
        } catch {
          // what to do with an invalid package name? I don't see any other
          // rule dealing with this case.
          return;
        }

        // We have a preferred scope but no scope was specified
        if (preferred && !pkgarg.scope) {
          context.report({
            data: {
              name: pkgarg.name,
              preferred
            },
            fix: (fixer) => {
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              return fixer.replaceText(node.value, `"${preferred}/${pkgarg.name || ''}"`);
            },
            messageId: 'missingPreferredScope',
            node: node.value
          });
          return;
        }

        // We have a preferred scope that doesn't match and no other allowed scopes to check
        if (pkgarg.scope !== preferred && !allowed?.length) {
          context.report({
            data: {
              preferred,
              scope: pkgarg.scope
            },
            fix: (fixer) => {
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              return fixer.replaceText(node.value, `"${(pkgarg.name || '').replace((pkgarg.scope || ''), preferred)}"`);
            },
            messageId: 'usePreferredScope',
            node: node.value,
          });
          return;
        }

        // Neither preferred scope or allowed scopes match
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (pkgarg.scope !== preferred && allowed?.length && !allowed.includes(pkgarg.scope || '')) {
          context.report({
            data: {
              preferred: preferred || allowed.join(', '),
              scope: pkgarg.scope
            },
            fix: (fixer) => {
              if (!preferred) {
                return null;
              }
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              return fixer.replaceText(node.value, `"${(pkgarg.name || '').replace((pkgarg.scope || ''), preferred)}"`);
            },
            messageId: 'useAllowedScope',
            node: node.value
          });
        }
      }
    };
  },
  meta: {
    // This rule does not have defaults but also requires one of those
    // properties. I think this is also a conflict of the eslint rules
    // with they typescript checks
    // eslint-disable-next-line eslint-plugin/require-meta-default-options
    defaultOptions: [],
    docs: {
      category: 'Best Practices',
      description: 'Enforce that `name` uses a specific scope or set of scopes.'
    },
    fixable: 'code',
    messages: {
      missingPreferredScope: 'Use the preferred scope "{{preferred}}" in package name; found "{{name}}"',
      useAllowedScope: 'Use an allowed scope ({{preferred}}) in package name; found "{{scope}}"',
      usePreferredScope: 'Use the preferred scope "{{preferred}}"; found "{{scope}}"'
    }, schema: [
      {
        anyOf: [
          {
            description: 'this lint rule doesn\'t make sense',
            required: ['preferred']
          },
          {
            description: 'this lint rule doesn\'t make sense',
            required: ['allowed']
          }
        ],
        properties: {
          allowed: {
            anyOf: [
              { type: 'string' },
              {
                items: {
                  type: 'string'
                },
                type: 'array'
              }
            ],
            description: 'Allowed scopes'
          },
          preferred: {
            description: 'Prefered scope',
            type: 'string'
          }
        },
        type: 'object'
      }
    ],
    type: 'problem'
  },
  name: 'prefer-scoped-name',
});
