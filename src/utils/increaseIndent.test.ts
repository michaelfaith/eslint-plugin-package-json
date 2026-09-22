import { describe, expect, it } from 'vitest';

import { increaseIndent } from './increaseIndent.ts';

describe(increaseIndent, () => {
  it('should leave a single-line string unchanged', () => {
    expect(increaseIndent('hello', '  ')).toBe('hello');
  });

  it('should add the additional indentation to every line after the first', () => {
    expect(increaseIndent('first\nsecond\nthird', '  ')).toBe(
      'first\n  second\n  third',
    );
  });

  it('should preserve empty lines while indenting them', () => {
    expect(increaseIndent('first\n\nthird', '> ')).toBe('first\n> \n> third');
  });

  it('should indent a trailing empty line', () => {
    expect(increaseIndent('first\n', '  ')).toBe('first\n  ');
  });

  it('should return the empty string unchanged', () => {
    expect(increaseIndent('', '  ')).toBe('');
  });

  it('should handle an empty additional string without changing the content', () => {
    expect(increaseIndent('first\nsecond\nthird', '')).toBe(
      'first\nsecond\nthird',
    );
  });

  it('should preserve leading and trailing whitespace in each line', () => {
    expect(increaseIndent('  first  \n\tsecond\t', '-> ')).toBe(
      '  first  \n-> \tsecond\t',
    );
  });

  it('should support multi-character indentation', () => {
    expect(increaseIndent('first\nsecond', '\t  ')).toBe('first\n\t  second');
  });

  it('should preserve carriage returns in CRLF input', () => {
    expect(increaseIndent('first\r\nsecond\r\nthird', '  ')).toBe(
      'first\r\n  second\r\n  third',
    );
  });
});
