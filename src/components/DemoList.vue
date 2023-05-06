<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { demoItems } from '../../demo/data'

const breakpoints = useBreakpoints(breakpointsTailwind)

const cols = computed(() => {
  if (breakpoints['2xl'].value)
    return 4
  if (breakpoints.xl.value)
    return 3
  if (breakpoints.lg.value)
    return 2
  return 1
})

const parts = computed(() => {
  const result = Array.from({ length: cols.value }, () => [] as typeof demoItems)
  demoItems.forEach((item, i) => {
    result[i % cols.value].push(item)
  })
  return result
})
</script>

<template>
  <div flex="~ gap-4">
    <div v-for="items, idx of parts" :key="idx" flex="~ col gap-4">
      <component
        :is="comp"
        v-for="{ comp, date, video } of items"
        :key="date"
        :date="date"
        :video="video"
      />
    </div>
  </div>
</template>
