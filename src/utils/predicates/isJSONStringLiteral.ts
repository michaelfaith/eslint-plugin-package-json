import type { AST } from 'jsonc-eslint-parser';

export function isJSONStringLiteral(
  node: AST.JSONNode,
): node is AST.JSONStringLiteral {
  return node.type === 'JSONLiteral' && typeof node.value === 'string';
}
