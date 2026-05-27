import packageJson from 'eslint-plugin-package-json/experimental';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    extends: [packageJson.configs.recommended, packageJson.configs.stylistic],
    files: ['package.json'],
  },
]);
