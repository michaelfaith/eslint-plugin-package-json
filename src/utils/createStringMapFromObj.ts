/**
 * Given a regular pojo object, create a string Map from it.
 */
export const createStringMapFromObj = (obj: unknown): Map<string, string> => {
  const map = new Map<string, string>();
  if (typeof obj !== 'object' || !obj || Array.isArray(obj)) {
    return map;
  }

  for (const [key, val] of Object.entries(obj)) {
    if (val != null) {
      map.set(key, String(val));
    }
  }
  return map;
};
