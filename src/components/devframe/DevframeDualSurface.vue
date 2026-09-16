<script setup lang="ts">
const capabilities = [
  {
    id: 'build',
    label: 'Build Graph',
    icon: 'i-ph-graph-duotone',
    rpc: 'inspectBuild()',
    visualTitle: 'Explore the graph',
    visualDetail: 'Navigate modules, compare chunks, and spot outliers.',
    agentTitle: 'Investigate the cause',
    agentDetail: 'Query slow modules, correlate them with code, and propose changes.',
  },
  {
    id: 'a11y',
    label: 'A11y Findings',
    icon: 'i-ph-person-simple-circle-duotone',
    rpc: 'scanAccessibility()',
    visualTitle: 'See violations in context',
    visualDetail: 'Browse findings and highlight the matching elements on the page.',
    agentTitle: 'Prepare a fix',
    agentDetail: 'Read structured findings and generate a focused implementation prompt.',
  },
  {
    id: 'state',
    label: 'Runtime State',
    icon: 'i-ph-database-duotone',
    rpc: 'inspectRuntime()',
    visualTitle: 'Browse and compare',
    visualDetail: 'Inspect the tree, filter values, and watch updates over time.',
    agentTitle: 'Retrieve precise context',
    agentDetail: 'Ask for only the relevant fields before reasoning across the codebase.',
  },
] as const

const selected = ref<(typeof capabilities)[number]['id']>('build')
const current = computed(() => capabilities.find(capability => capability.id === selected.value)!)
</script>

<template>
  <figure
    aria-labelledby="devframe-dual-surface-title"
    class="box-border w-[min(50rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-[#8883] rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 mx-[50%] my-11! text-gray-700 shadow-[0_1.25rem_4rem_#0000000d] dark:from-[#111113] dark:to-[#09090b] dark:text-gray-300 dark:shadow-[0_1.25rem_4rem_#0006] max-sm:w-[calc(100vw-1rem)]"
  >
    <header px-6 pb-3 pt-5 max-sm:px-4>
      <div id="devframe-dual-surface-title" text-lg font-700>
        One capability, two interfaces
      </div>
      <div mt-1 text-sm op50>
        Humans and agents share the same source of truth
      </div>
    </header>

    <div flex flex-wrap gap-1.5 border-b border-base px-6 pb-4 max-sm:px-4>
      <button
        v-for="capability of capabilities"
        :key="capability.id"
        type="button"
        inline-flex items-center gap-1.5 border="~ solid rounded-lg"
        px-2.5 py-1.5 text-xs outline-none transition-all duration-180
        :class="selected === capability.id
          ? 'border-teal-500/45 bg-teal-500/10 text-teal-600 dark:text-teal-300'
          : 'border-transparent op55 hover:border-base hover:op100'"
        :aria-pressed="selected === capability.id"
        @click="selected = capability.id"
      >
        <span :class="capability.icon" aria-hidden="true" />
        {{ capability.label }}
      </button>
    </div>

    <div grid grid-cols="[1fr_auto_0.8fr_auto_1fr]" items-stretch gap-3 px-6 py-6 max-md:grid-cols-1 max-sm:px-4>
      <section border="~ solid blue-500/30 rounded-lg" text-blue-600 dark:text-blue-300 bg-blue-500:5 p-4 transition-all flex="~ col gap-2">
        <div flex items-center gap-1 text-sm op75>
          <span i-ph-desktop-duotone aria-hidden="true" />
          Visual interface
        </div>
        <div font-650 text-blue-700 dark:text-blue-200>
          {{ current.visualTitle }}
        </div>
        <div text-xs leading-relaxed op60>
          {{ current.visualDetail }}
        </div>
      </section>

      <div flex items-center justify-center op30 max-md:rotate-90>
        <span i-ph-arrow-left-bold aria-hidden="true" />
      </div>

      <section flex flex-col items-center justify-center ma border="~ teal-500/40 rounded-full dashed" bg-teal-500:10 p-4 text-center w-40 h-40>
        <span :class="current.icon" h-7 w-7 text-7 text-teal-500 aria-hidden="true" />
        <div mt-2 font-mono text-xs text-teal-700 font-650 dark:text-teal-300>
          {{ current.rpc }}
        </div>
        <div class="mt-1 text-[0.65rem] tracking-wide op45 uppercase">
          Devframe PRC
        </div>
      </section>

      <div flex items-center justify-center op30 max-md:rotate-90>
        <span i-ph-arrow-right-bold aria-hidden="true" />
      </div>

      <section border="~ solid purple-500/30 rounded-lg" text-purple-600 dark:text-purple-300 bg-purple-500:5 p-4 transition-all flex="~ col gap-2">
        <div flex items-center gap-1 text-sm op75>
          <span i-ph-head-circuit-duotone aria-hidden="true" />
          Agentic interface
        </div>
        <div font-650 text-purple-700 dark:text-purple-200>
          {{ current.agentTitle }}
        </div>
        <div text-xs leading-relaxed op60>
          {{ current.agentDetail }}
        </div>
      </section>
    </div>
  </figure>
</template>
