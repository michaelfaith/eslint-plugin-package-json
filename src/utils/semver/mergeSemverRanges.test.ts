import { Range } from 'semver';
import { describe, expect, it } from 'vitest';

import { mergeSemverRanges } from './mergeSemverRanges.ts';

const createRange = (range: string) => new Range(range);

describe(mergeSemverRanges, () => {
  it('should return an empty range when no ranges are provided', () => {
    expect(mergeSemverRanges()?.range).toBe('');
  });

  it('should return a canonical copy of a single range', () => {
    expect(mergeSemverRanges(createRange('^1.2.3'))?.range).toBe(
      '>=1.2.3 <2.0.0-0',
    );
  });

  it('should remove duplicate ranges', () => {
    expect(
      mergeSemverRanges(
        createRange('1.2.3'),
        createRange('1.2.3'),
        createRange('1.2.3'),
      )?.range,
    ).toBe('1.2.3');
  });

  it('should remove equivalent ranges', () => {
    expect(
      mergeSemverRanges(createRange('^1.2.3'), createRange('>=1.2.3 <2.0.0'))
        ?.range,
    ).toBe('>=1.2.3 <2.0.0');
  });

  it('should keep the broader range when one range contains another', () => {
    expect(
      mergeSemverRanges(createRange('>=1.0.0 <3.0.0'), createRange('^2.0.0'))
        ?.range,
    ).toBe('>=1.0.0 <3.0.0');
  });

  it('should merge overlapping bounded ranges', () => {
    expect(
      mergeSemverRanges(
        createRange('>=1.0.0 <2.0.0'),
        createRange('>=1.5.0 <3.0.0'),
      )?.range,
    ).toBe('>=1.0.0 <3.0.0');
  });

  it('should merge overlapping ranges with strict lower bounds', () => {
    expect(
      mergeSemverRanges(
        createRange('>1.0.0 <3.0.0'),
        createRange('>=2.0.0 <4.0.0'),
      )?.range,
    ).toBe('>1.0.0 <4.0.0');
  });

  it('should merge ranges when their comparator order differs', () => {
    expect(
      mergeSemverRanges(
        createRange('>=1.0.0 <2.0.0'),
        createRange('<3.0.0 >=1.5.0'),
      )?.range,
    ).toBe('>=1.0.0 <3.0.0');
  });

  it('should merge overlapping lower-bounded ranges', () => {
    expect(
      mergeSemverRanges(createRange('>=1.0.0'), createRange('>=2.0.0'))?.range,
    ).toBe('>=1.0.0');
  });

  it('should merge overlapping upper-bounded ranges', () => {
    expect(
      mergeSemverRanges(createRange('<3.0.0'), createRange('<2.0.0'))?.range,
    ).toBe('<3.0.0');
  });

  it('should preserve disjoint ranges in minimum-version order', () => {
    expect(
      mergeSemverRanges(
        createRange('3.0.0'),
        createRange('>=1.0.0 <2.0.0'),
        createRange('2.5.0'),
      )?.range,
    ).toBe('>=1.0.0 <2.0.0||2.5.0||3.0.0');
  });

  it('should preserve disjoint ranges that have a gap between them', () => {
    expect(
      mergeSemverRanges(
        createRange('>=1.0.0 <2.0.0'),
        createRange('>=2.0.0 <3.0.0'),
      )?.range,
    ).toBe('>=1.0.0 <2.0.0||>=2.0.0 <3.0.0');
  });

  it('should merge caret ranges within a major version', () => {
    expect(
      mergeSemverRanges(createRange('^1.0.0'), createRange('^1.5.0'))?.range,
    ).toBe('>=1.0.0 <2.0.0-0');
  });

  it('should merge tilde ranges within a minor version', () => {
    expect(
      mergeSemverRanges(createRange('~1.2.0'), createRange('~1.2.5'))?.range,
    ).toBe('>=1.2.0 <1.3.0-0');
  });

  it('should keep separate prerelease ranges outside the stable interval', () => {
    expect(
      mergeSemverRanges(
        createRange('>=1.0.0-alpha <1.0.0'),
        createRange('>=1.0.0 <2.0.0'),
      )?.range,
    ).toBe('>=1.0.0-alpha <1.0.0||>=1.0.0 <2.0.0');
  });
});
