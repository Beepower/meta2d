import { defineConfig } from 'vitest/config';

/**
 * Vitest config for 11g behavioral test suite.
 * Decision: D-P0-30 (2026-05-02) — test 与 source 同仓 idiomatic;路径 ../meta2d.js/packages/core/tests/behavioral/
 * Reference: docs/refactor-public-api/ 文档体系 (V2 仓库)
 */
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/behavioral/**/*.test.ts'],
    globals: true,
    setupFiles: ['vitest-canvas-mock'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/tooltip/**',
        'src/dialog/**',
        'src/popconfirm/**',
        'src/message/**',
        'src/title/**',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
  },
});
