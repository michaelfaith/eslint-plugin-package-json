import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslint from "@eslint/js";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import jsonc from "eslint-plugin-jsonc";
import n from "eslint-plugin-n";
import nodeDependencies from "eslint-plugin-node-dependencies";
import perfectionist from "eslint-plugin-perfectionist";
import * as regexp from "eslint-plugin-regexp";
import unicorn from "eslint-plugin-unicorn";
import yml from "eslint-plugin-yml";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

import packageJson from "./src/index.ts";

const JS_FILES = ["**/*.js"];
const TS_FILES = ["**/*.ts"];
const JS_TS_FILES = [...JS_FILES, ...TS_FILES];

export default defineConfig(
  globalIgnores([
    "**/*.snap",
    "site/.astro",
    ".eslint-doc-generatorrc.js",
    "coverage",
    "dist-site",
    "docs/rules/*/*.ts",
    "lib",
    "node_modules",
    "pnpm-lock.yaml",
    "src/tests/__fixtures__",
  ]),
  { linterOptions: { reportUnusedDisableDirectives: "error" } },
  {
    extends: [
      eslint.configs.recommended,
      comments.recommended,
      eslintPlugin.configs.recommended,
      n.configs["flat/recommended"],
      perfectionist.configs["recommended-natural"],
      regexp.configs["flat/recommended"],
      unicorn.configs.unopinionated,
    ],
    files: JS_TS_FILES,
    rules: {
      "@typescript-eslint/no-shadow": "error",
      // We prefer seeing :exit after all other AST selectors in rules
      "perfectionist/sort-objects": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "Program:exit",
              groupName: "programExit",
            },
          ],
          groups: ["unknown", "programExit"],
          type: "natural",
        },
      ],
      // Stylistic concerns that don't interfere with Prettier
      "logical-assignment-operators": [
        "error",
        "always",
        { enforceForIfStatements: true },
      ],
      "no-useless-rename": "error",
      "object-shorthand": "error",
      "operator-assignment": "error",
      "unicorn/no-array-reverse": "off", // Overly strict
      "unicorn/no-array-sort": "off", // Overly strict
      "unicorn/prefer-string-raw": "off",
      "unicorn/prefer-string-replace-all": "off",
    },
    settings: {
      perfectionist: { partitionByComment: true, type: "natural" },
    },
  },
  {
    extends: [
      jsdoc.configs["flat/contents-typescript-error"],
      jsdoc.configs["flat/logical-typescript-error"],
      jsdoc.configs["flat/stylistic-typescript-error"],
    ],
    files: TS_FILES,
  },
  {
    extends: [jsonc.configs["flat/recommended-with-json"]],
    files: ["**/*.json", "**/*.jsonc"],
  },
  {
    extends: [packageJson.configs["recommended-publishable"]],
    files: ["package.json"],
    plugins: {
      "node-dependencies": nodeDependencies,
    },
    rules: {
      "node-dependencies/no-deprecated": ["error", { devDependencies: true }],
    },
  },
  {
    extends: [markdown.configs.recommended],
    files: ["**/*.md"],
    ignores: ["CHANGELOG.md"],
    rules: {
      // https://github.com/eslint/markdown/issues/294
      "markdown/no-missing-label-refs": "off",
    },
  },
  {
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    files: JS_TS_FILES,
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.js", "astro.config.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "n/no-missing-import": "off",
    },
    settings: {
      vitest: { typecheck: true },
    },
  },
  {
    extends: [vitest.configs.recommended],
    files: ["**/*.test.*"],
    rules: { "@typescript-eslint/no-unsafe-assignment": "off" },
  },
  {
    extends: [yml.configs.recommended, yml.configs.prettier],
    files: ["**/*.{yml,yaml}"],
    rules: {
      "yml/file-extension": ["error", { extension: "yml" }],
      "yml/sort-sequence-values": [
        "error",
        { order: { type: "asc" }, pathPattern: "^.*$" },
      ],
    },
  },
  {
    files: ["pnpm-workspace.yaml"],
    rules: {
      "yml/file-extension": "off",
      "yml/sort-keys": [
        "error",
        { order: { type: "asc" }, pathPattern: "^.*$" },
      ],
    },
  },
  {
    files: ["./eslint.config.ts", "./**/*.test.*"],
    rules: {
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
);
