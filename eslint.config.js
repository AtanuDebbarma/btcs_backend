// @ts-nocheck
const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-plugin-prettier');
const eslintPluginImport = require('eslint-plugin-import');
const eslintPluginNode = require('eslint-plugin-node');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'coverage', 'build', '.env'],

    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script', // CommonJS
      globals: {
        ...globals.node,
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js'],
        },
      },
    },
    plugins: {
      prettier,
      import: eslintPluginImport,
      node: eslintPluginNode,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Code formatting
      'prettier/prettier': 'error',

      // Console and debugging
      'no-console': 'off', // Allow console logs for server logging
      'no-debugger': 'error', // Prevent debugger statements in production

      // Variables and functions
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error', // Catch undefined variables
      'no-redeclare': 'error', // Prevent variable redeclaration

      // Import/Export rules
      'import/no-unresolved': 'error', // Catch missing imports
      'import/no-duplicates': 'error', // Prevent duplicate imports
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'never',
        },
      ],

      // Node.js specific
      'node/no-missing-require': 'off', // Handled by import/no-unresolved
      'node/no-unpublished-require': 'off', // Allow dev dependencies

      // Error prevention
      'no-unreachable': 'error', // Catch unreachable code
      'no-constant-condition': 'error', // Prevent infinite loops
      'no-dupe-keys': 'error', // Prevent duplicate object keys
      'no-duplicate-case': 'error', // Prevent duplicate switch cases
      'no-empty': 'warn', // Warn about empty blocks
      'no-extra-semi': 'error', // Remove extra semicolons

      // Best practices
      eqeqeq: ['error', 'always'], // Require === and !==
      'no-eval': 'error', // Prevent eval() usage
      'no-implied-eval': 'error', // Prevent implied eval
      'no-new-func': 'error', // Prevent Function constructor
      'no-return-assign': 'error', // Prevent assignment in return
      'no-self-compare': 'error', // Prevent comparing variable to itself
      'no-throw-literal': 'error', // Require proper Error objects
      'no-unmodified-loop-condition': 'error', // Prevent infinite loops
      'no-useless-concat': 'error', // Prevent unnecessary string concatenation
      'prefer-const': 'warn', // Prefer const for non-reassigned variables

      // Async/Promise handling
      'no-async-promise-executor': 'error', // Prevent async in Promise constructor
      'no-await-in-loop': 'warn', // Warn about await in loops
      'no-promise-executor-return': 'error', // Prevent return in Promise executor
      'require-atomic-updates': 'error', // Prevent race conditions

      // Security
      'no-new-require': 'error', // Prevent new require()
      'no-path-concat': 'error', // Prevent string concatenation with __dirname
    },
  },
];
