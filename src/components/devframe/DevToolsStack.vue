<script setup lang="ts">
import { computed, ref } from 'vue'

type PartId
  = 'devframe'
    | 'devframe-plugins'
    | 'vite-devtools'
    | 'vite-plugins'
    | 'nuxt-devtools'
    | 'nuxt-modules'

type PartGroup = 'devframe' | 'vite' | 'nuxt'

interface PluginExample {
  icon?: string
  image?: string
  label: string
}

interface Part {
  description: string
  group: PartGroup
  icon?: string
  id: PartId
  image?: string
  label: string
}

interface StackRow {
  bottomY: number
  connectorClass: string
  layer: Part
  layerClass: string
  pluginClass: string
  pluginExamples: PluginExample[]
  plugins: Part
  topY: number
}

const stackHeight = 54
const stackSlope = 0.4

const parts: Record<PartId, Part> = {
  'devframe': {
    id: 'devframe',
    group: 'devframe',
    label: 'Devframe Hub',
    image: '/images/devframe/devframe.svg',
    description: 'The framework-neutral composition layer. It brings multiple Devframes together through shared concepts such as docks, commands, messages, and terminals, then serves them through one standard handler.',
  },
  'devframe-plugins': {
    id: 'devframe-plugins',
    group: 'devframe',
    label: 'Devframes',
    icon: 'i-ph-fediverse-logo-duotone',
    description: 'Framework-neutral capabilities such as Data Inspector, Terminals, and Accessibility Inspector. They can run standalone or be mounted into any compatible host.',
  },
  'vite-devtools': {
    id: 'vite-devtools',
    group: 'vite',
    label: 'Vite DevTools',
    image: '/images/devframe/vite.svg',
    description: 'The first flagship DevTools host built around Devframe Hub. It provides the visual shell and Vite-native integrations while inheriting portable Devframes.',
  },
  'vite-plugins': {
    id: 'vite-plugins',
    group: 'vite',
    label: 'Vite Plugins',
    icon: 'i-logos-vite-icon dark:i-logos-vite-icon-dark',
    description: 'Vite-specific integrations contributed through devtools.setup(). They can use Vite internals directly and compose beside portable Devframes in the same host.',
  },
  'nuxt-devtools': {
    id: 'nuxt-devtools',
    group: 'nuxt',
    label: 'Nuxt DevTools',
    icon: 'i-logos-nuxt-icon',
    description: 'A framework-specific experience built on Vite DevTools. It inherits the shared host and integrations, then adds deep knowledge about Nuxt projects and runtime conventions.',
  },
  'nuxt-modules': {
    id: 'nuxt-modules',
    group: 'nuxt',
    label: 'Nuxt Modules',
    icon: 'i-ph-shapes-duotone',
    description: 'Nuxt-specific contributions such as pages, auto-imports, server APIs, and module integrations. They enrich the inherited stack without rebuilding its shared infrastructure.',
  },
}

const rows: StackRow[] = [
  {
    layer: parts.devframe,
    plugins: parts['devframe-plugins'],
    topY: 0,
    bottomY: 16,
    layerClass: 'text-teal-500',
    connectorClass: 'border-teal-500/35',
    pluginClass: 'border-teal-500/30 bg-teal-500/8 text-teal-600 dark:text-teal-400',
    pluginExamples: [
      { icon: 'i-ph-person-simple-circle-duotone', label: 'Accessibility Inspector' },
      { icon: 'i-ph-image-duotone', label: 'Open Graph Inspector' },
      { icon: 'i-ph-terminal-window-duotone', label: 'Terminals' },
    ],
  },
  {
    layer: parts['vite-devtools'],
    plugins: parts['vite-plugins'],
    topY: 19,
    bottomY: 35,
    layerClass: 'text-purple-500',
    connectorClass: 'border-purple-500/35',
    pluginClass: 'border-purple-500/30 bg-purple-500/8 text-purple-600 dark:text-purple-400',
    pluginExamples: [
      { image: '/images/devframe/vite.svg', label: 'Vite' },
      { image: '/images/devframe/vitest.svg', label: 'Vitest' },
      { image: '/images/devframe/rolldown.svg', label: 'Rolldown' },
      { image: '/images/devframe/oxc.svg', label: 'Oxc' },
    ],
  },
  {
    layer: parts['nuxt-devtools'],
    plugins: parts['nuxt-modules'],
    topY: 38,
    bottomY: 54,
    layerClass: 'text-green-500',
    connectorClass: 'border-green-500/35',
    pluginClass: 'border-green-500/30 bg-green-500/8 text-green-600 dark:text-green-400',
    pluginExamples: [
      { icon: 'i-logos-vue', label: 'Vue' },
      { icon: 'i-logos-pinia', label: 'Pinia' },
      { icon: 'i-ph-arrows-split-duotone rotate-270', label: 'Router' },
      { icon: 'i-ph-shapes-duotone', label: 'Components' },
    ],
  },
]

