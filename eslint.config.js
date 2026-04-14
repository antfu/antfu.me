// @ts-check
/* eslint perfectionist/sort-objects: "error" */
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    pnpm: true,
  },
).removeRules(
  'no-labels',
  'no-lone-blocks',
  'no-restricted-syntax',
  'node/prefer-global/buffer',
  'node/prefer-global/process',
  'prefer-rest-params',
  'symbol-description',
  'ts/ban-types',
  'ts/no-empty-object-type',
  'ts/no-invalid-this',
  'ts/no-unnecessary-type-constraint',
  'vue/no-template-shadow',
  'vue/no-v-text-v-html-on-component',
  'e18e/prefer-static-regex',
  'markdown/heading-increment',
  'markdown/require-alt-text',
)
