<script setup lang="ts">
import type { QuansyncGraphArrow, QuansyncGraphNode } from './_types'

const nodes1 = computed<QuansyncGraphNode[]>(() => [
  { id: '1', name: 'await build()', color: 'red', x: 0, y: 0, to: ['2'] },
  { id: '2', name: 'await transform()', color: 'red', x: 10, y: 50, to: ['3'] },
  { id: '3', name: 'await parse()', color: 'red', x: 20, y: 100, to: ['4'] },
  { id: '4', name: 'await loadFile()', color: 'red', x: 30, y: 150, to: ['5'] },
  { id: '5', name: 'replace()', color: 'none', x: 40, y: 200 },
])

const arrows1 = computed<QuansyncGraphArrow[]>(() => [
  { from: { x: 250, y: 80 }, to: { x: 195, y: 95 }, color: 'blue' },
])
const OFFSET = 300

const nodes2 = computed<QuansyncGraphNode[]>(() => [
  { id: 'a1', name: 'await build()', color: 'red', x: OFFSET + 0, y: 0, to: ['a2'] },
  { id: 'a2', name: 'await transform()', color: 'red', x: OFFSET + 10, y: 50, to: ['a3'] },
  { id: 'a3', name: 'parseSync()', color: 'blue', x: OFFSET + 20, y: 100, to: ['a4'] },
  { id: 'a4', name: 'loadFileSync()', color: 'blue', x: OFFSET + 30, y: 150, to: ['a5'] },
  { id: 'a5', name: 'replace()', color: 'blue', x: OFFSET + 40, y: 200 },
])
</script>

<template>
  <QuansyncGraphCore :nodes="[...nodes1, ...nodes2]" :arrows="arrows1" :width="600" />
</template>