const defaultPart: Omit<Part, 'group' | 'id'> = {
  label: 'The DevTools Stack',
  icon: 'i-ph-stack-duotone',
  description: 'Portable Devframes compose behind one standard handler, then framework-specific DevTools inherit and extend the host. Hover, focus, or click any part to explore its responsibility.',
}

const hoveredPart = ref<PartId>()
const focusedPart = ref<PartId>()
const selectedPart = ref<PartId>()
const activePartId = computed(() => hoveredPart.value ?? focusedPart.value ?? selectedPart.value)
const activePart = computed(() => activePartId.value ? parts[activePartId.value] : defaultPart)
const activeGroup = computed(() => activePartId.value ? parts[activePartId.value].group : undefined)

function togglePart(id: PartId) {
  selectedPart.value = selectedPart.value === id ? undefined : id
}

function partStateClass(id: PartId) {
  if (!activeGroup.value)
    return ''
  return activeGroup.value === parts[id].group
    ? 'z-5 scale-[1.015] drop-shadow-[0_0.75rem_0.8rem_#0003]'
    : 'op30 saturate-25'
}

function groupStateClass(group: PartGroup) {
  if (!activeGroup.value)
    return ''
  return activeGroup.value === group
    ? 'op100 drop-shadow-[0_0.6rem_0.65rem_#0002]'
    : 'op30 saturate-25'
}

function leftAt(y: number) {
  return 28 - y * stackSlope
}

function rightAt(y: number) {
  return 72 + y * stackSlope
}

function centerY(row: StackRow) {
  return (row.topY + row.bottomY) / 2
}

function layerPath(row: StackRow) {
  const topLeft = leftAt(row.topY)
  const topRight = rightAt(row.topY)
  const bottomLeft = leftAt(row.bottomY)
  const bottomRight = rightAt(row.bottomY)

  return [
    `M ${topLeft + 1} ${row.topY + 0.4}`,
    `H ${topRight - 1}`,
    `Q ${topRight - 0.15} ${row.topY + 0.4} ${topRight + 0.15} ${row.topY + 1.2}`,
    `L ${bottomRight - 0.15} ${row.bottomY - 1.2}`,
    `Q ${bottomRight} ${row.bottomY - 0.4} ${bottomRight - 1} ${row.bottomY - 0.4}`,
    `H ${bottomLeft + 1}`,
    `Q ${bottomLeft} ${row.bottomY - 0.4} ${bottomLeft + 0.15} ${row.bottomY - 1.2}`,
    `L ${topLeft - 0.15} ${row.topY + 1.2}`,
    `Q ${topLeft} ${row.topY + 0.4} ${topLeft + 1} ${row.topY + 0.4}`,
    'Z',
  ].join(' ')
}

function layerButtonStyle(row: StackRow) {
  const left = leftAt(row.bottomY)
  const right = rightAt(row.bottomY)
  const topInset = (leftAt(row.topY) - left) / (right - left) * 100

  return {
    clipPath: `polygon(${topInset}% 0, ${100 - topInset}% 0, 100% 100%, 0 100%)`,
    height: `${(row.bottomY - row.topY) / stackHeight * 100}%`,
    left: `${left}%`,
    top: `${row.topY / stackHeight * 100}%`,
    width: `${right - left}%`,
  }
}

function pluginStyle(row: StackRow) {
  return {
    top: `${centerY(row) / stackHeight * 100}%`,
  }
}
</script>

