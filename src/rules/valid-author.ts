import type { Rule } from 'eslint';
import type { AST } from 'jsonc-eslint-parser';
import { validateAuthor, type Result } from 'package-json-validator';

import { createRule } from '../createRule.ts';
import { getGitAuthor } from '../utils/git/index.ts';
import { isJSONStringLiteral } from '../utils/predicates/isJSONStringLiteral.ts';

export const rule = createRule({
  create(context) {
    const createFixer = (
      propertyName: string,
      node: AST.JSONNode,
    ): Rule.ReportFixer | undefined => {
      const author = getGitAuthor();
      if (!author) {
        return undefined;
      }
      let mergedAuthor = author;
      const originalValue: unknown = JSON.parse(
        context.sourceCode.getText(node),
      );
      if (
        originalValue &&
        typeof originalValue === 'object' &&
        !Array.isArray(originalValue)
      ) {
        mergedAuthor = { name: author.name, ...originalValue };
      }

      switch (propertyName) {
        case 'author':
          return (fixer) =>
            fixer.replaceText(
              node,
              JSON.stringify(mergedAuthor, null, 2).split('\n').join('\n  '),
            );
        case 'email':
          return (fixer) =>
            fixer.replaceText(node, JSON.stringify(author.email));
        case 'name':
          return (fixer) =>
            fixer.replaceText(node, JSON.stringify(author.name));
        default:
          return undefined;
      }
    };

    const reportIssues = (
      result: Result,
      node: AST.JSONExpression,
      propertyName?: string,
    ) => {
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
            fix:
              propertyName === undefined
                ? undefined
                : createFixer(propertyName, node),
            messageId: 'validationError',
            node,
          });
        }
      }

      const childrenWithIssues = result.childResults.filter(
        (childResult) => childResult.errorMessages.length,
      );
      // If the value is an object, and has child results with issues, then report those too
      if (node.type === 'JSONObjectExpression' && childrenWithIssues.length) {
        for (const childResult of childrenWithIssues) {
          const childNode = node.properties[childResult.index];
          const childPropertyName = childNode.key;
          reportIssues(
            childResult,
            childNode.value,
            isJSONStringLiteral(childPropertyName)
              ? childPropertyName.value
              : undefined,
          );
        }
      }
    };

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=author]'(
        node: AST.JSONProperty,
      ) {
        const valueNode = node.value;
        const value: unknown = JSON.parse(
          context.sourceCode.getText(valueNode),
        );

        const result = validateAuthor(value);
        reportIssues(result, valueNode, 'author');
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce that the `author` property is valid.',
      recommended: true,
      ruleGroup: 'valid-properties',
    },
    fixable: 'code',
    messages: {
      validationError: `Invalid author: {{ error }}`,
    },
    schema: [],
    type: 'problem',
  },
  name: 'valid-author',
});
