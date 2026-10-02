import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/**/*.test.*'],
  ignoreDependencies: ['@eslint/json'],
  ignoreExportsUsedInFile: { interface: true, type: true },
  ignoreUnresolved: ['^~/'],
  project: ['src/**/*.ts'],
};

export default config;
