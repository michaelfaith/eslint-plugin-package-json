import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: [
    '/.all-contributorsrc',
    '/coverage',
    '/dist',
    '**/pnpm-lock.yaml',
    '/CHANGELOG.md',
  ],
  overrides: [{ files: ['.nvmrc'], options: { parser: 'yaml' } }],
  singleQuote: true,
  sortImports: true,
  sortPackageJson: false,
});
