<script setup lang="ts">
import type { QuansyncGraphArrow, QuansyncGraphLink, QuansyncGraphNode } from './_types'
import { linkVertical } from 'd3-shape'

const props = withDefaults(
  defineProps<{
    nodes: QuansyncGraphNode[]
    arrows?: QuansyncGraphArrow[]
    width?: number
    height?: number
    marginX?: number
    marginY?: number
    linkAnchor?: 'left' | 'center'
  }>(),
  {
    arrows: () => [],
    marginX: 20,
    marginY: 20,
    linkAnchor: 'left',
  },
)

const COLORS_STROKE = {
  red: 'stroke-current text-rose:50',
  blue: 'stroke-current text-blue:50',
  purple: 'stroke-current text-purple:50',
  none: 'stroke-current text-#ddd dark:text-#444',
}

const COLORS_LINE = {
  red: 'stroke-current text-rose',
  blue: 'stroke-current text-blue',
  purple: 'stroke-current text-purple',
  none: 'stroke-current text-#ddd dark:text-#444',
}

const COLORS_FILL_BG = {
  red: 'fill-#fae3e6 dark:fill-#472127',
  blue: 'fill-#e0f2fe dark:fill-#192a59',
  purple: 'fill-#f5f3ff dark:fill-#271347',
  none: 'fill-#f8f8f8 dark:fill-#222',
}

const COLORS_FILL_FG = {
  red: 'fill-rose',
  blue: 'fill-blue',
  purple: 'fill-purple',
  none: 'fill-#222 dark:fill-#eee',
}

const CELL_HEIGHT = 30
const CELL_PADDING_X = 15
const CELL_CHAR_WIDTH = 10

const rawX = computed(() => [
  ...props.nodes.map(node => node.x),
  ...props.arrows.flatMap(arrow => [arrow.from.x, arrow.to.x]),
])
const rawY = computed(() => [
  ...props.nodes.map(node => node.y),
  ...props.arrows.flatMap(arrow => [arrow.from.y, arrow.to.y]),
])

const offsetX = computed(() => props.marginX - Math.min(...rawX.value))
const offsetY = computed(() => props.marginY - Math.min(...rawY.value))
const contentWidth = computed(() => Math.max(...rawX.value) + props.marginX * 2)
const contentHeight = computed(() => Math.max(...rawY.value) + props.marginY * 2)

const nodes = computed<QuansyncGraphNode[]>(() => {
  return props.nodes.map(node => ({
    ...node,
    x: node.x + offsetX.value,
    y: node.y + offsetY.value,
  }))
})

const arrows = computed(() => {
  return props.arrows.map(arrow => ({
    ...arrow,
    from: {
      x: arrow.from.x + offsetX.value,
      y: arrow.from.y + offsetY.value,
    },
    to: {
      x: arrow.to.x + offsetX.value,
      y: arrow.to.y + offsetY.value,
    },
  }))
})

function centerX(node: QuansyncGraphNode) {
  return node.x + node.name.length * CELL_CHAR_WIDTH / 2 + CELL_PADDING_X
}

const links = computed(() => {
  return nodes.value
    .filter(node => node.to)
    .flatMap<QuansyncGraphLink>(source => source.to?.map((to: string): QuansyncGraphLink => {
      const target = nodes.value.find(n => n.id === to)!
      let color = target.color || source.color || 'none'
      if (target.color === 'none' || source.color === 'none') {
        color = 'none'
      }
      return {
        id: `${source.id}-${target.id}`,
        source,
        target,
        color,
      }
    }) || [],
    )
})

function linksPath(link: QuansyncGraphLink) {
  if (props.linkAnchor === 'center') {
    return linkVertical<any, QuansyncGraphLink, [number, number]>()
      .source(d => [centerX(d.source), d.source.y])
      .target(d => [centerX(d.target), d.target.y])(link)!
  }
  return linkVertical<any, QuansyncGraphLink, [number, number]>()
    .source(d => [d.source.x + 3, d.source.y])
    .target(d => [d.target.x + 3, d.target.y])(link)!
}
</script>

<template>
  <div flex="~ justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      :viewBox="`0 0 ${width ?? contentWidth} ${height ?? contentHeight}`"
      select-none w-full
    >
      <defs>
        <marker
          v-for="[color, value] of Object.entries(COLORS_LINE)"
          :id="`arrow-${color}`"
          :key="color"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          fill="currentColor"
          :class="value"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <g>
        <path
          v-for="(link) of links"
          :key="link.id"
          :d="linksPath(link)"
          class="transition-all duration-600"
          fill="none"
          :class="COLORS_STROKE[link.color || 'none']"
        />
      </g>
      <g>
        <g
          v-for="(node) of nodes" :key="node.id"
          @pointerenter="node.hover"
          @pointerleave="node.blur"
          @pointermove="node.hover"
          @pointerout="node.blur"
        >
          <rect
            :x="node.x"
            :y="node.y - CELL_HEIGHT / 2"
            :width="node.name.length * CELL_CHAR_WIDTH + CELL_PADDING_X * 2"
            :height="CELL_HEIGHT"
            class="transition-all duration-600"
            rx="8"
            ry="8"
            :class="[
              COLORS_FILL_BG[node.color || 'none'],
              COLORS_STROKE[node.color || 'none'],
            ]"
          />
          <text
            :x="node.x + node.name.length * CELL_CHAR_WIDTH / 2 + CELL_PADDING_X"
            :y="node.y"
            font-family="monospace"
            text-anchor="middle"
            font-size="4"
            class="transition-all duration-600"
            :class="COLORS_FILL_FG[node.color || 'none']"
            transform="translate(0, 5)"
          >
            {{ node.name }}
          </text>
        </g>
      </g>
      <g>
        <g v-for="(arrow, index) of arrows" :key="index">
          <!-- array from arrow.from to arrow.to, with an arrow head at the end -->
          <line
            :x1="arrow.from.x"
            :y1="arrow.from.y"
            :x2="arrow.to.x"
            :y2="arrow.to.y"
            stroke-width="2"
            class="transition-all duration-600"
            :class="COLORS_LINE[arrow.color || 'none']"
            :marker-end="`url(#arrow-${arrow.color || 'none'})`"
          />
        </g>
      </g>
      <slot />
    </svg>
  </div>
</template>
