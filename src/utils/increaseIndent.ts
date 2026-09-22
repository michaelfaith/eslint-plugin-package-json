export const increaseIndent = (original: string, additional: string): string =>
  original.split('\n').join(`\n${additional}`);
