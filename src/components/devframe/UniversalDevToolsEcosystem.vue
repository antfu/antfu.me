<!-- Vendored from antfu/talks@e9c7e16 and adapted to work outside Slidev. Brand marks are from voidzero-dev/community-design-resources and rstackjs/rstack-design-resources. -->
<script setup lang="ts">
import DevToolsModule from './DevToolsModule.vue'

type Framework = 'nuxt' | 'vue' | 'next' | 'react' | 'svelte' | 'solid' | 'astro' | 'rsbuild' | 'hono' | 'nitro' | 'your'
type Theme = 'default' | 'green' | 'teal' | 'blue' | 'red' | 'pink' | 'yellow' | 'purple' | 'orange'

interface ModuleItem {
  frameworks?: string
  icon?: string
  image?: string
  logo?: string
  logoImage?: string
  name: string
  theme?: Theme
}

const frameworkOptions: Array<{
  id: Framework
  icon?: string
  image?: string
  label: string
  description: string
}> = [
  { id: 'nuxt', icon: 'i-logos-nuxt-icon', label: 'Nuxt', description: 'Highlight modules for Nuxt DevTools' },
  { id: 'vue', icon: 'i-logos-vue', label: 'Vue', description: 'Highlight modules for Vue DevTools' },
  { id: 'next', icon: 'i-logos-nextjs-icon', label: 'Next.js', description: 'Highlight modules for Next.js DevTools' },
  { id: 'react', icon: 'i-logos-react', label: 'React', description: 'Highlight modules for React DevTools' },
  { id: 'hono', icon: 'i-logos-hono', label: 'Hono', description: 'Highlight modules for Hono DevTools' },
  { id: 'nitro', icon: 'i-unjs-nitro', label: 'Nitro', description: 'Highlight modules for Nitro DevTools' },
  { id: 'svelte', icon: 'i-logos-svelte-icon', label: 'Svelte', description: 'Highlight modules for Svelte DevTools' },
  { id: 'solid', icon: 'i-logos-solidjs-icon', label: 'Solid', description: 'Highlight modules for Solid DevTools' },
  { id: 'astro', icon: 'i-logos-astro-icon', label: 'Astro', description: 'Highlight modules for Astro DevTools' },
  { id: 'rsbuild', image: '/images/devframe/rsbuild.svg', label: 'Rsbuild', description: 'Highlight modules for Rsbuild DevTools' },
  { id: 'your', icon: 'i-twemoji-winking-face', label: 'Your DevTools?', description: 'Show all modules for your own DevTools' },
]

