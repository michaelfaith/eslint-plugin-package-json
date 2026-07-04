import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslint from '@eslint/js';
import markdown from '@eslint/markdown';
import vitest from '@vitest/eslint-plugin';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import jsonc from 'eslint-plugin-jsonc';
import n from 'eslint-plugin-n';
import nodeDependencies from 'eslint-plugin-node-dependencies';
import perfectionist from 'eslint-plugin-perfectionist';
import * as regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import yml from 'eslint-plugin-yml';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

import packageJson from './src/index.ts';

const JS_FILES = ['**/*.js'];
const TS_FILES = ['**/*.ts'];
const JS_TS_FILES = [...JS_FILES, ...TS_FILES];

export default defineConfig(
  globalIgnores([
    '**/*.snap',
    'site/.astro',
    '.eslint-doc-generatorrc.js',
    'coverage',
    'e2e',
    'dist-site',
    'docs/rules/*/*.ts',
    'lib',
    'node_modules',
    'pnpm-lock.yaml',
    'src/tests/__fixtures__',
  ]),
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  {
    extends: [
      eslint.configs.recommended,
      comments.recommended,
      eslintPlugin.configs.recommended,
      n.configs['flat/recommended'],
      regexp.configs['flat/recommended'],
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      unicorn.configs.unopinionated,
    ],
    files: JS_TS_FILES,
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'astro.config.ts',
            '.simple-git-hooks.js',
            'knip.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      perfectionist,
    },
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-shadow': 'error',
      'n/no-missing-import': 'off',

      // Stylistic concerns that don't interfere with Prettier
      'logical-assignment-operators': [
        'error',
        'always',
        { enforceForIfStatements: true },
      ],
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'operator-assignment': 'error',

      'perfectionist/sort-exports': 'error',

      // Overly strict
      'unicorn/no-array-reverse': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/require-array-sort-compare': 'off',
    },
    settings: {
      perfectionist: { partitionByComment: true, type: 'natural' },
      vitest: { typecheck: true },
    },
  },
  {
    extends: [
      jsdoc.configs['flat/contents-typescript-error'],
      jsdoc.configs['flat/logical-typescript-error'],
      jsdoc.configs['flat/stylistic-typescript-error'],
    ],
    files: TS_FILES,
  },
  {
    extends: [jsonc.configs['flat/recommended-with-json']],
    files: ['**/*.json', '**/*.jsonc'],
  },
  {
    extends: [packageJson.configs.recommended, packageJson.configs.stylistic],
    files: ['package.json'],
    plugins: {
      'node-dependencies': nodeDependencies,
    },
    rules: {
      'node-dependencies/no-deprecated': ['error', { devDependencies: true }],
    },
  },
  {
    extends: [markdown.configs.recommended],
    files: ['**/*.md'],
    ignores: ['CHANGELOG.md'],
    rules: {
      // https://github.com/eslint/markdown/issues/294
      'markdown/no-missing-label-refs': 'off',
    },
  },
  // Test-only rules
  {
    extends: [vitest.configs.recommended],
    files: ['**/*.test.*'],
    rules: { '@typescript-eslint/no-unsafe-assignment': 'off' },
  },
  {
    extends: [yml.configs.recommended, yml.configs.prettier],
    files: ['**/*.{yml,yaml}'],
    rules: {
      'yml/file-extension': ['error', { extension: 'yml' }],
      'yml/sort-sequence-values': [
        'error',
        { order: { type: 'asc' }, pathPattern: '^.*$' },
      ],
    },
  },
  {
    files: ['pnpm-workspace.yaml'],
    rules: {
      'yml/file-extension': 'off',
      'yml/sort-keys': [
        'error',
        { order: { type: 'asc' }, pathPattern: '^.*$' },
      ],
    },
  },
  {
    files: ['./eslint.config.ts', './**/*.test.*'],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
);
