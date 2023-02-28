export function getStarsRankingUrl() {
  const users = [
    'antfu',
    'codecember',
    'knightly',
    'slidevjs',
    'type-challenges',
    'unocss',
    'elk-zone',
    'vueuse',
    'vitest-dev',
    'vue-reactivity',
    'vite-pwa',
  ]
  const repos = [
    'lokalise/i18n-ally',
    'nuxt/nuxt',
    'nuxt/modules',
    'nuxt/devtools',
    'unjs/unplugin',
    'unjs/unimport',
    'vitejs/awesome-vite',
    'vitejs/vite',
    'vuejs/composition-api',
    'wenyan-lang/ide',
    'wenyan-lang/wenyan',
    'wenyan-lang/wyg',
    'windicss/vite-plugin-windicss',
  ]

  const query = [
    ...users.map(i => `user:${i}`),
    ...repos.map(i => `repo:${i}`),
  ].join(' ')

  const url = `https://github.com/search?l=&o=desc&s=stars&type=Repositories&q=${encodeURIComponent(query)}`
  return url
}