const moduleGroups: Array<{
  id: string
  name: string
  modules: ModuleItem[]
}> = [
  {
    id: 'general',
    name: 'General',
    modules: [
      { icon: 'i-ph-person-simple-circle-duotone', name: 'A11y' },
      { icon: 'i-octicon-mcp-24', name: 'MCP' },
      { icon: 'i-ph-image-duotone', name: 'SEO Tools' },
      { icon: 'i-simple-icons-pwa', name: 'PWA' },
      { icon: 'i-ph-database-duotone', name: 'Server Data Inspector' },
      { icon: 'i-ph-terminal-window-duotone', name: 'Terminals' },
    ],
  },
  {
    id: 'build-tools',
    name: 'Build Tools',
    modules: [
      { image: '/images/devframe/vitest.svg', name: 'Vitest', theme: 'green' },
      { image: '/images/devframe/oxc.svg', name: 'Oxlint', theme: 'blue' },
      { frameworks: 'nuxt vue astro svelte react solid', icon: 'i-ph-cube-duotone', name: 'Bundle Analyzer', logoImage: '/images/devframe/vite.svg', theme: 'purple' },
      { frameworks: 'nuxt vue astro svelte react solid', icon: 'i-ph-magnifying-glass-duotone', name: 'Plugin Analyzer', logoImage: '/images/devframe/vite.svg', theme: 'purple' },
      { frameworks: 'nuxt vue astro svelte react solid', icon: 'i-ph-sliders-horizontal-duotone', name: 'Vite Config', logoImage: '/images/devframe/vite.svg', theme: 'purple' },
      { image: '/images/devframe/rolldown.svg', name: 'Rolldown', theme: 'orange' },
      { frameworks: 'rsbuild nuxt', image: '/images/devframe/rsdoctor.svg', name: 'Rsdoctor', theme: 'blue' },
      { frameworks: 'next', icon: 'i-logos-turbopack-icon', name: 'Turbopack' },
    ],
  },
  {
    id: 'frameworks',
    name: 'Frameworks Specific',
    modules: [
      { frameworks: 'nuxt vue astro', icon: 'i-carbon-assembly-cluster', name: 'Components', logo: 'i-logos-vue', theme: 'green' },
      { frameworks: 'nuxt vue astro', icon: 'i-carbon-network-4', name: 'Reactivity', logo: 'i-logos-vue', theme: 'green' },
      { frameworks: 'nuxt vue astro', icon: 'i-ph-signpost-duotone', name: 'Router', logo: 'i-logos-vue', theme: 'green' },
      { frameworks: 'nuxt vue astro', icon: 'i-icon-park-outline-pineapple', name: 'Pinia', logo: 'i-logos-vue', theme: 'green' },
      { frameworks: 'nuxt', icon: 'i-ph-shapes-duotone', name: 'Nuxt Modules', logo: 'i-logos-nuxt-icon', theme: 'teal' },
      { frameworks: 'nuxt', icon: 'i-carbon-function', name: 'Auto Imports', logo: 'i-logos-nuxt-icon', theme: 'teal' },
      { frameworks: 'nuxt', icon: 'i-carbon-volume-file-storage', name: 'File Router', logo: 'i-logos-nuxt-icon', theme: 'teal' },
      { frameworks: 'nuxt nitro', icon: 'i-carbon-network-public', name: 'Server API', logo: 'i-unjs-nitro', theme: 'pink' },
      { frameworks: 'next', icon: 'i-logos-nextjs-icon', name: 'Next.js DevTools' },
      { frameworks: 'react astro next', icon: 'i-logos-react', name: 'React DevTools', theme: 'blue' },
      { frameworks: 'react astro next', icon: 'i-carbon-data-set', name: 'State Management', logo: 'i-logos-react', theme: 'blue' },
      { frameworks: 'react astro next', icon: 'i-ph-signpost-duotone', name: 'Router', logo: 'i-logos-react', theme: 'blue' },
      { frameworks: 'svelte astro', icon: 'i-ph-signpost-duotone', name: 'File Router', logo: 'i-logos-svelte-icon', theme: 'red' },
      { frameworks: 'svelte astro', icon: 'i-carbon-assembly-cluster', name: 'Components', logo: 'i-logos-svelte-icon', theme: 'red' },
      { frameworks: 'solid astro', icon: 'i-carbon-network-4', name: 'Reactivity', logo: 'i-logos-solidjs-icon', theme: 'blue' },
      { frameworks: 'astro', icon: 'i-carbon-page-scroll', name: 'Content', logo: 'i-logos-astro-icon', theme: 'orange' },
    ],
  },
  {
    id: 'ecosystem',
    name: 'Ecosystem',
    modules: [
      { icon: 'i-logos-unocss', name: 'UnoCSS' },
      { icon: 'i-logos-turborepo-icon', name: 'Turborepo' },
      { icon: 'i-logos-eslint', name: 'ESLint', theme: 'purple' },
      { image: '/images/devframe/tanstack.png', name: 'TanStack', theme: 'blue' },
      { icon: 'i-logos-storybook-icon', name: 'Storybook', theme: 'pink' },
      { image: '/images/devframe/histoire.svg', name: 'Histoire', theme: 'green' },
      { image: '/images/devframe/node-modules-inspector.svg', name: 'Node Modules', theme: 'green' },
      { icon: 'i-ph-dots-three-duotone', name: 'More...' },
    ],
  },
]

const hoveredFramework = ref<Framework>()
const focusedFramework = ref<Framework>()
const selectedFramework = ref<Framework>()
const activeFramework = computed(() => hoveredFramework.value ?? focusedFramework.value ?? selectedFramework.value)
const hoveredModule = ref<ModuleItem>()
const focusedModule = ref<ModuleItem>()
const activeModule = computed(() => hoveredModule.value ?? focusedModule.value)

function toggleFramework(framework: Framework) {
  selectedFramework.value = selectedFramework.value === framework ? undefined : framework
}

