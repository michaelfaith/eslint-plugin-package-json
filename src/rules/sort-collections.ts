import type { AST as JsonAST } from 'jsonc-eslint-parser';
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
          let currNode: JsonAST.JSONNode | null | undefined = node.parent;
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
        let desiredOrder: JsonAST.JSONProperty[];

        const isScripts = keyPartsReversed.at(-1) === 'scripts';

        if (isScripts && !customOrder) {
          // For scripts we'll use `sort-package-json`
          const scriptsSource = context.sourceCode.getText(node);
          const minimalJson = JSON.parse(`{${scriptsSource}}`) as {
            scripts: Record<string, unknown>;
          };
          const { scripts: sortedScripts } = sortPackageJson(minimalJson);

          const propertyNodeMap = Object.fromEntries(
            collection.properties.map((prop) => [
              (prop.key as JsonAST.JSONStringLiteral).value,
              prop,
            ]),
          );

          // Used the scripts object sorted by `sort-package-json` to create the desiredOrder
          desiredOrder = Object.keys(sortedScripts).map(
            (prop) => propertyNodeMap[prop],
          );

          // Otherwise sort by the custom order (if any); keys not listed in it
          // (or every key, when no custom order is given) are appended in
          // lexicographical order.
        } else {
          const orderIndex = new Map((customOrder ?? []).map((k, i) => [k, i]));
          const rank = (k: string) => orderIndex.get(k) ?? orderIndex.size;

          desiredOrder = currentOrder.toSorted((a, b) => {
            const aKey = (a.key as JsonAST.JSONStringLiteral).value;
            const bKey = (b.key as JsonAST.JSONStringLiteral).value;
            const ai = rank(aKey);
            const bi = rank(bKey);

            if (ai !== bi) {
              return ai - bi;
            }

            return aKey > bKey ? 1 : -1;
          });
        }

        if (currentOrder.some((property, i) => desiredOrder[i] !== property)) {
          context.report({
            data: {
              key,
            },
            fix(fixer) {
              return fixer.replaceText(
                collection,
                JSON.stringify(
                  desiredOrder.reduce<Record<string, unknown>>(
                    (out, property) => {
                      out[(property.key as JsonAST.JSONStringLiteral).value] =
                        JSON.parse(context.sourceCode.getText(property.value));
                      return out;
                    },
                    {},
                  ),
                  null,
                  2,
                )
                  .split('\n')
                  .join('\n  '), // nest indents
              );
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
