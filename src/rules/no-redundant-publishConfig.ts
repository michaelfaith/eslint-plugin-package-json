import type * as ESTree from "estree";
import type { AST as JsonAST } from "jsonc-eslint-parser";

import { fixRemoveObjectProperty } from "eslint-fix-utils";

import { createRule } from "../createRule.ts";
import { isJSONStringLiteral } from "../utils/predicates.ts";

export const rule = createRule({
  create(context) {
    let packageName: string | undefined;
    let publishConfigAccessProperty: JsonAST.JSONProperty | undefined;

    return {
      "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=name]"(
        node: JsonAST.JSONProperty,
      ) {
        if (isJSONStringLiteral(node.value)) {
          packageName = node.value.value;
        }
      },
      "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=publishConfig]"(
        node: JsonAST.JSONProperty,
      ) {
        if (node.value.type !== "JSONObjectExpression") {
          return;
        }

        for (const property of node.value.properties) {
          if (
            isJSONStringLiteral(property.key) &&
            property.key.value === "access"
          ) {
            publishConfigAccessProperty = property;
            break;
          }
        }
      },
      "Program:exit"() {
        if (!packageName || !publishConfigAccessProperty) {
          return;
        }

        const isScopedPackage = packageName.startsWith("@");

        if (!isScopedPackage) {
          context.report({
            messageId: "redundantAccess",
            node: publishConfigAccessProperty,
            suggest: [
              {
                fix: fixRemoveObjectProperty(
                  context,
                  publishConfigAccessProperty as unknown as ESTree.Property,
                ),
                messageId: "removeAccess",
              },
            ],
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Warns when publishConfig.access is used in unscoped packages.",
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      redundantAccess:
        "'publishConfig.access' is redundant for unscoped packages - they are always public.",
      removeAccess: "Remove the redundant 'access' field.",
    },
    schema: [],
    type: "suggestion",
  },
  name: "no-redundant-publishConfig",
});
