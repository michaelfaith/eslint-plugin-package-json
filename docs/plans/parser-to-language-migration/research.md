# Research

Documenting notes that will aide in defining a migration path.

## AST Node Comparison

| `jsonc-eslint-parser`   | `momoa`            | Note                                                                                                                                                                                           |
| ----------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSONProgram             | DocumentNode       | root                                                                                                                                                                                           |
|                         | ContainerNode      | Any node that represents the container for a JSON value (`DocumentNode \| MemberNode \| ElementNode`)                                                                                          |
| JSONExpressionStatement |                    |                                                                                                                                                                                                |
| JSONExpression          | ValueNode          | Abstraction for other \*Expression types / Abstraction for all types that can be used as the value of a property or element in an array                                                        |
| JSONIdentifier          | IdentifierNode     | Abstraction for other\*Indentifier types                                                                                                                                                       |
| JSONLiteral             | LiteralNode        | Abstraction for other \*Literal types                                                                                                                                                          |
| JSONTemplateLiteral     |                    |                                                                                                                                                                                                |
| JSONTemplateElement     |                    |                                                                                                                                                                                                |
| JSONArrayExpression     | ArrayNode          | `elements: JSONExpression[]` / `elements: ElementNode[]`                                                                                                                                       |
|                         | ElementNode        |                                                                                                                                                                                                |
| JSONObjectExpression    | ObjectNode         | `properties: JSONProperty[]` / `members: MemberNode[]`                                                                                                                                         |
| JSONProperty            | MemberNode         |                                                                                                                                                                                                |
| JSONLiteral             |                    |                                                                                                                                                                                                |
| JSONUnaryExpression     |                    |                                                                                                                                                                                                |
| JSONNumberIdentifier    |                    | Only used for `Infinity` and `NaN`                                                                                                                                                             |
|                         | NaNNode            |                                                                                                                                                                                                |
|                         | InfinityNode       |                                                                                                                                                                                                |
| JSONUndefinedIdentifier |                    |                                                                                                                                                                                                |
| JSONBinaryExpression    |                    |                                                                                                                                                                                                |
| JSONStringLiteral       | StringNode         | `value: string`                                                                                                                                                                                |
| JSONNumberLiteral       | NumberNode         | `value: number`                                                                                                                                                                                |
| JSONKeywordLiteral      |                    | `value: boolean \| null`                                                                                                                                                                       |
|                         | BooleanNode        | `value: boolean`                                                                                                                                                                               |
|                         | NullNode           |                                                                                                                                                                                                |
| JSONRegExpLiteral       |                    | `value: null`; `regex: {pattern: string, flags: string}`                                                                                                                                       |
| JSONBigIntLiteral       |                    | `value: null`; `bigint: string`                                                                                                                                                                |
|                         | JSON5ExtensionNode | `NaNNode \| InfinityNode \| IdentifierNode`                                                                                                                                                    |
| JSONNode                | AnyNode            | `JSONProgram \| JSONExpressionStatement \| JSONExpression \| JSONProperty \| JSONIdentifier \| JSONTemplateLiteral \| JSONTemplateElement`/ `ValueNode \| ContainerNode \| JSON5ExtensionNode` |

### References

- `jsonc-eslint-parser`: https://github.com/ota-meshi/jsonc-eslint-parser/blob/master/src/parser/ast.ts
- `momoa`: https://github.com/humanwhocodes/momoa/blob/main/js/src/typedefs.ts

## Rule Authoring Comparison

It's unclear if the string query method for visitor matching will work here.
If not, we'll need to rework the node resolution logic.

### Example

```ts
create(context) {
  return {
    Document(node) {
      const { type } = node.body;
      if (type !== "Object" && type !== "Array") {
        context.report({
          loc: node.loc,
          messageId: "topLevel",
          data: { type },
        });
      }
    },
  };
}
```

## Tooling Options

`eslint-json-compat-utils` has helper functions to wrap a rule, plugin, or create function that was written for `jsonc-eslint-parser` and returns a version that works with `@eslint/json`.
h/t @ota-meshi

- `toCompatRule(rule)`
- `toCompatPlugin(plugin)`
- `toCompatCreate(create)`

### Example

```ts
import { toCompatRule } from 'eslint-json-compat-utils';

export default toCompatRule({
  meta: {/* ... */},
  create(context) {
    return {
      JSONArrayExpression: check,
    };
  },
});
```

### References

- `eslint-json-compat-utils`: https://www.npmjs.com/package/eslint-json-compat-utils

## Compatibility

`@eslint/json`'s minimum supported version of `eslint` is `9.15.0`, which is higher than our current minimum supported version.
This means we won't be able to completely adopt the package until our next major version at the earliest.
