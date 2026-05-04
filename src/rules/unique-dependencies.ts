import type * as ESTree from "estree";
import type { AST as JsonAST } from "jsonc-eslint-parser";

import {
  fixRemoveArrayElement,
  fixRemoveObjectProperty,
} from "eslint-fix-utils";

import { createRule } from "../createRule.ts";
import { isJSONStringLiteral, isNotNullish } from "../utils/predicates.ts";

const dependencyPropertyNames = new Set([
  "bundledDependencies",
  "bundleDependencies",
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "overrides",
  "peerDependencies",
]);

export const rule = createRule({
  create(context) {
    const dependenciesCache: Record<string, JsonAST.JSONProperty[]> = {
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
    };
    const trackForCrossGroupUniqueness = Object.keys(dependenciesCache);

    function check(
      elements: (JsonAST.JSONNode | null)[],
      getNodeToRemove: (element: JsonAST.JSONNode) => JsonAST.JSONNode,
    ) {
      const seen = new Set();

      for (const element of elements
        .filter(isNotNullish)
        .filter(isJSONStringLiteral)
        .reverse()) {
        if (seen.has(element.value)) {
          report(element);
        } else {
          seen.add(element.value);
        }
      }

      function report(node: JsonAST.JSONNode) {
        const removal = getNodeToRemove(node);
        context.report({
          messageId: "overridden",
          node,
          suggest: [
            {
              fix:
                removal.type === "JSONProperty"
                  ? fixRemoveObjectProperty(
                      context,
                      removal as unknown as ESTree.Property,
                    )
                  : fixRemoveArrayElement(
                      context,
                      removal as unknown as ESTree.Expression,
                      elements as unknown as ESTree.ArrayExpression,
                    ),
              messageId: "remove",
            },
          ],
        });
      }
    }

    return {
      "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral]"(
        node: JsonAST.JSONProperty & {
          key: JsonAST.JSONStringLiteral;
        },
      ) {
        if (!dependencyPropertyNames.has(node.key.value)) {
          return;
        }

        const nodeValueType = node.value.type;
        if (nodeValueType === "JSONArrayExpression") {
          check(node.value.elements, (element) => element);
        }
        if (nodeValueType === "JSONObjectExpression") {
          check(
            node.value.properties.map((property) => property.key),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (property) => property.parent!,
          );
          if (trackForCrossGroupUniqueness.includes(node.key.value)) {
            dependenciesCache[node.key.value] = node.value.properties;
          }
        }
      },
      "Program:exit"() {
        // Check our cached elements from `dependencies`, `devDependencies` and `peerDependencies`
        // If any dependencies listed as dev or peer deps, are also in `dependencies`, then those should be flagged as redundant
        const dependencyNames = new Set(
          dependenciesCache.dependencies
            .map((node) => node.key)
            .filter(isJSONStringLiteral)
            .map((dependencyNameNode) => dependencyNameNode.value),
        );
        if (!dependencyNames.size) {
          return;
        }

        for (const dependencyType of ["devDependencies", "peerDependencies"]) {
          const otherDependencies = dependenciesCache[dependencyType];
          for (const otherDependencyNode of otherDependencies) {
            const otherDependencyKey = otherDependencyNode.key;
            if (
              isJSONStringLiteral(otherDependencyKey) &&
              dependencyNames.has(otherDependencyKey.value)
            ) {
              context.report({
                messageId: "crossGroupDuplicate",
                node: otherDependencyNode,
                suggest: [
                  {
                    fix: fixRemoveObjectProperty(
                      context,
                      otherDependencyNode as unknown as ESTree.Property,
                    ),
                    messageId: "remove",
                  },
                ],
              });
            }
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Checks a dependency isn't specified more than once (i.e. in `dependencies` and `devDependencies`)",
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      crossGroupDuplicate:
        'Dependency is also declared in "dependencies" and is redundant',
      overridden: "Dependency is overridden by a duplicate entry later on",
      remove: "Remove this redundant dependency",
    },
    schema: [],
    type: "suggestion",
  },
  name: "unique-dependencies",
});
