import type { AST } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
] as const;

type Dependency = (typeof DEPENDENCY_TYPES)[number];

const DEFAULT_ALLOWED_TAGS = [
  'latest',
  'dev',
  'next',
  'alpha',
  'beta',
  'canary',
  'rc',
];

function isDistTag(value: string): boolean {
  return !semver.validRange(value) && /^[A-Z0-9][\w.-]*$/i.test(value);
}

const schema = {
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
      description:
        'Dependency sections where the allowed dist-tags may be used.',
      type: 'array',
      items: {
        enum: DEPENDENCY_TYPES,
      },
    },
  },
  additionalProperties: false,
} as const;

const rule = createRule({
  create(context) {
    const options = context.options[0] ?? {};
    const allowedTags = options.allowed ?? DEFAULT_ALLOWED_TAGS;
    const allowedForDependencies = options.allowedFor ?? [];

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression]'(
        node: AST.JSONProperty & {
          key: AST.JSONStringLiteral;
          value: AST.JSONObjectExpression;
        },
      ) {
        const dependencyType = node.key.value;

        if (!DEPENDENCY_TYPES.includes(dependencyType as Dependency)) {
          return;
        }

        for (const property of node.value.properties) {
          if (
            !isJSONStringLiteral(property.key) ||
            !isJSONStringLiteral(property.value)
          ) {
            continue;
          }

          const tag = property.value.value;

          if (!isDistTag(tag)) {
            continue;
          }

          if (
            (allowedForDependencies.length === 0 ||
              allowedForDependencies.includes(dependencyType as Dependency)) &&
            allowedTags.includes(tag)
          ) {
            continue;
          }

          context.report({
            data: {
              dependencyType,
              tag,
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
        allowedFor: [],
      },
    ],
    docs: {
      description:
        'Restricts dependency dist-tags to an allowed list and selected dependency types.',
    },
    messages: {
      disallowedDistTag:
        'The "{{ tag }}" dist-tag is not allowed for {{ dependencyType }}.',
    },
    schema: [schema],
    type: 'problem',
  },

  name: 'restrict-dist-tags',
});

export { rule, DEPENDENCY_TYPES };
