import path from 'path'
import { UserConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import PurgeIcons from 'vite-plugin-purge-icons'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import Vue from '@vitejs/plugin-vue'
import Prism from 'markdown-it-prism'

const config: UserConfig = {
  alias: [
    { find: '/~/', replacement: path.resolve(__dirname, 'src')+'/' },
  ],
  plugins: [
    Vue(),

    Pages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
    }),

    Markdown({
      wrapperComponent: 'post',
      wrapperClasses: 'markdown m-auto',
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Prism)
      },
    }),

    ViteComponents({
      extensions: ['vue', 'md'],
      customLoaderMatcher: path => path.endsWith('.md'),
      customComponentResolvers: ViteIconsResolver({
        componentPrefix: ''
      }),
    }),

    PurgeIcons(),
    Icons(),
  ],
}

export default config
