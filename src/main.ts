import './styles/main.postcss'
import './styles/markdown.postcss'

import autoRoutes from 'vite-plugin-pages/client'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import App from './App.vue'
import 'vite-plugin-purge-icons/generated'

const routes = [
  ...autoRoutes.map(i => ({
    ...i,
    name: `${i.name?.toString()}-html`,
    path: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  })),
  ...autoRoutes,
]

export const createApp = ViteSSG(
  App,
  { routes },
  ({ router, isClient }) => {
    dayjs.extend(LocalizedFormat)

    if (isClient) {
      router.beforeEach(() => { NProgress.start() })
      router.afterEach(() => { NProgress.done() })
    }
  },
)
