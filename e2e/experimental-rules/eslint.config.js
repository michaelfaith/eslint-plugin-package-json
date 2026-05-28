import packageJson from 'eslint-plugin-package-json/experimental';
import { defineConfig } from 'eslint/config';
import jsonPlugin from '@eslint/json';

export default defineConfig([
  {
    plugins: {
      json: jsonPlugin,
      'package-json': packageJson,
    },
  },
  {
    files: ['package.json'],
    language: 'json/json',
    rules: {
      'package-json/require-attribution': [
        'error',
        { preferContributorsOnly: true },
      ],
    },
  },
]);
