import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from './predicates/index.ts';

export interface CreateRequirePropertyRuleOptions {
  /**
   * The category for this rule.
   */
  category?: 'Publishable' | (string & {});

  /** The value to use when fixing a violation when this property is missing */
  fixValue?: unknown;

  /**
   * The default value of `ignorePrivate` rule option.
   */
  ignorePrivateDefault?: boolean;

  /**
   * Whether the rule should be included in the recommended config.
   */
  isRecommended?: boolean;
}

/**
 * Given a top-level property name, create a rule that requires that property to be present.
 * Optionally, include it in the recommended config.
 * Note: this will only create a basic require rule, with no options.  If you need
 * to create a more complex rule, create it in its own file.
 */
export const createSimpleRequirePropertyRule = (
  propertyName: string,
  {
    category,
    fixValue,
    ignorePrivateDefault = false,
    isRecommended,
  }: CreateRequirePropertyRuleOptions = {},
) => {
  const ruleName = `require-${propertyName}`;
  const rule = createRule({
    create(context) {
      const enforceForPrivate = context.settings.packageJson?.enforceForPrivate;

      const ignorePrivate =
        context.options[0]?.ignorePrivate ??
        (typeof enforceForPrivate === 'boolean'
          ? !enforceForPrivate
          : ignorePrivateDefault);

      return {
        'Program > JSONExpressionStatement > JSONObjectExpression'(
          node: AST.JSONObjectExpression,
        ) {
          if (
            ignorePrivate &&
            node.properties.some(
              (property) =>
                isJSONStringLiteral(property.key) &&
                property.key.value === 'private' &&
                property.value.type === 'JSONLiteral' &&
                property.value.value === true,
            )
          ) {
            return;
          }

          if (
            node.properties.every(
              (property) =>
                !(
                  isJSONStringLiteral(property.key) &&
                  property.key.value === propertyName
                ),
            )
          ) {
            context.report({
              data: { property: propertyName },
              fix:
                fixValue === undefined
                  ? undefined
                  : function* (fixer) {
                      yield fixer.insertTextAfterRange(
                        [0, 1],
                        `\n  "${propertyName}": ${JSON.stringify(fixValue)}`,
                      );
                      yield node.properties.length > 0
                        ? fixer.insertTextAfterRange([0, 1], ',')
                        : fixer.insertTextAfterRange([0, 1], '\n');
                    },
              loc: { column: 0, line: 1 },
              messageId: 'missing',
            });
          }
        },
      };
    },
    meta: {
      docs: {
        category,
        description: `Requires the \`${propertyName}\` property to be present.`,
        recommended: isRecommended,
        ruleGroup: 'require-properties',
      },
      fixable: fixValue === undefined ? undefined : 'code',
      messages: {
        missing: "Property '{{property}}' is required.",
      },
      schema:
        propertyName === 'private'
          ? []
          : [
              {
                additionalProperties: false,
                properties: {
                  ignorePrivate: {
                    default: ignorePrivateDefault,
                    description:
                      "Determines if this rule should be enforced when the package's `private` property is `true`.",
                    type: 'boolean',
                  },
                },
                type: 'object',
              },
            ],
      type: 'suggestion',
    },
    name: ruleName,
  });

  return {
    rule,
    ruleName,
  };
};
