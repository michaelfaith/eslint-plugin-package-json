import { Range } from 'semver';
import { describe, expect, it } from 'vitest';

import { getSemverRange } from './getSemverRange.ts';

describe(getSemverRange, () => {
  describe('valid semver ranges', () => {
    it('should parse exact versions', () => {
      const result = getSemverRange('1.2.3');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('1.2.3');
    });

    it('should parse versions with leading zeros', () => {
      const result = getSemverRange('0.0.0');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('0.0.0');
    });

    it('should parse incomplete version as x-range', () => {
      const result = getSemverRange('1.2');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.0 <1.3.0-0');
    });

    it('should parse single number as major version range', () => {
      const result = getSemverRange('1');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.0.0 <2.0.0-0');
    });

    it('should parse caret ranges', () => {
      const result = getSemverRange('^1.2.3');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3 <2.0.0-0');
    });

    it('should parse tilde ranges', () => {
      const result = getSemverRange('~1.2.3');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3 <1.3.0-0');
    });

    it('should parse greater than or equal ranges', () => {
      const result = getSemverRange('>=1.2.3');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3');
    });

    it('should parse less than ranges', () => {
      const result = getSemverRange('<2.0.0');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('<2.0.0');
    });

    it('should parse greater than ranges', () => {
      const result = getSemverRange('>1.0.0');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>1.0.0');
    });

    it('should parse less than or equal ranges', () => {
      const result = getSemverRange('<=1.2.3');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('<=1.2.3');
    });

    it('should parse compound ranges', () => {
      const result = getSemverRange('>=1.2.3 <2.0.0');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3 <2.0.0');
    });

    it('should parse wildcard versions with x', () => {
      const result = getSemverRange('1.x');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.0.0 <2.0.0-0');
    });

    it('should parse wildcard versions with *', () => {
      const result = getSemverRange('*');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('');
    });

    it('should parse x as wildcard', () => {
      const result = getSemverRange('x');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('');
    });

    it('should parse minor wildcard', () => {
      const result = getSemverRange('1.2.x');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.0 <1.3.0-0');
    });

    it('should parse hyphen ranges', () => {
      const result = getSemverRange('1.2.3 - 1.2.4');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3 <=1.2.4');
    });

    it('should parse double pipe ranges', () => {
      const result = getSemverRange('1.2.3 || 2.0.0');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('1.2.3||2.0.0');
    });

    it('should parse space-separated versions', () => {
      const result = getSemverRange('1.2.3 2.0.0');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('1.2.3 2.0.0');
    });

    it('should parse tilde-greater operator', () => {
      const result = getSemverRange('~>1.2.3');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3 <1.3.0-0');
    });

    it('should parse pre-release versions', () => {
      const result = getSemverRange('1.2.3-alpha');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('1.2.3-alpha');
    });

    it('should parse pre-release with numbers', () => {
      const result = getSemverRange('1.2.3-beta.1');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('1.2.3-beta.1');
    });

    it('should parse versions with build metadata', () => {
      const result = getSemverRange('1.2.3+build.123');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('1.2.3');
    });

    it('should parse caret with pre-release', () => {
      const result = getSemverRange('^1.2.3-alpha');
      expect(result).toBeInstanceOf(Range);
      expect(result?.range).toBe('>=1.2.3-alpha <2.0.0-0');
    });
  });

  describe('invalid semver ranges', () => {
    it('should return null for non-numeric versions', () => {
      const result = getSemverRange('invalid');
      expect(result).toBeNull();
    });

    it('should return null for negative versions', () => {
      const result = getSemverRange('-1.2.3');
      expect(result).toBeNull();
    });

    it('should return null for alphabetic characters mixed with numbers', () => {
      const result = getSemverRange('1a.2b.3c');
      expect(result).toBeNull();
    });

    it('should return null for random text', () => {
      const result = getSemverRange('not a version');
      expect(result).toBeNull();
    });

    it('should return null for version with multiple dots', () => {
      const result = getSemverRange('1.2.3.4');
      expect(result).toBeNull();
    });
  });
});
