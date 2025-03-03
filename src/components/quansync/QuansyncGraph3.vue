<script setup lang="ts">
import type { QuansyncGraphArrow, QuansyncGraphNode } from './_types'

const nodes = computed<QuansyncGraphNode[]>(() => [
  { id: 'a0', name: '[async consumers]', color: 'red', x: 120, y: -60, to: ['a1'] },
  { id: 'a1', name: 'readNearestPkg()', color: 'red', x: 130, y: 20, to: ['a2'] },
  { id: 'a2', name: 'findUp()', color: 'red', x: 140, y: 100, to: ['a3'] },
  { id: 'a3', name: 'locatePath()', color: 'red', x: 150, y: 180, to: ['a4'] },
  { id: 'a4', name: 'fs.stat()', color: 'red', x: 160, y: 260 },

  { id: 's0', name: '[sync consumers]', color: 'blue', x: 350, y: -60, to: ['s1'] },
  { id: 's1', name: 'readNearestPkgSync()', color: 'blue', x: 360, y: 20, to: ['s2'] },
  { id: 's2', name: 'findUpSync()', color: 'blue', x: 370, y: 100, to: ['s3'] },
  { id: 's3', name: 'locatePathSync()', color: 'blue', x: 380, y: 180, to: ['s4'] },
  { id: 's4', name: 'fs.statSync()', color: 'blue', x: 390, y: 260 },
])

const arrows = computed<QuansyncGraphArrow[]>(() => [
  // { from: { x: 260, y: 110 }, to: { x: 180, y: 140 }, color: 'red' },
])

const packages = computed(() => [
  { name: 'my-pkg', y: 100 },
  { name: 'find-up', y: 180 },
  { name: 'locate-path', y: 260 },
])
</script>

<template>
  <QuansyncGraphCore
    :nodes="nodes"
    :arrows="arrows"
    :width="580"
    :height="400"
    :margin-y="50"
    :margin-x="70"
  >
    <g v-for="pkg of packages" :key="pkg.name">
      <text
        x="10"
        :y="pkg.y + 5"
        font-family="monospace"
        font-size="4"
        class="fill-purple"
      >
        {{ pkg.name }}
      </text>
      <rect
        x="0"
        :y="pkg.y"
        width="560"
        height="60"
        rx="10"
        ry="10"
        stroke-dasharray="4 2"
        class="fill-none stroke-purple:50"
      />
    </g>
  </QuansyncGraphCore>
</template>
