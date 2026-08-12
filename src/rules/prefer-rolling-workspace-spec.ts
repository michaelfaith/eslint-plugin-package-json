import type { AST } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/isJSONStringLiteral.ts';

const rollingWorkspaceSpecRegex = /^workspace:[*^~]?$/;
const convertibleSpecRegex = /^(workspace:[~^])/;

export const rule = createRule({
  create(context) {
    const { ignoreDependencies = [], ignorePatterns = [] } =
      context.options[0] ?? {};
    const ignoreRegexes = ignorePatterns.map((pattern) => new RegExp(pattern));

    const isIgnored = (name: string) =>
      ignoreDependencies.includes(name) ||
      ignoreRegexes.some((regex) => regex.test(name));

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral]:matches([key.value=dependencies], [key.value=devDependencies])'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression') {
          for (const property of node.value.properties) {
            const keyNode = property.key as AST.JSONStringLiteral;
            const key = keyNode.value;
            if (isIgnored(key)) {
              continue;
            }

            const valueNode = property.value;
            if (
              !isJSONStringLiteral(valueNode) ||
              !valueNode.value.startsWith('workspace:')
            ) {
              continue;
            }

            const dependencySpec = valueNode.value;

            if (!rollingWorkspaceSpecRegex.test(dependencySpec)) {
              let conversion;
              const convertibleMatch =
                convertibleSpecRegex.exec(dependencySpec);
              const rawVersion = dependencySpec.replace('workspace:', '');

              if (convertibleMatch) {
                // workspace:^1.2.3 -> workspace:^ or workspace:~1.2.3 -> workspace:~
                conversion = convertibleMatch[1];
              } else if (semver.parse(rawVersion)) {
                // workspace:1.2.3 -> workspace:*
                conversion = 'workspace:*';
              }

              context.report({
                messageId: 'nonRollingWorkspaceSpec',
                node: valueNode,
                suggest: conversion
                  ? [
                      {
                        fix: (fixer) => {
                          return fixer.replaceText(
                            valueNode,
                            JSON.stringify(conversion),
                          );
                        },
                        messageId: 'convertToRolling',
                      },
                    ]
                  : undefined,
              });
            }
          }
        }
      },
    };
  },
  meta: {
    defaultOptions: [{}],
    docs: {
      category: 'Best Practices',
      description:
        'Require that dependencies declared with workspace protocol use a rolling workspace spec instead of a specific semver range.',
    },
    hasSuggestions: true,
    messages: {
      convertToRolling: 'Convert to rolling workspace spec',
      nonRollingWorkspaceSpec:
        'Workspace spec should not include specific semver range. Use a rolling workspace spec instead.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          ignoreDependencies: {
            items: {
              type: ['string'],
            },
            type: ['array'],
            description: 'Specific dependencies to ignore.',
          },
          ignorePatterns: {
            items: {
              type: ['string'],
            },
            type: ['array'],
            description: 'Regex patterns for dependency names to ignore.',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'prefer-rolling-workspace-spec',
});
