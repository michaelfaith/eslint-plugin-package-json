import type { AST } from 'jsonc-eslint-parser';

export type JSONPropertyWithKeyAndValue<Value extends string> =
  AST.JSONProperty & {
    key: AST.JSONStringLiteral;
    value: Value;
  };

export function findPropertyWithKeyValue<Value extends string>(
  properties: AST.JSONProperty[],
  value: Value,
) {
  return properties.find(
    (property): property is JSONPropertyWithKeyAndValue<Value> =>
      property.key.type === 'JSONLiteral' && property.key.value === value,
  );
}
