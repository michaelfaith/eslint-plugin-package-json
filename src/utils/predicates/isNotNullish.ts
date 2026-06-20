export function isNotNullish<T extends NonNullable<unknown>>(
  value: null | T | undefined,
): value is T {
  return value !== null && value !== undefined;
}
