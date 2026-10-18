import { fixRemoveObjectProperty, type ObjectProperty } from 'eslint-fix-utils';
import type { AST } from 'jsonc-eslint-parser';

import { PROPERTY_ALIASES } from '../constants.ts';
import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

export const rule = createRule({
  create(context) {
    const prefer = context.options[0]?.prefer ?? {};

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression'(node: AST.JSONObjectExpression) {
        const occurrencesByName = Map.groupBy(node.properties, (property) =>
          isJSONStringLiteral(property.key) ? property.key.value : undefined,
        );

        for (const [canonical, alternative] of Object.entries(PROPERTY_ALIASES)) {
          const setting = prefer[canonical] ?? true;
          const preferred = setting === true ? canonical : setting;
          const [canonicalSpelling, alternativeSpelling] = [canonical, alternative].map((name) => ({
            name,
            occurrences: occurrencesByName.get(name) ?? [],
          }));

          if (
            canonicalSpelling.occurrences.length > 0 &&
            alternativeSpelling.occurrences.length > 0
          ) {
            const [reported, other] =
              preferred === alternative
                ? [canonicalSpelling, alternativeSpelling]
                : [alternativeSpelling, canonicalSpelling];

            context.report({
              data: {
                other: other.name,
                present: reported.name,
              },
              messageId: 'bothAliasesPresent',
              node: reported.occurrences[0].key,
              suggest: (preferred === false ? [canonicalSpelling, alternativeSpelling] : [reported])
                .filter(({ occurrences }) => occurrences.length === 1)
                .map(({ name, occurrences }) => ({
                  data: { property: name },
                  fix: fixRemoveObjectProperty(
                    context,
                    occurrences[0] as unknown as ObjectProperty,
                  ),
                  messageId: 'removeProperty',
                })),
            });

            continue;
          }

          if (preferred === false) {
            continue;
          }

          const present =
            canonicalSpelling.occurrences.length > 0 ? canonicalSpelling : alternativeSpelling;
          if (present.occurrences.length === 0 || present.name === preferred) {
            continue;
          }

          const presentProperty = present.occurrences[0];

          context.report({
            data: { preferred, present: present.name },
            ...(present.occurrences.length === 1 && {
              fix: (fixer) => fixer.replaceText(presentProperty.key, JSON.stringify(preferred)),
            }),
            messageId: 'preferAlias',
            node: presentProperty.key,
          });
        }
      },
    };
  },
  meta: {
    defaultOptions: [{}],
    docs: {
      category: 'Best Practices',
      description: 'Enforce a consistent spelling for properties that have a well-known alias.',
      recommended: true,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      bothAliasesPresent: '`{{present}}` is an alias of `{{other}}`; declaring both is redundant.',
      preferAlias: 'Prefer `{{preferred}}` over `{{present}}`.',
      removeProperty: 'Remove `{{property}}`.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          prefer: {
            additionalProperties: false,
            description:
              'Specifies the spelling to enforce for each aliased property. Properties left unspecified keep their default, which is the canonical spelling.',
            properties: Object.fromEntries(
              Object.entries(PROPERTY_ALIASES).map(([canonical, alternative]) => [
                canonical,
                {
                  anyOf: [
                    { type: 'boolean' },
                    {
                      enum: [canonical, alternative],
                      type: 'string',
                    },
                  ],
                  description: `The spelling to enforce (\`${canonical}\` or \`${alternative}\`), \`true\` for the canonical one, or \`false\` to only report using both spellings at once.`,
                } as const,
              ]),
            ),
            type: 'object',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'consistent-property-aliases',
});
