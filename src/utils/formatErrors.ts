/**
 * Formats an array of error messages into a single string.
 * When there is more than one error, the errors will be formatted as a list,
 * starting on a new line.
 */
export const formatErrors = (errors: string[]): string => {
  if (errors.length === 0) {
    return '';
  }
  return errors.length > 1 ? ['', ...errors].join('\n - ') : errors[0];
};
