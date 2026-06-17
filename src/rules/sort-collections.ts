import detectIndent from 'detect-indent';
import { detectNewlineGraceful } from 'detect-newline';
import type { AST } from 'jsonc-eslint-parser';
import sortPackageJson from 'sort-package-json';

import { createRule } from '../createRule.ts';

const defaultCollections = new Set([
  'config',
  'dependencies',
  'devDependencies',
  'exports',
  'optionalDependencies',
  'overrides',
  'peerDependencies',
  'peerDependenciesMeta',
  'scripts',
]);

export const rule = createRule({
  create(context) {
    const toSort = new Map<string, null | string[]>(
      (context.options[0] ?? Array.from(defaultCollections)).map((entry) =>
        typeof entry === 'string' ? [entry, null] : [entry.key, entry.order],
      ),
    );

    return {
      'JSONProperty:exit'(node) {
        const { key: nodeKey, value: collection } = node;

        if (
          nodeKey.type !== 'JSONLiteral' ||
          collection.type !== 'JSONObjectExpression'
        ) {
          return;
        }

        const keyPartsReversed = [nodeKey.value];
        for (
          let currNode: AST.JSONNode | null | undefined = node.parent;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          currNode;
          currNode = currNode.parent
        ) {
          if (
            currNode.type === 'JSONProperty' &&
            currNode.key.type === 'JSONLiteral'
          ) {
            keyPartsReversed.push(currNode.key.value);
          } else if (currNode.type === 'JSONArrayExpression') {
            return;
          }
        }
        const key = keyPartsReversed.reverse().join('.');
        // `undefined` means the key isn't configured for sorting; `null` means
        // sort it the default way; an array is a custom order.
        const customOrder = toSort.get(key);
        if (customOrder === undefined) {
          return;
        }

        const currentOrder = collection.properties;

        const isScripts = keyPartsReversed.at(-1) === 'scripts';

        // The "natural" order for keys not pinned by a custom order: `scripts`
        // are lifecycle-aware (via `sort-package-json`), everything else is
        // lexicographical.
        let naturalCompare: (a: string, b: string) => number;
        if (isScripts) {
          const scriptsSource = context.sourceCode.getText(node);
          const minimalJson = JSON.parse(`{${scriptsSource}}`) as {
            scripts: Record<string, unknown>;
          };
          const { scripts: sortedScripts } = sortPackageJson(minimalJson);
          const lifecycleIndex = new Map(
            Object.keys(sortedScripts).map((k, i) => [k, i]),
          );
          naturalCompare = (a, b) =>
            (lifecycleIndex.get(a) ?? 0) - (lifecycleIndex.get(b) ?? 0);
        } else {
          naturalCompare = (a, b) => (a > b ? 1 : -1);
        }

        // Custom order (if any) takes precedence; keys not listed in it fall
        // back to the natural order above (lifecycle-aware for `scripts`).
        const orderIndex = new Map((customOrder ?? []).map((k, i) => [k, i]));
        const rank = (k: string) => orderIndex.get(k) ?? orderIndex.size;

        const desiredOrder = currentOrder.toSorted((a, b) => {
          const aKey = (a.key as AST.JSONStringLiteral).value;
          const bKey = (b.key as AST.JSONStringLiteral).value;
          const ai = rank(aKey);
          const bi = rank(bKey);

          if (ai !== bi) {
            return ai - bi;
          }

          return naturalCompare(aKey, bKey);
        });

        if (currentOrder.some((property, i) => desiredOrder[i] !== property)) {
          context.report({
            data: {
              key,
            },
            fix(fixer) {
              const { text } = context.sourceCode;
              const { indent, type } = detectIndent(text);
              const newline = detectNewlineGraceful(text);
              const indentUnit = type === 'tab' ? '\t' : indent || '  ';

              const replacementJson = JSON.stringify(
                desiredOrder.reduce<Record<string, unknown>>(
                  (out, property) => {
                    out[(property.key as AST.JSONStringLiteral).value] =
                      JSON.parse(context.sourceCode.getText(property.value));
                    return out;
                  },
                  {},
                ),
                null,
                indentUnit,
              );

              const jsonLines = replacementJson.split('\n');

              const collectionStartLine = collection.loc.start.line;
              const lineText =
                context.sourceCode.lines[collectionStartLine - 1];
              const leadingWhitespaceMatch = /^\s*/.exec(lineText);
              const leadingWhitespace = leadingWhitespaceMatch
                ? leadingWhitespaceMatch[0]
                : '';

              const result = jsonLines
                .map((l, i) => (i === 0 ? l : leadingWhitespace + l))
                .join(newline);

              return fixer.replaceText(collection, result);
            },
            loc: collection.loc,
            messageId: customOrder
              ? 'unsortedOrder'
              : isScripts
                ? 'unsortedScripts'
                : 'unsortedKeys',
            node,
          });
        }
      },
    };
  },
  meta: {
    defaultOptions: [Array.from(defaultCollections)],
    docs: {
      category: 'Best Practices',
      description:
        'Selected collections must be in a consistent order (lexicographical for most; lifecycle-aware for scripts).',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      unsortedKeys: "Entries in '{{ key }}' are not in lexicographical order",
      unsortedOrder: "Entries in '{{ key }}' are not in the specified order",
      unsortedScripts:
        "Entries in 'scripts' are not in lexicographical order and grouped by lifecycles",
    },
    schema: [
      {
        description:
          'Array of package properties to require sorting. Provide a string to sort that collection lexicographically (lifecycle-aware for `scripts`), or an object to sort it by a specified order.',
        items: {
          anyOf: [
            {
              type: 'string',
            },
            {
              additionalProperties: false,
              properties: {
                key: {
                  description: 'The collection property to sort.',
                  type: 'string',
                },
                order: {
                  description:
                    'The order to sort the collection by. Keys not listed are appended in lexicographical order.',
                  items: {
                    type: 'string',
                  },
                  type: 'array',
                  uniqueItems: true,
                },
              },
              required: ['key', 'order'],
              type: 'object',
            },
          ],
        },
        type: 'array',
      },
    ],
    type: 'layout',
  },
  name: 'sort-collections',
});
