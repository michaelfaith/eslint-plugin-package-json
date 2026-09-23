import type { AST } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

const DEFAULT_ALLOWED_TAGS = ['latest', 'dev', 'next', 'alpha', 'beta', 'canary', 'rc'];

const distTagPattern = /^[A-Z0-9][\w.-]*$/i;
function isDistTag(value: string): boolean {
  return !semver.validRange(value) && distTagPattern.test(value);
}

const rule = createRule({
  create(context) {
    const { allowed = DEFAULT_ALLOWED_TAGS, allowedFor } = context.options[0] ?? {};

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression]'(
        node: AST.JSONProperty & {
          key: AST.JSONStringLiteral;
          value: AST.JSONObjectExpression;
        },
      ) {
        const dependencyType = node.key.value;

        if (!DEPENDENCY_TYPES.includes(dependencyType)) {
          return;
        }

        for (const property of node.value.properties) {
          if (!isJSONStringLiteral(property.key) || !isJSONStringLiteral(property.value)) {
            continue;
          }

          const spec = property.value.value;

          if (!isDistTag(spec)) {
            continue;
          }

          if (
            (allowedFor === undefined || allowedFor.includes(dependencyType)) &&
            allowed.includes(spec)
          ) {
            continue;
          }

          context.report({
            data: {
              dependencyType,
              tag: spec,
            },
            messageId: 'disallowedDistTag',
            node: property.value,
          });
        }
      },
    };
  },

  meta: {
    defaultOptions: [
      {
        allowed: DEFAULT_ALLOWED_TAGS,
      },
    ],
    docs: {
      description:
        'Restricts dependency dist-tags to an allowed list and selected dependency types.',
    },
    messages: {
      disallowedDistTag: 'The "{{ tag }}" dist-tag is not allowed for {{ dependencyType }}.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            description: 'Dist-tags allowed in dependency specifications.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          allowedFor: {
            description: 'Dependency sections where the allowed dist-tags may be used.',
            type: 'array',
            items: {
              enum: DEPENDENCY_TYPES,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    type: 'problem',
  },

  name: 'restrict-dist-tags',
});

export { DEPENDENCY_TYPES, rule };
