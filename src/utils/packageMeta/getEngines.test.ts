import { describe, expect, it } from 'vitest';

import { getEngines } from './getEngines.ts';

describe(getEngines, () => {
  it('should return a Map when valid engines are present', () => {
    const result = getEngines({
      name: 'package-a',
      engines: { node: '1.2.3', npm: '11.12.13' },
    });
    expect(result.size).toBe(2);
    expect(Array.from(result.keys())).toEqual(['node', 'npm']);
    expect(Array.from(result.values())).toEqual(['1.2.3', '11.12.13']);
  });

  it('should return an empty Map when no engines are present', () => {
    const result = getEngines({ name: 'package-a' });
    expect(result.size).toBe(0);
  });

  it('should return an empty Map when input is empty', () => {
    const result = getEngines({});
    expect(result.size).toBe(0);
  });

  it('should return an empty Map when input is not an object', () => {
    const result = getEngines([]);
    expect(result.size).toBe(0);
  });
});
