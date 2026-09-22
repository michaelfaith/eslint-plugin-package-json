import detectIndent from 'detect-indent';
import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { increaseIndent } from '../utils/increaseIndent.ts';
import { isJSONStringLiteral } from '../utils/predicates/isJSONStringLiteral.ts';

function isImplicitFormat(node: AST.JSONObjectExpression): boolean {
  // Implicit format = no subpath keys (keys starting with ".")
  // All keys are conditions: import, require, node, default, types, browser
  return node.properties.every(
    (property) => !isJSONStringLiteral(property.key) || !property.key.value.startsWith('.'),
  );
}

export const rule = createRule({
  create(context) {
    let publishConfigExportsValueNode: AST.JSONObjectExpression | AST.JSONStringLiteral | undefined;
    let exportsValueNode: AST.JSONObjectExpression | AST.JSONStringLiteral | undefined;

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=exports]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression' || isJSONStringLiteral(node.value)) {
          exportsValueNode = node.value;
        }
      },
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=publishConfig] > JSONObjectExpression > JSONProperty[key.value=exports]'(
        node: AST.JSONProperty,
      ) {
        if (node.value.type === 'JSONObjectExpression' || isJSONStringLiteral(node.value)) {
          publishConfigExportsValueNode = node.value;
        }
      },
      'Program:exit'() {
        // Prioritize publishConfig, because that's what actually ships if it's there
        // If publishConfig isn't present, then exports is the thing.
        const exportsNode = publishConfigExportsValueNode ?? exportsValueNode;
        if (!exportsNode) {
          return;
        }

        const isPublishConfig = !!publishConfigExportsValueNode;

        const { text } = context.sourceCode;
        const { indent, type } = detectIndent(text);
        const indentUnit = type === 'tab' ? '\t' : indent || '  ';
        const extraIndent = isPublishConfig ? `${indentUnit}${indentUnit}` : indentUnit;

        // If exports is not a collection of subpaths, then we know we don't have a package.json export
        if (isJSONStringLiteral(exportsNode) || isImplicitFormat(exportsNode)) {
          context.report({
            messageId: 'missing',
            node: exportsNode,
            suggest: [
              {
                messageId: 'addExport',
                fix(fixer) {
                  const valueText = context.sourceCode.getText(exportsNode);
                  const fixedValue = increaseIndent(
                    JSON.stringify(
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- JSON.parse required for wrapping
                        '.': JSON.parse(valueText),
                        './package.json': './package.json',
                      },
                      null,
                      indentUnit,
                    ),
                    extraIndent,
                  );
                  return fixer.replaceText(exportsNode, fixedValue);
                },
              },
            ],
          });
          return;
        }

        // Exports is an object, so we need to check for the existence of a `./package.json` subpath
        const isPackageJsonExported = exportsNode.properties.some(
          (property) =>
            isJSONStringLiteral(property.key) && property.key.value === './package.json',
        );
        if (isPackageJsonExported) {
          return;
        }

        context.report({
          messageId: 'missing',
          node: exportsNode,
          suggest: [
            {
              messageId: 'addExport',
              fix(fixer) {
                const valueText = context.sourceCode.getText(exportsNode);
                const existingExports = JSON.parse(valueText) as Record<string, unknown>;

                const fixedValue = increaseIndent(
                  JSON.stringify(
                    {
                      ...existingExports,
                      './package.json': './package.json',
                    },
                    null,
                    indentUnit,
                  ),
                  extraIndent,
                );
                return fixer.replaceText(exportsNode, fixedValue);
              },
            },
          ],
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Ensures that if a package specifies `exports` (or `publishConfig.exports`), an explicit `package.json` export is included.',
    },
    hasSuggestions: true,
    messages: {
      missing: 'An export for the package.json is required, and missing.',
      addExport: 'Add package.json export.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'require-package-json-export',
});
