import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/cdk.out/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/next-env.d.ts',
    ],
  },

  // Site: Next.js + React hooks + a11y (next already registers the jsx-a11y plugin; add its strict rules).
  ...nextVitals.map((config) => ({
    ...config,
    files: ['site/**/*.{ts,tsx,js,mjs}'],
    settings: { ...config.settings, next: { rootDir: 'site/' } },
  })),
  ...nextTs.map((config) => ({ ...config, files: ['site/**/*.{ts,tsx}'] })),
  {
    files: ['site/**/*.{ts,tsx}'],
    rules: jsxA11y.flatConfigs.strict.rules,
  },

  // Type-aware TypeScript rules everywhere.
  {
    files: ['**/*.{ts,tsx,mts}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/e2e/**', '**/tests/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['**/*.config.{ts,mts,mjs}', 'eslint.config.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Plain JS: Node scripts and the CloudFront Function (ES5-style, CommonJS export for tests).
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['infra/functions/**/*.js'],
    languageOptions: { sourceType: 'script' },
    rules: { 'no-var': 'off', 'no-unused-vars': ['error', { varsIgnorePattern: '^handler$' }] },
  },
);
