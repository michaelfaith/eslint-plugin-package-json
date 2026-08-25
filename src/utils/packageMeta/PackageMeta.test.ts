import { describe, expect, it } from 'vitest';

import { isPackageMeta } from './PackageMeta.ts';

describe(isPackageMeta, () => {
  it('should return true when the input is an object', () => {
    expect(isPackageMeta({ name: 'package-a' })).toBe(true);
  });

  it('should return true when the input is an empty object', () => {
    expect(isPackageMeta({})).toBe(true);
  });

  it('should return false when the input is an array', () => {
    expect(isPackageMeta([])).toBe(false);
  });

  it('should return false when the input is null', () => {
    expect(isPackageMeta(null)).toBe(false);
  });

  it('should return false when the input is undefined', () => {
    expect(isPackageMeta(undefined)).toBe(false);
  });

  it('should return false when the input is not an object', () => {
    expect(isPackageMeta(123)).toBe(false);
  });
});
