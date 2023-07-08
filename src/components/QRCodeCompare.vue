<script setup lang="ts">
defineProps<{
  input: string
  output: string
}>()
</script>

<template>
  <div relative w-90 h-90 aspect-ratio-1>
    <img
      :src="output"
      border="~ base"
      rounded-lg shadow absolute left-0 bottom-0 right-0 top-0 important-m0 z-1
    >
    <div
      class="group"
      absolute left--20 bottom-0 top--0 right--0 z-10
    >
      <img
        :src="input"
        pos="absolute top-8 left--2"
        border="~ base"
        rotate--8 rounded-lg shadow important-w-25
        transition-all duration-300 ease-in-out
        important-m0
        group-hover="left-20 bottom-0 right-0 top-0 rotate-0 important-w-90 op60"
      >
    </div>
  </div>
</template>
