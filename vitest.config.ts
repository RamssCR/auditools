import { defineConfig, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.(spec|test).{js,ts}'],
    reporters: process.env.GITHUB_ACTIONS ? ['github-actions'] : ['dot'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'json-summary', 'json', 'lcov'],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
      include: ['src/**/*.test.{js,ts}'],
      exclude: [
        '*.config.*',
        '**/index.ts',
        'src/app.ts',
        '**/*.d.ts',
        'src/models/**',
        'src/plugins/**',
        'src/config/**',
        'src/scripts/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
})
