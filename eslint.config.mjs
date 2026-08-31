import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-console': 'warn',
      'no-alert': 'warn',
      'no-var': 'error',
      eqeqeq: 'error',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['cypress/**/*.cy.js', 'cypress.config.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,   // ger er describe, it, beforeEach, afterEach osv.
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  },
  prettier,
]