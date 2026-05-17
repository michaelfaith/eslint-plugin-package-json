import { describe, expect, it } from 'vitest';

import { formatErrors } from './formatErrors.ts';

describe('formatErrors', () => {
  it('should return the single error string as-is when only one error is present', () => {
    expect(formatErrors(['Only one error'])).toBe('Only one error');
  });

  it('should format multiple errors as a list with correct formatting', () => {
    expect(formatErrors(['Error 1', 'Error 2', 'Error 3'])).toBe(
      '\n - Error 1\n - Error 2\n - Error 3',
    );
  });

  it('should return an empty string when given an empty array', () => {
    expect(formatErrors([])).toBe('');
  });

  it('should handle an array with an empty string', () => {
    expect(formatErrors([''])).toBe('');
  });

  it('should handle multiple empty strings', () => {
    expect(formatErrors(['', ''])).toBe('\n - \n - ');
  });

  it('should preserve leading and trailing whitespace in error messages', () => {
    expect(formatErrors(['  error 1  ', 'error 2\n', '\terror 3'])).toBe(
      '\n -   error 1  \n - error 2\n\n - \terror 3',
    );
  });
});
