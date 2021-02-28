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
import WindiCSS from 'vite-plugin-windicss'
import anchor from 'markdown-it-anchor'
// @ts-expect-error
import markdownAttr from 'markdown-it-link-attributes'
import { slugify } from './scripts/slugify'

import 'prismjs/components/prism-regex'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-xml-doc'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javadoclike'
import 'prismjs/components/prism-javadoc'
import 'prismjs/components/prism-jsdoc'

const config: UserConfig = {
  resolve: {
    alias: [
      { find: '/~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@iconify/iconify',
      'dayjs',
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
      markdownItOptions: {
        quotes: '""\'\'',
      },
      markdownItSetup(md) {
        md.use(Prism)
        md.use(anchor, {
          slugify,
          permalink: true,
          permalinkBefore: true,
          permalinkSymbol: '#',
          permalinkAttrs: () => ({ 'aria-hidden': true }),
        })

        md.use(markdownAttr, {
          pattern: /^https?:/,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
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

    WindiCSS({
      safelist: 'prose prose-sm m-auto',
      preflight: {
        enableAll: true,
      },
    }),
  ],
}

export default config
