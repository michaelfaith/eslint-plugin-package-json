import type { AST as JsonAST } from "jsonc-eslint-parser";

import detectIndent from "detect-indent";
import { detectNewlineGraceful } from "detect-newline";
import sortObjectKeys from "sort-object-keys";
import { sortOrder } from "sort-package-json";

import { createRule } from "../createRule.ts";

export const rule = createRule({
  create(context) {
    return {
      "Program:exit"() {
        const { ast, text } = context.sourceCode;

        const { order = "sort-package-json" } = context.options[0] ?? {};

        const requiredOrder = order === "sort-package-json" ? sortOrder : order;

        const json = JSON.parse(text) as Record<string, unknown>;

        const allKeys = Object.keys(json);
        const orderedNonStandardKeys = allKeys
          .filter((key) => !requiredOrder.includes(key))
          .sort();

        const orderedSource = sortObjectKeys(json, [
          ...requiredOrder,
          ...orderedNonStandardKeys,
        ]);
        const orderedKeys = Object.keys(orderedSource);

        const { properties } = ast.body[0].expression;

        for (let i = 0; i < properties.length; i += 1) {
          const property = properties[i].key as JsonAST.JSONStringLiteral;
          const { value } = property;

          if (value === orderedKeys[i]) {
            continue;
          }

          context.report({
            data: {
              property: value,
            },
            fix(fixer) {
              const { indent, type } = detectIndent(text);
              const endCharacters = text.endsWith("\n") ? "\n" : "";
              const newline = detectNewlineGraceful(text);
              let result =
                JSON.stringify(
                  orderedSource,
                  null,
                  type === "tab" ? "\t" : indent,
                ) + endCharacters;
              if (newline === "\r\n") {
                result = result.replace(/\n/g, newline);
              }

              return fixer.replaceText(context.sourceCode.ast, result);
            },
            loc: properties[i].loc,
            messageId: "incorrectOrder",
          });
        }
      },
    };
  },
  meta: {
    defaultOptions: [
      {
        order: "sort-package-json",
      },
    ],
    docs: {
      category: "Stylistic",
      description: "Package properties should be declared in standard order",
    },
    fixable: "code",
    messages: {
      incorrectOrder:
        'Top-level property "{{property}}" is not ordered in the standard way.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          order: {
            anyOf: [
              {
                enum: ["sort-package-json"],
                type: ["string"],
              },
              {
                items: {
                  type: ["string"],
                },
                type: ["array"],
              },
            ],
            description: "Specifies the sorting order of top-level properties.",
          },
        },
        type: "object",
      },
    ],
    type: "layout",
  },
  name: "order-properties",
});
