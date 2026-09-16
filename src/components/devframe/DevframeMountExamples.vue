<script setup lang="ts">
import { ShikiMagicMove } from '@shikijs/magic-move/vue'
import { useShikiStore } from '~/store/shiki'

interface Example {
  id: string
  label: string
  icon?: string
  image?: string
  code: string
}

const examples: Example[] = [

  {
    id: 'nitro',
    label: 'Nitro',
    icon: 'i-unjs-nitro',
    code: `
// routes/__my-tool/[...path].ts
// routes/__my-tool/index.ts
import { defineHandler } from 'nitro'
import { devtools } from '../devtools'

export default defineHandler(event =>
  devtools.handler(event.req),
)`.trim(),
  },
  {
    id: 'hono',
    label: 'Hono',
    icon: 'i-logos-hono',
    code: `
// server.ts
import { Hono } from 'hono'
import { devtools } from './devtools'

const app = new Hono()

app.all(devtools.base + '*', c =>
  devtools.handler(c.req.raw),
)`.trim(),
  },
  {
    id: 'next',
    label: 'Next.js',
    icon: 'i-logos-nextjs-icon',
    code: `
// app/%5F_my-tool/[[...path]]/route.ts
import { devtools } from '@/devtools'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = devtools.handler
export const POST = devtools.handler`.trim(),
  },
  {
    id: 'sveltekit',
    label: 'SvelteKit',
    icon: 'i-logos-svelte-icon',
    code: `
// src/routes/%5F_my-tool/[...path]/+server.ts
import { devtools } from '$lib/devtools'

export const GET = ({ request }) => devtools.handler(request)

export const POST = ({ request }) => devtools.handler(request)`.trim(),
  },
  {
    id: 'vite',
    label: 'Vite',
    icon: 'i-logos-vite-icon dark:i-logos-vite-icon-dark',
    code: `
// my-plugin.ts
import { initDevframe } from 'devframe/initiate'
import devframe from './devframe'

export default {
  configureServer(server) {
    const devtools = initDevframe(devframe, {
      base: '/__my-tool/',
      server: server.httpServer,
    })
    server.middlewares.use(devtools.nodeMiddleware)
  },
}`.trim(),
  },
  {
    id: 'rsbuild',
    label: 'Rsbuild',
    image: '/images/devframe/rsbuild.svg',
    code: `
// rsbuild.config.ts
import { initDevframe } from 'devframe/initiate'
import devframe from './devframe'

export default defineConfig({
  server: {
    setup({ server }) {
      const devtools = initDevframe(devframe, {
        base: '/__my-tool/',
        ws: { sidecar: true },
      })
      server.middlewares.use(devtools.nodeMiddleware)
    },
  },
})`.trim(),
  },
]

const selected = ref<(typeof examples)[number]['id']>('hono')
const current = computed(() => examples.find(example => example.id === selected.value)!)
const shiki = useShikiStore()
</script>

<template>
  <figure
    aria-labelledby="devframe-mount-examples-title"
    class="box-border w-[min(50rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-[#8883] rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 mx-[50%] my-10! shadow-[0_1.25rem_4rem_#0000000d] dark:from-[#111113] dark:to-[#09090b] dark:shadow-[0_1.25rem_4rem_#0006] max-sm:w-[calc(100vw-1rem)]"
  >
    <header px-5 pb-3 pt-5 max-sm:px-4>
      <div id="devframe-mount-examples-title" text-base font-700>
        The same handler, mounted natively
      </div>
      <div mt-1 text-xs op50>
        Only the host-facing glue changes
      </div>
    </header>

    <div flex flex-wrap gap-1.5 border-b border-base px-5 pb-3 max-sm:px-4>
      <button
        v-for="example of examples"
        :key="example.id"
        type="button"
        inline-flex items-center gap-1.5 border="~ solid rounded-full"
        px-2.5 py-1.5 text-xs outline-none transition-all duration-180
        :class="selected === example.id
          ? 'border-teal-500/45 bg-teal-500/10 text-teal-600 dark:text-teal-300'
          : 'border-base op55 hover:op100'"
        :aria-pressed="selected === example.id"
        @click="selected = example.id"
      >
        <img v-if="example.image" :src="example.image" alt="" class="m-0! h-3.5! w-3.5!" object-contain>
        <span v-else :class="example.icon" aria-hidden="true" />
        {{ example.label }}
      </button>
    </div>

    <ShikiMagicMove
      v-if="shiki.highlighter"
      :highlighter="shiki.highlighter"
      :code="current.code"
      lang="typescript"
      :theme="shiki.theme"
      :options="{
        duration: 350,
        animateContainer: true,
        stagger: 1,
      }"
      class="font-mono min-h-52 important-m-0 important-border-0 important-rounded-none important-bg-transparent important-p-5 text-sm max-sm:important-p-4"
    />
    <pre v-else class="m-0! min-h-52 overflow-auto bg-transparent! p-5! text-sm! max-sm:p-4!"><code>{{ current.code }}</code></pre>
  </figure>
</template>
