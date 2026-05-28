import packageJson from 'eslint-plugin-package-json/experimental';
import { defineConfig } from 'eslint/config';
import jsonPlugin from '@eslint/json';

export default defineConfig([
  {
    plugins: {
      json: jsonPlugin,
    },
  },
  {
    extends: [packageJson.configs.recommended, packageJson.configs.stylistic],
    files: ['package.json'],
  },
]);
