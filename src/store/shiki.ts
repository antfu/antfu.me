import { defineStore } from 'pinia'
import { getHighlighterCore } from 'shiki/core'
import type { HighlighterCore } from 'shiki/core'
import { isDark } from '../logics'

export const useShikiStore = defineStore('pinia', () => {
  const highlighter = shallowRef<HighlighterCore>()
  const theme = computed(() => isDark.value ? 'vitesse-dark' : 'vitesse-light')

  if (typeof window !== 'undefined') {
    getHighlighterCore({
      themes: [
        import('shiki/themes/vitesse-dark.mjs'),
        import('shiki/themes/vitesse-light.mjs'),
      ],
      langs: [
        import('shiki/langs/vue.mjs'),
      ],
      loadWasm: import('shiki/wasm'),
    })
      .then((h) => {
        highlighter.value = h
      })
  }

  return {
    highlighter,
    theme,
  }
})
