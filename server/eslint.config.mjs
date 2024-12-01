import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    {
        languageOptions: {
            globals: { ...globals.browser, process: 'readonly' },
        },
    },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
];
