import type { KnipConfig } from 'knip';

export default {
  entry: ['src/**/*.test.*'],
  ignoreDependencies: ['@eslint/json'],
  ignoreExportsUsedInFile: { interface: true, type: true },
  ignoreUnresolved: ['^~/'],
  project: ['src/**/*.ts'],
} satisfies KnipConfig;
