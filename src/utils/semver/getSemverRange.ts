import { Range } from 'semver';

/**
 * Safely create a semver range from a string.
 */
export function getSemverRange(input: string): Range | null {
  try {
    return new Range(input);
  } catch {
    return null;
  }
}
