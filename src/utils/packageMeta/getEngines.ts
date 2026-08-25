import { createStringMapFromObj } from '../createStringMapFromObj.ts';
import { isPackageMeta } from './PackageMeta.ts';

/**
 * Get the engines from a given package.json.
 */
export const getEngines = (meta: unknown): Map<string, string> => {
  if (!isPackageMeta(meta)) {
    return new Map<string, string>();
  }
  return createStringMapFromObj(meta.engines);
};
