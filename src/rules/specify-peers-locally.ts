import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates.ts';

export const rule = createRule({
  create(context) {
    const devDependencyNames = new Set<string>();
    let devDependenciesObjectNode: AST.JSONObjectExpression | undefined;
    const peerDependencyMap: Record<string, AST.JSONProperty> = {};

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression][key.value=devDependencies]'(
        node: AST.JSONProperty & {
          value: AST.JSONObjectExpression;
        },
      ) {
        devDependenciesObjectNode = node.value;
        for (const devDependencyPropertyNode of node.value.properties) {
          const dependencyKey = devDependencyPropertyNode.key;
          if (isJSONStringLiteral(dependencyKey)) {
            devDependencyNames.add(dependencyKey.value);
          }
        }
      },
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression][key.value=peerDependencies]'(
        node: AST.JSONProperty & {
          value: AST.JSONObjectExpression;
        },
      ) {
        for (const peerDependencyPropertyNode of node.value.properties) {
          const dependencyKey = peerDependencyPropertyNode.key;
          if (isJSONStringLiteral(dependencyKey)) {
            peerDependencyMap[dependencyKey.value] = peerDependencyPropertyNode;
          }
        }
      },
      'Program:exit'() {
        // Check that every peer dependency name is accounted for in the devDependencies
        for (const [peerDependencyName, peerDependencyNode] of Object.entries(
          peerDependencyMap,
        )) {
          if (!devDependencyNames.has(peerDependencyName)) {
            // If not, report on the peer dependency node, and suggest that it be added to devDependencies
            const peerDependencyValue = peerDependencyNode.value;
            context.report({
              data: {
                name: peerDependencyName,
              },
              messageId: 'devDependencyNotDefined',
              node: peerDependencyNode,
              suggest:
                devDependenciesObjectNode &&
                isJSONStringLiteral(peerDependencyValue)
                  ? [
                      {
                        data: {
                          name: peerDependencyName,
                        },
                        fix: (fixer) => {
                          const currentDevDependencies = JSON.parse(
                            context.sourceCode.getText(
                              devDependenciesObjectNode,
                            ),
                          ) as Record<string, string>;
                          const updatedDevDependencies = {
                            ...currentDevDependencies,
                            [peerDependencyName]: peerDependencyValue.value,
                          };
                          const sortedDevDependencies = Object.fromEntries(
                            Object.entries(updatedDevDependencies).sort(
                              // eslint-disable-next-line unicorn/prefer-simple-sort-comparator
                              (a, b) => (a[0] > b[0] ? 1 : -1),
                            ),
                          );
                          return fixer.replaceText(
                            devDependenciesObjectNode,
                            JSON.stringify(sortedDevDependencies, null, 2)
                              .split('\n')
                              .join('\n  '), // nest indents,
                          );
                        },
                        messageId: 'addToDevDependencies',
                      },
                    ]
                  : [],
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Requires that all peer dependencies are also declared as dev dependencies',
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      addToDevDependencies: 'Add "{{ name }}" to `devDependencies`',
      devDependencyNotDefined:
        'Peer dependency "{{ name }}" is not also declared in `devDependencies`.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'specify-peers-locally',
});
