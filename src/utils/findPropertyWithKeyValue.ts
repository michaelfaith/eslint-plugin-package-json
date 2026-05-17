import type { AST as JsonAST } from 'jsonc-eslint-parser';

export type JSONPropertyWithKeyAndValue<Value extends string> =
  JsonAST.JSONProperty & {
    key: JsonAST.JSONStringLiteral;
    value: Value;
  };

export function findPropertyWithKeyValue<Value extends string>(
  properties: JsonAST.JSONProperty[],
  value: Value,
) {
  return properties.find(
    (property): property is JSONPropertyWithKeyAndValue<Value> =>
      property.key.type === 'JSONLiteral' && property.key.value === value,
  );
}
