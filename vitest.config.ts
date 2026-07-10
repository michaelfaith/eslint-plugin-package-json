import { defineConfig } from 'vitest/config';

export default defineConfig({
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
