import { defineConfig, type ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      exclude: ['dist', 'src/index.ts', 'src/rules/index.ts', 'src/tests'],
      include: ['src'],
      reporter: ['html', 'lcov', 'text'],
    },
    exclude: ['dist', 'e2e', 'node_modules'],
    setupFiles: ['console-fail-test/setup'],
  },
});

export default config;
