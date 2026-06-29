export const isPackageJson = (filePath: string): boolean =>
  /(?:^|[/\\])package.json$/.test(filePath);
