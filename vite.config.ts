import path from 'path'
import { UserConfig } from 'vite'
import Voie from 'vite-plugin-voie'
import PurgeIcons from 'vite-plugin-purge-icons'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import Shiki from 'markdown-it-shiki'

const alias = {
  '/~/': path.resolve(__dirname, 'src'),
}

const config: UserConfig = {
  alias,
  plugins: [
    Voie({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
    }),

    Markdown({
      wrapperComponent: 'post',
      wrapperClasses: 'markdown m-auto',
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: {
            dark: 'min-dark',
            light: 'min-light',
          },
        })
      },
    }),

    ViteComponents({
      alias,
      extensions: ['vue', 'md'],
      customLoaderMatcher: ctx => ctx.path.endsWith('.md')
    }),

    PurgeIcons(),
  ],
}

export default config
