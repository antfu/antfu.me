import { resolve } from 'path'
import { UserConfig } from 'vite'
import fs from 'fs-extra'
import Pages from 'vite-plugin-pages'
import PurgeIcons from 'vite-plugin-purge-icons'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import Markdown from 'vite-plugin-md'
import Vue from '@vitejs/plugin-vue'
import Prism from 'markdown-it-prism'
import matter from 'gray-matter'

const config: UserConfig = {
  alias: [
    { find: '/~/', replacement: `${resolve(__dirname, 'src')}/` },
  ],
  optimizeDeps: {
    include: [
      'dayjs/plugin/localizedFormat',
    ],
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Pages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        if (!path.includes('projects.md')) {
          const md = fs.readFileSync(path, 'utf-8')

          const { data } = matter(md)

          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),

    Markdown({
      wrapperComponent: 'post',
      wrapperClasses: 'prose m-auto',
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Prism)
      },
    }),

    ViteComponents({
      extensions: ['vue', 'md'],
      customLoaderMatcher: path => path.endsWith('.md'),
      customComponentResolvers: ViteIconsResolver({
        componentPrefix: '',
      }),
    }),

    PurgeIcons(),
    Icons(),
  ],
}

export default config
