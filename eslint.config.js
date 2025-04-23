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
      'prettier/prettier': 'error',
      'no-console': 'off',
      'import/no-unresolved': 'error',
      'node/no-missing-require': 'off', // useful in CommonJS
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
