import path from 'node:path';
import { sep as posixSep } from 'node:path/posix';

import { findRootSync } from '@altano/repository-tools';
import type { AST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { findPropertyWithKeyValue } from '../utils/findPropertyWithKeyValue.ts';

/**
 * Checks if the child path appears at the end of the parent path.
 * @example '/a/b/c', 'c' => true
 * @example '/a/b/c', 'b/c' => true
 * @example '/a/b/c', 'b' => false
 * @example '/a/b/c', 'd' => false
 */
const pathEndsWith = (parent: string, child: string): boolean => {
  if (parent === child) {
    // the directory specified was the full, absolute path to the
    // package.json
    return true;
  }

  const segments = parent.split(path.sep);

  // work backwards from the end, adding another path segment to each check
  let pathToCheck = '';
  return segments.reverse().some((segment) => {
    pathToCheck = path.join(segment, pathToCheck);
    if (pathToCheck === child) {
      return true;
    }
  });
};

let repoRootCache: null | string = null;

export const rule = createRule({
  create(context) {
    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.value=repository][value.type=JSONObjectExpression]'(
        node: AST.JSONProperty & {
          value: AST.JSONObjectExpression;
        },
      ) {
        const directoryProperty = findPropertyWithKeyValue(
          node.value.properties,
          'directory',
        );
        if (
          directoryProperty?.value.type !== 'JSONLiteral' ||
          typeof directoryProperty.value.value !== 'string'
        ) {
          return;
        }

        const directoryValue = directoryProperty.value.value;
        const fileDirectory = path.normalize(path.dirname(context.filename));
        let repositoryRoot;
        if (repoRootCache && fileDirectory.startsWith(repoRootCache)) {
          repositoryRoot = repoRootCache;
        } else {
          repositoryRoot = findRootSync(fileDirectory);
          if (repositoryRoot) {
            repoRootCache = path.normalize(repositoryRoot);
          }
        }

        if (repositoryRoot) {
          // Get the relative path from repository root to
          // package.json. For example:
          //
          //   Simple case (root package.json):
          //     repositoryRoot: '~/src/project'
          //     filename: '~/src/project/package.json',
          //     fileDirectory: '~/src/project',
          //     expected: '' (directory should be undefined or empty)
          //
          //   Monorepo case (nested package.json):
          //     repositoryRoot: '~/src/project'
          //     filename: '~/src/project/packages/packageA/package.json',
          //     fileDirectory: '~/src/project/packages/packageA',
          //     expected: 'packages/packageA'
          //
          const expected = path
            .relative(repositoryRoot, fileDirectory)
            .replaceAll(path.sep, posixSep);
          if (expected !== directoryValue) {
            context.report({
              messageId: 'mismatched',
              node: directoryProperty.value,
              suggest: [
                {
                  data: { expected },
                  fix(fixer) {
                    return fixer.replaceText(
                      directoryProperty.value,
                      `"${expected}"`,
                    );
                  },
                  messageId: 'replace',
                },
              ],
            });
          }
        } else {
          // Since we couldn't determine the repository root, we can't
          // rigorously determine the validity of the directory value.
          // But, we can at least make sure the directory value
          // appears at the end of the package.json file path. For
          // example:
          //
          //   if /a/b/c/package.json has the value: directory: "b/c"
          //   it will validate
          //
          //   if /a/b/c/package.json has the value: directory: "b/d"
          //   it will NOT validate
          //
          // This ensures that the directory value is at least
          // partially correct.
          if (!pathEndsWith(fileDirectory, path.normalize(directoryValue))) {
            context.report({
              messageId: 'mismatched',
              node: directoryProperty.value,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Enforce that if repository directory is specified, it matches the path to the package.json file',
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      mismatched: 'Directory does not match package.json directory.',
      replace: "Replace with '{{ expected }}'.",
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'valid-repository-directory',
});
