import type { AST } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

/** An npm override selector is restricted only if it names a package and a non-universal version range. */
const hasVersionRestriction = (selector: string): boolean => {
  // For scoped packages, the first @ is part of the package name, not its version.
  const searchFrom = selector.startsWith('@') ? selector.indexOf('/') + 1 : 0;
  const versionSeparator = selector.indexOf('@', searchFrom);
  if (versionSeparator <= searchFrom) {
    return false;
  }

  const range = semver.validRange(selector.slice(versionSeparator + 1));
  return range !== null && range !== '*';
};

export const rule = createRule({
  create(context) {
    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=overrides]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type !== 'JSONObjectExpression') {
          return;
        }

        for (const property of node.value.properties) {
          if (!isJSONStringLiteral(property.key)) {
            continue;
          }

          const selector = property.key.value;
          if (!hasVersionRestriction(selector)) {
            context.report({
              data: { selector },
              messageId: 'unrestrictedOverride',
              node: property.key,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Reports unrestricted npm override selectors that can affect multiple dependency versions.',
      recommended: false,
    },
    messages: {
      unrestrictedOverride:
        'Override selector "{{ selector }}" must include a non-universal version range.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'require-override-restrictions',
});
