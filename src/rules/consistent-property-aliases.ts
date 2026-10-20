import type { Rule } from 'eslint';
import type { AST } from 'jsonc-eslint-parser';

import { PROPERTY_ALIASES } from '../constants.ts';
import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

// Unlike `fixRemoveObjectProperty` from `eslint-fix-utils`, removes each run of neighboring
// properties with one comma, so the fixes never overlap
const removeProperties = (fixer: Rule.RuleFixer, properties: readonly AST.JSONProperty[]) => {
  const siblings = properties[0].parent.properties;
  const toRemove = new Set(properties);

  return siblings.flatMap((property, index) => {
    const isRunStart = toRemove.has(property) && !(index > 0 && toRemove.has(siblings[index - 1]));
    if (!isRunStart) {
      return [];
    }

    const nextIndex = siblings.findIndex(
      (sibling, siblingIndex) => siblingIndex > index && !toRemove.has(sibling),
    );
    const runEnd = siblings[(nextIndex === -1 ? siblings.length : nextIndex) - 1];

    return fixer.removeRange(
      nextIndex === -1
        ? [siblings[index - 1].range[1], runEnd.range[1]]
        : [property.range[0], siblings[nextIndex].range[0]],
    );
  });
};

const removalSuggestion = (name: string, properties: readonly AST.JSONProperty[]) => ({
  data: { count: properties.length, property: name },
  fix: (fixer: Rule.RuleFixer) => removeProperties(fixer, properties),
  messageId: properties.length === 1 ? 'removeProperty' : 'removeAllProperties',
});

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

            for (const property of reported.occurrences) {
              context.report({
                data: {
                  other: other.name,
                  present: reported.name,
                },
                messageId: 'bothAliasesPresent',
                node: property.key,
                suggest: [
                  preferred === false ? removalSuggestion(other.name, other.occurrences) : null,
                  removalSuggestion(reported.name, [property]),
                ].filter((v) => v != null),
              });
            }

            continue;
          }

          if (preferred === false) {
            continue;
          }

          const present =
            canonicalSpelling.occurrences.length > 0 ? canonicalSpelling : alternativeSpelling;
          if (present.name === preferred) {
            continue;
          }

          for (const property of present.occurrences) {
            context.report({
              data: { preferred, present: present.name },
              fix: (fixer) => fixer.replaceText(property.key, JSON.stringify(preferred)),
              messageId: 'preferAlias',
              node: property.key,
            });
          }
        }
      },
    };
  },
  meta: {
    defaultOptions: [{}],
    docs: {
      category: 'Best Practices',
      description: 'Enforce a consistent spelling for properties that have a well-known alias.',
      recommended: false,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      bothAliasesPresent: '`{{present}}` is an alias of `{{other}}`; declaring both is redundant.',
      preferAlias: 'Prefer `{{preferred}}` over `{{present}}`.',
      removeAllProperties: 'Remove all {{count}} `{{property}}` properties.',
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
