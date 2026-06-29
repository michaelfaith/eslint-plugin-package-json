import type { JSONNode } from 'jsonc-eslint-parser';

declare module 'estree' {
  interface NodeMap {
    JSONNode: JSONNode;
  }
}
