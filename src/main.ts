import './styles/main.postcss'
import './styles/markdown.postcss'

import routes from 'vite-plugin-pages/client'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import App from './App.vue'
import '@purge-icons/generated'

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
