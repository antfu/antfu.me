<script setup lang="ts">
defineProps<{
  input: string
  input2?: string
  output: string
}>()
</script>

<template>
  <div relative w-100>
    <img
      :src="output"
      border="~ base"
      rounded-lg shadow absolute left-0 bottom-0 right-0 top-0 important-m0 z-1
    >
    <div
      class="group"
      absolute left--20 h-30 top--5 right-95 z-10
      hover="right-0 h-40"
      transition-all duration-300 ease-in-out
    >
      <img
        :src="input"
        pos="absolute top-8 left--2"
        border="~ base"
        rotate--8 rounded-lg shadow-lg important-w-25
        transition-all duration-300 ease-in-out
        important-m0
        group-hover="left-20 top-5 rotate-0 important-w-100 op50 shadow-none"
      >
    </div>
    <div
      v-if="input2"
      class="group"
      absolute left--20 h-30 top-40 right-95 z-10
      hover="right-0 z-9 top-0 h-full"
      transition-all duration-300 ease-in-out
    >
      <img
        :src="input2"
        pos="absolute top-2 left--2"
        border="~ base"
        rotate--8 rounded-lg shadow-lg important-w-25
        transition-all duration-300 ease-in-out
        important-m0
        group-hover="left-20 top-0 rotate-0 important-w-100 op50 shadow-none"
      >
    </div>
  </div>
</template>
