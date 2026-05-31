import jsonPlugin from '@eslint/json';
import packageJson from 'eslint-plugin-package-json/experimental';
import { defineConfig } from 'eslint/config';

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
