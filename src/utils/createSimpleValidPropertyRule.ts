import type { AST as JsonAST } from "jsonc-eslint-parser";
import type { Result } from "package-json-validator";

import { createRule } from "../createRule.ts";

export type ValidationFunction = (value: unknown) => Result;

/**
 * Given a top-level property name, and a validation function, create a rule that validates the property using the validation function.
 * These rules will always be included in the recommended config.
 * Note: this will only create a basic validation rule, with no options.  If you need
 * to create a more complex rule, create it in its own file.
 */
export const createSimpleValidPropertyRule = (
  propertyName: string,
  validationFunction: ValidationFunction,
  aliases: string[] = [],
) => {
  const ruleName = `valid-${propertyName}`;

  const propertyNames = [propertyName, ...aliases];
  const rule = createRule({
    create(context) {
      const reportIssues = (result: Result, node: JsonAST.JSONNode) => {
        // Early return if there are no errors
        if (result.errorMessages.length === 0) {
          return;
        }

        if (result.issues.length) {
          for (const issue of result.issues) {
            context.report({
              data: {
                error: issue.message,
              },
              messageId: "validationError",
              node,
            });
          }
        }

        const childrenWithIssues = result.childResults.filter(
          (childResult) => childResult.errorMessages.length,
        );
        // If the value is an object, and has child results with issues, then report those too
        if (node.type === "JSONObjectExpression" && childrenWithIssues.length) {
          for (const childResult of childrenWithIssues) {
            const childNode = node.properties[childResult.index];
            reportIssues(childResult, childNode.value);
          }
        }
        // If the value is an array, and has child results with issues, then report those too
        else if (
          node.type === "JSONArrayExpression" &&
          childrenWithIssues.length
        ) {
          for (const childResult of childrenWithIssues) {
            const childNode = node.elements[childResult.index];
            if (childNode) {
              reportIssues(childResult, childNode);
            }
          }
        }
      };

      return propertyNames.reduce<
        Record<string, (node: JsonAST.JSONProperty) => void>
      >((acc, name) => {
        acc[
          `Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=${name}]`
        ] = (node: JsonAST.JSONProperty) => {
          const valueNode = node.value;
          const value: unknown = JSON.parse(
            context.sourceCode.getText(valueNode),
          );

          const result = validationFunction(value);
          reportIssues(result, valueNode);
        };
        return acc;
      }, {});
    },
    meta: {
      docs: {
        category: "Best Practices",
        description: `Enforce that the \`${propertyName}\`${aliases.length ? ` (also ${aliases.map((alias) => `\`${alias}\``).join(", ")})` : ""} property is valid.`,
        recommended: true,
      },
      messages: {
        validationError: `Invalid ${propertyName}: {{ error }}`,
      },
      schema: [],
      type: "problem",
    },
    name: ruleName,
  });

  return {
    rule,
    ruleName,
  };
};
