import type { AST } from 'jsonc-eslint-parser';

export function isJSONNullLiteral(node: AST.JSONNode): boolean {
  return node.type === 'JSONLiteral' && node.value === null;
}
