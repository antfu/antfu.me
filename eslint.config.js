import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-labels': 'off',
    'no-lone-blocks': 'off',
    'no-restricted-syntax': 'off',
    'node/prefer-global/buffer': 'off',
    'node/prefer-global/process': 'off',
    'prefer-rest-params': 'off',
    'symbol-description': 'off',
    'ts/no-invalid-this': 'off',
    'ts/no-unnecessary-type-constraint': 'off',
    'vue/no-template-shadow': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'ts/ban-types': 'off',
  },
})
