import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

/**
 * Flat ESLint config for the Vite + React frontend.
 *
 * Deliberately narrow: JavaScript correctness and React hook rules only. The project has no
 * TypeScript and no eslint-plugin-react, so JSX prop conventions are not enforced — adding that
 * would be a larger change than the notification work warrants.
 */
export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Fetch-on-mount is the established data-loading idiom in this app (Dashboard, MyListings,
      // AvailableFood, ClaimedFood, Reports, Settings, useNotifications). These two React Compiler
      // diagnostics say the pattern is not auto-memoisable, not that it is wrong, and rewriting
      // eight working pages is out of scope. Kept as warnings so new code is nudged rather than
      // blocked. rules-of-hooks and exhaustive-deps stay errors — those catch real bugs.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      // Fast Refresh is happier when a module exports only components; pages legitimately export
      // both a named and a default component, so those are allowed through.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // RegisterForm drops confirmPassword from the payload on purpose:
          // `const { confirmPassword, ...payload } = form`.
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]
