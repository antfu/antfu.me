<script setup lang="ts">
import type { QuansyncGraphArrow, QuansyncGraphNode } from './_types'

const nodes1 = computed<QuansyncGraphNode[]>(() => [
  { id: '1', name: 'build()', color: 'none', x: 0, y: 0, to: ['2'] },
  { id: '2', name: 'transform()', color: 'none', x: 10, y: 50, to: ['3'] },
  { id: '3', name: 'parse()', color: 'none', x: 20, y: 100, to: ['4'] },
  { id: '4', name: 'loadFile()', color: 'none', x: 30, y: 150, to: ['5'] },
  { id: '5', name: 'replace()', color: 'none', x: 40, y: 200 },
])

const arrows1 = computed<QuansyncGraphArrow[]>(() => [
  { from: { x: 230, y: 120 }, to: { x: 180, y: 140 }, color: 'red' },
])

const OFFSET = 300

const nodes2 = computed<QuansyncGraphNode[]>(() => [
  { id: 'b1', name: 'await build()', color: 'red', x: OFFSET + 0, y: 0, to: ['b2'] },
  { id: 'b2', name: 'await transform()', color: 'red', x: OFFSET + 10, y: 50, to: ['b3'] },
  { id: 'b3', name: 'await parse()', color: 'red', x: OFFSET + 20, y: 100, to: ['b4'] },
  { id: 'b4', name: 'await loadFile()', color: 'red', x: OFFSET + 30, y: 150, to: ['b5'] },
  { id: 'b5', name: 'replace()', color: 'none', x: OFFSET + 40, y: 200 },
])
</script>

<template>
  <QuansyncGraphCore :nodes="[...nodes1, ...nodes2]" :arrows="arrows1" :width="600" />
</template>
