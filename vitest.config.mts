import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const site = fileURLToPath(new URL('./site', import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: { alias: { '@': site } },
        test: {
          name: 'site',
          root: site,
          environment: 'jsdom',
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['node_modules/**', 'e2e/**', 'out/**', '.next/**'],
          setupFiles: ['./tests/setup.ts'],
        },
      },
      {
        test: {
          name: 'infra',
          root: fileURLToPath(new URL('./infra', import.meta.url)),
          environment: 'node',
          include: ['test/**/*.test.ts'],
          testTimeout: 60_000,
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: [
        'site/{content,lib,components,scripts}/**/*.{ts,tsx,mjs}',
        'infra/{lib,functions}/**/*.{ts,js}',
      ],
      exclude: ['**/*.test.*', 'site/scripts/serve-out.mjs', 'site/scripts/csp-hashes.mjs'],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
      reporter: ['text-summary', 'html'],
    },
  },
});
