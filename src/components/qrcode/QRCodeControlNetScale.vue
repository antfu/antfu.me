<script setup lang="ts">
defineProps<{
  start: number
  end: number
  weight: number
}>()
</script>

<template>
  <div h-5px border="t base" relative>
    <div
      bg-yellow absolute top-0 bottom-0
      :style="{
        left: `${+start * 100}%`,
        right: `${(1 - end) * 100}%`,
        opacity: weight / 2 + 0.2,
      }"
    />
  </div>
</template>
