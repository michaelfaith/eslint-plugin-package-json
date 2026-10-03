import { defineConfig, type OxfmtConfig } from 'oxfmt';

const config: OxfmtConfig = defineConfig({
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

export default config;
