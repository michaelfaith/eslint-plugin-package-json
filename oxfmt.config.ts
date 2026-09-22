import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: [
    '/.all-contributorsrc',
    '/.husky',
    '/coverage',
    '/dist',
    '**/pnpm-lock.yaml',
    '/CHANGELOG.md',
  ],
  overrides: [{ files: ['.nvmrc'], options: { parser: 'yaml' } }],
  printWidth: 80,
  singleQuote: true,
  sortImports: true,
  sortPackageJson: false,
});