function moduleSupportsFramework(module: ModuleItem, framework: Framework) {
  return framework === 'your'
    || !module.frameworks
    || module.frameworks.split(' ').includes(framework)
}
</script>

<template>
  <figure
    aria-labelledby="devtools-kit-title"
    class="box-border w-[min(50rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-dashed border-[#8883] rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 mx-[50%] my-11! text-gray-700 shadow-[0_1.25rem_4rem_#0000000d] dark:from-[#111113] dark:to-[#09090b] dark:text-gray-300 dark:shadow-[0_1.25rem_4rem_#0006] max-sm:w-[calc(100vw-1rem)]"
  >
    <header gap-4 px-6 pb-3 pt-5 max-sm:flex-col max-sm:items-start max-sm:px-4>
      <div>
        <span class="font-800 text-lg">
          The Universal
        </span>
        <span class="text-lg">
          DevTools Ecosystem
        </span>
        <span class="text-teal-500 ws-nowrap bg-teal-500:10 border border-teal-500:50 text-xs px1.5 rounded-full">
          The Vision
        </span>
      </div>
      <div text-sm op50 tracking-wide>
        Modular, Composable, Collaborative
      </div>
    </header>

    <div px-6 max-sm:px-4>
      <div class="text-xs op50">
        Hover on a framework to preview how shared and framework-specific modules could compose into its DevTools.
      </div>
    </div>
    <div
      class="border-[#8882]"
      flex flex-wrap items-center gap-1.5 border-b px-6 pb-4 pt-3 max-sm:px-4
      aria-label="Preview framework compositions"
      @mouseleave="hoveredFramework = undefined"
    >
      <button
        v-for="option of frameworkOptions"
        :key="option.id"
        type="button"
        inline-flex items-center gap-1.5 border="~ solid base rounded-full"
        bg-gray-500:6 px-2.5 py-1.5 text-xs outline-none
        transition-all duration-400 ease-out
        hover="-translate-y-0.5 border-base bg-gray-500/12"
        focus-visible="ring-2 ring-gray-400/40"
        :class="[
          selectedFramework === option.id && 'bg-gray-500/20',
          activeModule && moduleSupportsFramework(activeModule, option.id) && '-translate-y-0.2 shadow-lg',
          activeModule && !moduleSupportsFramework(activeModule, option.id) && 'op25',
        ]"
        :aria-label="option.description"
        :aria-pressed="selectedFramework === option.id"
        @pointerover="hoveredFramework = option.id"
        @pointercancel="hoveredFramework = undefined"
        @pointerleave="hoveredFramework = undefined"
        @pointerout="hoveredFramework = undefined"
        @focus="focusedFramework = option.id"
        @blur="focusedFramework = undefined"
        @click="toggleFramework(option.id)"
      >
        <img v-if="option.image" :src="option.image" alt="" class="m-0!" h-3.5 w-3.5 object-contain>
        <span v-else :class="option.icon" />
        {{ option.label }}
      </button>
    </div>

    <div overflow-x-auto px-6 pb-6 pt-5 max-sm:px-4>
      <div>
        <section
          v-for="(group, index) of moduleGroups"
          :key="group.id"
          :aria-labelledby="`devtools-kit-${group.id}`"
          :class="index ? 'mt-4' : ''"
        >
          <h3
            :id="`devtools-kit-${group.id}`"
            class="m-0! mb-2! text-xs! text-gray-500! font-600! tracking-[0.08em]"
            uppercase
          >
            {{ group.name }}
          </h3>
          <div flex flex-wrap gap-2.5>
            <DevToolsModule
              v-for="(module, moduleIndex) of group.modules"
              :key="`${group.id}-${moduleIndex}`"
              :active-framework="activeFramework"
              v-bind="module"
              @pointerover="hoveredModule = module"
              @pointercancel="hoveredModule = undefined"
              @pointerleave="hoveredModule = undefined"
              @pointerout="hoveredModule = undefined"
              @focus="focusedModule = module"
              @blur="focusedModule = undefined"
            />
          </div>
        </section>
      </div>
    </div>

    <div text-sm text-teal-500 bg-teal-500:5 px4 py1 border-t border-r border-dashed border-teal-500:20 tracking-wide inline-block rounded-tr-md text-xs lt-md="block rounded-none border-r-0">
      This is for demonstration the vision, not all modules/tools are yet available.
    </div>
  </figure>
</template>
