export const isPackageJson = (filePath: string) =>
  /(?:^|[/\\])package.json$/.test(filePath);
