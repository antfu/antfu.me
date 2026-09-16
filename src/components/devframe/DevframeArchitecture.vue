<script setup lang="ts">
const hosts = [
  { label: 'Hono', icon: 'i-logos-hono' },
  { label: 'Nitro', icon: 'i-unjs-nitro' },
  { label: 'Next.js', icon: 'i-logos-nextjs-icon' },
  { label: 'SvelteKit', icon: 'i-logos-svelte-icon' },
  { label: 'Vite', icon: 'i-logos-vite-icon dark:i-logos-vite-icon-dark' },
  { label: 'Rsbuild', image: '/images/devframe/rsbuild.svg' },
  { label: 'Deno', icon: 'i-logos-deno' },
  { label: 'Bun', icon: 'i-logos-bun' },
  { label: 'Any', icon: 'i-ph-question-duotone' },
]

const destinations = [
  { label: 'CLI', icon: 'i-ph-terminal-window-duotone' },
  { label: 'Dev Server', icon: 'i-ph-browser-duotone' },
  { label: 'MCP', icon: 'i-octicon-mcp-24' },
  { label: 'Static Report', icon: 'i-ph-file-html-duotone' },
  { label: 'Vite DevTools', icon: 'i-logos-vite-icon dark:i-logos-vite-icon-dark' },
]
</script>

<template>
  <figure
    aria-labelledby="devframe-architecture-title"
    class="box-border w-[min(50rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-[#8883] rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 mx-[50%] my-11! text-gray-700 shadow-[0_1.25rem_4rem_#0000000d] dark:from-[#111113] dark:to-[#09090b] dark:text-gray-300 dark:shadow-[0_1.25rem_4rem_#0006] max-sm:w-[calc(100vw-1rem)]"
  >
    <header px-6 pb-5 pt-5 max-sm:px-4>
      <div id="devframe-architecture-title" text-lg font-700>
        Define once, mount anywhere
      </div>
      <div mt-1 text-sm op50>
        One stable boundary between a DevTool and its environment
      </div>
    </header>

    <div px-6 pb-6 max-sm:px-4>
      <div flex items-stretch justify-center gap-2 max-sm:flex-col>
        <div class="group flex min-w-0 flex-1 items-center gap-3 border border-teal-500/35 rounded-xl bg-teal-500/8 p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <span i-ph-selection-duotone h-8 w-8 shrink-0 text-teal-500 aria-hidden="true" />
          <div min-w-0>
            <div font-mono text-sm text-teal-600 font-650 dark:text-teal-300>
              defineDevframe()
            </div>
            <div mt-0.5 truncate text-xs op50>
              Capabilities and UI
            </div>
          </div>
        </div>

        <div flex shrink-0 items-center justify-center op35 max-sm:rotate-90>
          <span i-ph-arrow-right-bold aria-hidden="true" />
        </div>

        <div class="group flex min-w-0 flex-1 items-center gap-3 border border-sky-500/35 rounded-xl bg-sky-500/8 p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <span i-ph-circuitry-duotone h-8 w-8 shrink-0 text-sky-500 aria-hidden="true" />
          <div min-w-0>
            <div font-mono text-sm text-sky-600 font-650 dark:text-sky-300>
              initDevframe()
            </div>
            <div mt-0.5 truncate text-xs op50>
              Live instance
            </div>
          </div>
        </div>

        <div flex shrink-0 items-center justify-center op35 max-sm:rotate-90>
          <span i-ph-arrow-right-bold aria-hidden="true" />
        </div>

        <div class="group flex min-w-0 flex-1 items-center gap-3 border border-purple-500/35 rounded-xl bg-purple-500/8 p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
          <span i-ph-puzzle-piece-duotone h-8 w-8 shrink-0 text-purple-500 aria-hidden="true" />
          <div min-w-0>
            <div font-mono text-sm text-purple-600 font-650 dark:text-purple-300>
              Request → Response
            </div>
            <div mt-0.5 truncate text-xs op50>
              Standard handler
            </div>
          </div>
        </div>
      </div>

      <div class="border-b border-base w-full my4" />

      <div grid grid-cols-2 gap-4 max-sm:grid-cols-1>
        <section border="~ solid base rounded-xl" bg-gray-500:3 p-4>
          <div mb-3 flex items-center gap-2 text-xs font-650 op60>
            <span i-ph-plugs-connected-duotone text-base aria-hidden="true" />
            MOUNT THE HANDLER
          </div>
          <div flex flex-wrap gap-2>
            <div
              v-for="host of hosts"
              :key="host.label"
              flex items-center gap-1.5 border="~ solid base rounded-lg"
              bg-gray-500:5 px-2.5 py-1.5 text-xs transition hover:-translate-y-0.5 hover:bg-gray-500:10
            >
              <img v-if="host.image" :src="host.image" alt="" class="m-0! h-3.5! w-3.5!" object-contain>
              <span v-else :class="host.icon" aria-hidden="true" />
              {{ host.label }}
            </div>
          </div>
        </section>

        <section border="~ solid base rounded-xl" bg-gray-500:3 p-4>
          <div mb-3 flex items-center gap-2 text-xs font-650 op60>
            <span i-ph-package-duotone text-base aria-hidden="true" />
            PACKAGE WITH ADAPTERS
          </div>
          <div flex flex-wrap gap-2>
            <div
              v-for="destination of destinations"
              :key="destination.label"
              flex items-center gap-1.5 border="~ solid base rounded-lg"
              bg-gray-500:5 px-2.5 py-1.5 text-xs transition hover:-translate-y-0.5 hover:bg-gray-500:10
            >
              <span :class="destination.icon" aria-hidden="true" />
              {{ destination.label }}
            </div>
          </div>
        </section>
      </div>
    </div>
  </figure>
</template>
