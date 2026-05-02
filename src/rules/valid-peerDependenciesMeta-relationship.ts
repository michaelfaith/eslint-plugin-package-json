import type { AST as JsonAST } from "jsonc-eslint-parser";

import { fixRemoveObjectProperty } from "eslint-fix-utils";
import * as ESTree from "estree";

import { createRule } from "../createRule.ts";
import { isJSONStringLiteral } from "../utils/predicates.ts";

export const rule = createRule({
  create(context) {
    const peerDependencies = new Set<string>();
    const peerDependenciesMeta = new Map<string, JsonAST.JSONProperty>();

    return {
      "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=peerDependencies]"(
        node: JsonAST.JSONProperty,
      ) {
        if (node.value.type === "JSONObjectExpression") {
          for (const property of node.value.properties) {
            if (isJSONStringLiteral(property.key)) {
              peerDependencies.add(property.key.value);
            }
          }
        }
      },
      "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=peerDependenciesMeta]"(
        node: JsonAST.JSONProperty,
      ) {
        if (node.value.type === "JSONObjectExpression") {
          for (const property of node.value.properties) {
            if (isJSONStringLiteral(property.key)) {
              peerDependenciesMeta.set(property.key.value, property);
            }
          }
        }
      },
      "Program:exit"() {
        for (const [dependencyName, propertyNode] of peerDependenciesMeta) {
          if (!peerDependencies.has(dependencyName)) {
            context.report({
              data: { dependencyName },
              messageId: "unnecessaryPeerDependency",
              node: propertyNode,
              suggest: [
                {
                  fix: fixRemoveObjectProperty(
                    context,
                    propertyNode as unknown as ESTree.Property,
                  ),
                  messageId: "removePeerDependencyMeta",
                },
              ],
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Enforces that any dependencies declared in `peerDependenciesMeta` are also defined in the package's `peerDependencies`.",
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      removePeerDependencyMeta: "Remove from `peerDependenciesMeta`.",
      unnecessaryPeerDependency:
        "Dependency '{{ dependencyName }}' is declared in `peerDependenciesMeta` but not in `peerDependencies`.",
    },
    schema: [],
    type: "problem",
  },
  name: "valid-peerDependenciesMeta-relationship",
});
