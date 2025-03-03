<script setup lang="ts">
import type { QuansyncGraphArrow, QuansyncGraphNode } from './_types'

const hover = ref<'sync' | 'async' | null>(null)

const purple = computed(() => hover.value == null
  ? 'purple'
  : hover.value === 'sync'
    ? 'blue'
    : 'red')

const red = computed(() => hover.value === 'sync' ? 'none' : 'red')
const blue = computed(() => hover.value === 'async' ? 'none' : 'blue')

const nodes = computed<QuansyncGraphNode[]>(() => [
  {
    id: 'a0',
    name: '[async consumers]',
    color: red.value,
    x: 120,
    y: -60,
    to: ['q1'],
    hover: () => hover.value = 'async',
    blur: () => hover.value = null,
  },
  {
    id: 's0',
    name: '[sync consumers]',
    color: blue.value,
    x: 350,
    y: -60,
    to: ['q1'],
    hover: () => hover.value = 'sync',
    blur: () => hover.value = null,
  },

  { id: 'q1', name: '*readNearestPkg()', color: purple.value, x: 230, y: 40, to: ['q2'] },
  { id: 'q2', name: '*findUp()', color: purple.value, x: 270, y: 100, to: ['q3'] },
  { id: 'q3', name: '*locatePath()', color: purple.value, x: 250, y: 160, to: ['q4'] },
  { id: 'q4', name: '*stat()', color: purple.value, x: 280, y: 220, to: ['a5', 's5'] },

  { id: 'a5', name: 'fs.stat()', color: red.value, x: 360, y: 320, hover: () => hover.value = 'async', blur: () => hover.value = null },
  { id: 's5', name: 'fs.statSync()', color: blue.value, x: 160, y: 320, hover: () => hover.value = 'sync', blur: () => hover.value = null },
])

const arrows = computed<QuansyncGraphArrow[]>(() => [
  // { from: { x: 260, y: 110 }, to: { x: 180, y: 140 }, color: 'red' },
])
</script>

<template>
  <QuansyncGraphCore
    :nodes="nodes"
    :arrows="arrows"
    :width="600"
    :height="450"
    :margin-x="80"
    link-anchor="center"
  />
</template>
