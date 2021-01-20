import './styles/main.postcss'

import routes from 'vite-plugin-pages/client'
import NProgress from 'nprogress'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import '@purge-icons/generated'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ router, isClient }) => {
    if (isClient) {
      router.beforeEach(() => { NProgress.start() })
      router.afterEach(() => { NProgress.done() })
    }
  },
)
