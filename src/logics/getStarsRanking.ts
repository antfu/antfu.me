export function getStarsRankingUrl() {
  const users = [
    'antfu',
    'codecember',
    'knightly',
    'slidevjs',
    'type-challenges',
    'unocss',
    'vitest-dev',
    'vue-reactivity',
  ]
  const repos = [
    'lokalise/i18n-ally',
    'nuxt/framework',
    'nuxt/modules',
    'nuxt/ui',
    'unjs/unplugin',
    'vitejs/awesome-vite',
    'vitejs/vite',
    'vuejs/composition-api',
    'vueuse/vue-chemistry',
    'vueuse/vue-demi',
    'vueuse/vueuse',
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
