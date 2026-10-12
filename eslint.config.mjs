import stylistic from '@stylistic/eslint-plugin';

// These three inherited checks have no native Oxlint equivalent.
export default [
  { ignores: ['coverage/**'] },
  {
    files: ['**/*.{js,cjs,mjs}'],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    plugins: { '@stylistic': stylistic },
    rules: {
      'camelcase': ['error', { properties: 'never' }],
      'no-invalid-this': 'error',
      '@stylistic/spaced-comment': ['error', 'always'],
    },
  },
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: { sourceType: 'commonjs' },
  },
];
