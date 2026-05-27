import packageJson from 'eslint-plugin-package-json/experimental';
import { defineConfig } from 'eslint/config';
import * as parserJsonc from 'jsonc-eslint-parser';

export default defineConfig({
  files: ['package.json'],
  languageOptions: {
    parser: parserJsonc,
  },
  plugins: {
    'package-json': packageJson,
  },
  rules: {
    'package-json/require-attribution': [
      'error',
      { preferContributorsOnly: true },
    ],
  },
});
