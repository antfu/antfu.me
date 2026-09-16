<!-- Vendored from antfu/talks@e9c7e16 and adapted for the antfu.me article layout. -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  activeFramework?: string
  frameworks?: string
  icon?: string
  image?: string
  logo?: string
  logoImage?: string
  name: string
  theme?: 'default' | 'green' | 'teal' | 'blue' | 'red' | 'pink' | 'yellow' | 'purple' | 'orange'
}>(), {
  activeFramework: undefined,
  frameworks: undefined,
  icon: undefined,
  image: undefined,
  logo: undefined,
  logoImage: undefined,
  theme: 'default',
})

const themes = {
  default: 'text-gray-500 border-gray-500/25 bg-gray-500/8 shadow-gray-500/20',
  green: 'text-green-500 border-green-500/25 bg-green-500/8 shadow-green-500/20',
  teal: 'text-teal-500 border-teal-500/25 bg-teal-500/8 shadow-teal-500/20',
  blue: 'text-blue-500 border-blue-500/25 bg-blue-500/8 shadow-blue-500/20',
  red: 'text-red-500 border-red-500/25 bg-red-500/8 shadow-red-500/20',
  pink: 'text-pink-500 border-pink-500/25 bg-pink-500/8 shadow-pink-500/20',
  yellow: 'text-yellow-500 border-yellow-500/25 bg-yellow-500/8 shadow-yellow-500/20',
  purple: 'text-purple-500 border-purple-500/25 bg-purple-500/8 shadow-purple-500/20',
  orange: 'text-orange-500 border-orange-500/25 bg-orange-500/8 shadow-orange-500/20',
}

const supportedFrameworks = computed(() => props.frameworks?.split(' ') ?? [])
const highlighted = computed(() => !!props.activeFramework
  && (props.activeFramework === 'your'
    || !props.frameworks
    || supportedFrameworks.value.includes(props.activeFramework)))
const dimmed = computed(() => !!props.activeFramework && !highlighted.value)
</script>

<template>
  <div
    relative flex h20 w20 min-w-0 box-border flex-col items-center justify-center gap-2
    border="~ solid rounded-xl"
    p2 outline-none
    transition-all duration-400 ease-out
    lt-md="flex-row h-10 w-28"
    hover="z-1 -translate-y-0.5 shadow-lg"
    focus-visible="z-1 -translate-y-0.5 shadow-lg"
    :class="[
      themes[theme],
      dimmed && 'op20',
      highlighted && '-translate-y-0.5 shadow-lg',
    ]"
    :title="name"
    tabindex="0"
  >
    <img v-if="image" :src="image" alt="" class="m-0! h-7! w-7!" object-contain flex-none pointer-events-none>
    <span v-else h-7 w-7 text-7 flex-none :class="icon" aria-hidden="true" />

    <span
      w-full overflow-hidden text-ellipsis text-center text-2.6 font-500 leading-tight
      lt-md="flex-1"
    >{{ name }}</span>
    <img
      v-if="logoImage"
      :src="logoImage"
      alt=""
      class="m-0! h-3.5! w-3.5!"
      absolute right-1.5 top-1.5 object-contain
      pointer-events-none lt-md="hidden"
    >
    <div
      v-else-if="logo"
      absolute right-1.5 top-1.5 h-3.5 w-3.5 text-3.5 pointer-events-none lt-md="hidden"
      :class="logo" aria-hidden="true"
    />
  </div>
</template>