<template>
  <figure
    aria-label="Hierarchy of Devframe, Vite DevTools, and Nuxt DevTools"
    class="box-border w-[min(50rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-[#8883] rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 mx-[50%] my-11! text-gray-700 shadow-[0_1.25rem_4rem_#0000000d] dark:from-[#111113] dark:to-[#09090b] dark:text-gray-300 dark:shadow-[0_1.25rem_4rem_#0006] max-sm:w-[calc(100vw-1rem)]"
    @mouseleave="hoveredPart = undefined"
  >
    <header flex items-end justify-between gap-4 px-6 pb-4 pt-5 max-sm:items-start max-sm:px-4>
      <div>
        <div text-lg font-700>
          The Vite/Nuxt DevTools Stack
        </div>
        <div text-sm op50>
          Shared foundations, specialized experiences
        </div>
      </div>
      <div text-xs op45 max-sm:hidden>
        Hover to explore
      </div>
    </header>

    <div overflow-x-auto px-6 py-4 max-sm:px-4>
      <div class="grid min-w-150 grid-cols-[minmax(0,1fr)_11.25rem] gap-6">
        <div class="relative aspect-[50/27] min-w-0">
          <svg
            aria-hidden="true"
            absolute inset-0 h-full w-full
            preserveAspectRatio="xMidYMid meet"
            :viewBox="`0 0 100 ${stackHeight}`"
          >
            <g v-for="(row, index) of rows" :key="`connectors-${row.layer.id}`">
              <line
                v-if="index < rows.length - 1"
                x1="50"
                :y1="row.bottomY"
                x2="50"
                :y2="rows[index + 1].topY"
                class="text-gray-400/45"
                stroke="currentColor"
                stroke-width="0.16"
              />
              <line
                :x1="rightAt(centerY(row))"
                :y1="centerY(row)"
                x2="100"
                :y2="centerY(row)"
                :class="[row.layerClass, groupStateClass(row.layer.group)]"
                stroke="currentColor"
                stroke-opacity="0.55"
                stroke-width="0.16"
              />
            </g>

            <path
              v-for="row of rows"
              :key="`shape-${row.layer.id}`"
              :d="layerPath(row)"
              :class="[row.layerClass, groupStateClass(row.layer.group)]"
              fill="currentColor"
              fill-opacity="0.1"
              stroke="currentColor"
              stroke-opacity="0.55"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="0.18"
            />
          </svg>

          <button
            v-for="row of rows"
            :key="`layer-${row.layer.id}`"
            type="button"
            class="absolute outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-current/40"
            :class="[row.layerClass, groupStateClass(row.layer.group)]"
            :style="layerButtonStyle(row)"
            :aria-label="`Describe ${row.layer.label}`"
            :aria-pressed="selectedPart === row.layer.id"
            @mouseenter="hoveredPart = row.layer.id"
            @focus="focusedPart = row.layer.id"
            @blur="focusedPart = undefined"
            @click="togglePart(row.layer.id)"
          >
            <span
              class="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 relative h-full"
            >
              <img
                v-if="row.layer.image"
                :src="row.layer.image"
                alt=""
                class="m-0! h-6! w-6! object-contain"
              >
              <span v-else :class="row.layer.icon" h-6 w-6 text-6 aria-hidden="true" />
              <span text-sm font-600>{{ row.layer.label }}</span>
            </span>
          </button>

          <span
            v-for="row of rows"
            :key="`gap-${row.layer.id}`"
            aria-hidden="true"
            class="absolute left-full w-6 border-t transition-opacity"
            :class="[row.connectorClass, groupStateClass(row.layer.group)]"
            :style="pluginStyle(row)"
          />
        </div>

        <div relative>
          <button
            v-for="row of rows"
            :key="`plugins-${row.plugins.id}`"
            type="button"
            class="absolute left-0 w-full flex -translate-y-1/2 flex-col items-start gap-1 rounded-xl px-3 py-2 text-left outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-current/40"
            :class="[row.layerClass, partStateClass(row.plugins.id)]"
            :style="pluginStyle(row)"
            :aria-label="`Describe ${row.plugins.label}`"
            :aria-pressed="selectedPart === row.plugins.id"
            @mouseenter="hoveredPart = row.plugins.id"
            @focus="focusedPart = row.plugins.id"
            @blur="focusedPart = undefined"
            @click="togglePart(row.plugins.id)"
          >
            <div flex shrink-0 gap-1>
              <span
                v-for="example of row.pluginExamples"
                :key="example.label"
                :class="row.pluginClass"
                class="flex h-7 w-7 items-center justify-center border rounded-md"
                :title="example.label"
              >
                <img
                  v-if="example.image"
                  :src="example.image"
                  alt=""
                  class="m-0! h-4.5! w-4.5! object-contain"
                >
                <span v-else :class="example.icon" h-4.5 w-4.5 text-4.5 aria-hidden="true" />
              </span>
              <span class="flex h-7 w-7 items-center justify-center border rounded-md bg-gray-500/10 border-base op50">
                <span i-ri-more-line h-4.5 w-4.5 text-4.5 text-gray aria-hidden="true" />
              </span>
            </div>
            <div text-xs font-600>
              {{ row.plugins.label }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <figcaption
      class="min-h-25 border-t border-[#8883] bg-[#88808] px-6 py-4 max-sm:px-4"
      aria-live="polite"
    >
      <div flex items-start gap-3>
        <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-500/10">
          <img
            v-if="activePart.image"
            :src="activePart.image"
            alt=""
            class="m-0! h-5! w-5! object-contain"
          >
          <span v-else :class="activePart.icon" h-5 w-5 text-5 aria-hidden="true" />
        </span>
        <div>
          <div text-sm font-600>
            {{ activePart.label }}
          </div>
          <p class="m-0! mt-1! text-sm! op65 leading-relaxed!">
            {{ activePart.description }}
          </p>
        </div>
      </div>
    </figcaption>
  </figure>
</template>
