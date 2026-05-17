import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      exclude: ['lib', 'src/index.ts', 'src/rules/index.ts', 'src/tests'],
      include: ['src'],
      reporter: ['html', 'lcov', 'text'],
    },
    exclude: ['lib', 'node_modules'],
    setupFiles: ['console-fail-test/setup'],
  },
});
