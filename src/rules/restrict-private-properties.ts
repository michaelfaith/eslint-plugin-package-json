import type * as ESTree from "estree";
import type { AST as JsonAST } from "jsonc-eslint-parser";

import { fixRemoveObjectProperty } from "eslint-fix-utils";

import { createRule } from "../createRule.ts";
import { isJSONStringLiteral } from "../utils/predicates.ts";

const defaultBlockedProperties = ["files", "publishConfig"];

export const rule = createRule({
  create(context) {
    // codecov:ignore-next-line - V8 instrumentation creates unreachable null branch for optional chaining
    const blockedProperties =
      context.options[0]?.blockedProperties ?? defaultBlockedProperties;

    return {
      "Program > JSONExpressionStatement > JSONObjectExpression"(
        node: JsonAST.JSONObjectExpression,
      ) {
        // Check if this is a private package
        if (
          !node.properties.some(
            (property) =>
              isJSONStringLiteral(property.key) &&
              property.key.value === "private" &&
              property.value.type === "JSONLiteral" &&
              property.value.value === true,
          )
        ) {
          return;
        }

        // Check for blocked properties
        for (const property of node.properties) {
          if (
            isJSONStringLiteral(property.key) &&
            blockedProperties.includes(property.key.value)
          ) {
            const isEmpty =
              (property.value.type === "JSONArrayExpression" &&
                property.value.elements.length === 0) ||
              (property.value.type === "JSONObjectExpression" &&
                property.value.properties.length === 0);

            context.report({
              data: {
                property: property.key.value,
              },
              messageId: "unnecessaryProperty",
              node: property,
              ...(isEmpty
                ? {
                    fix: fixRemoveObjectProperty(
                      context,
                      property as unknown as ESTree.Property,
                    ),
                  }
                : {
                    suggest: [
                      {
                        data: {
                          property: property.key.value,
                        },
                        fix: fixRemoveObjectProperty(
                          context,
                          property as unknown as ESTree.Property,
                        ),
                        messageId: "removePropertySuggestion",
                      },
                    ],
                  }),
            });
          }
        }
      },
    };
  },
  meta: {
    defaultOptions: [{ blockedProperties: defaultBlockedProperties }],
    docs: {
      category: "Best Practices",
      description: "Disallows unnecessary properties in private packages.",
      recommended: false,
    },
    fixable: "code",
    hasSuggestions: true,
    messages: {
      removePropertySuggestion: "Remove the '{{ property }}' field.",
      unnecessaryProperty:
        "The '{{ property }}' field is unnecessary in private packages and can be removed.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          blockedProperties: {
            description:
              "Array of property names to disallow in private packages.",
            items: {
              type: "string",
            },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
  name: "restrict-private-properties",
});
