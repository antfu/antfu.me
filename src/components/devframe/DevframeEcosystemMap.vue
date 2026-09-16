<script setup lang="ts">
import { curveBumpX, curveBumpY, line } from 'd3-shape'

type NodeId
  = 'devframe'
    | 'embedded'
    | 'cli'
    | 'dev-server'
    | 'static-build'
    | 'mcp'
    | 'other-devframes'
    | 'hub'
    | 'handler'
    | 'nitro'
    | 'hono'
    | 'next'
    | 'vite-devtools'
    | 'any-framework'
    | 'vue-devtools'
    | 'nuxt-devtools'
    | 'astro-devtools'
    | 'rsbuild'
    | 'more-vite-devtools'
    | 'sveltekit-devtools'
    | 'solidjs-devtools'

type NodeColor = 'core' | 'surface' | 'protocol' | 'framework' | 'neutral' | 'vite'
type NodeShape = 'card' | 'pill'
type NodeStyle = 'solid' | 'dashed'
type EdgeDirection = 'auto' | 'horizontal' | 'vertical'

interface Point {
  x: number
  y: number
}

interface EcosystemNode {
  color: NodeColor
  height: number
  href?: string
  icon?: string
  id: NodeId
  image?: string
  label: string
  linksFrom?: string | Omit<EcosystemEdge, 'target'> | (Omit<EcosystemEdge, 'target'> | string)[]
  note?: string
  position: Point
  shape: NodeShape
  style: NodeStyle
  width: number
}

interface EcosystemEdge {
  dashed?: boolean
  direction?: EdgeDirection
  emphasis?: boolean
  label?: string
  labelOffset?: number
  source: NodeId
  target: NodeId
  waypoints?: Point[]
}

type LayoutNode = Omit<EcosystemNode, 'position'> & Point

interface LayoutEdge extends EcosystemEdge {
  d: string
  labelPosition?: Point
}

const diagramPadding = { x: 24, y: 24 }

const HEIGHT = 45

const colorClasses: Record<NodeColor, string> = {
  core: 'border-teal-500/45 bg-teal-500/10 text-teal-700! hover:border-b-teal-500/45! dark:text-teal-300!',
  surface: 'border-sky-500/35 bg-sky-500/8 text-sky-700! hover:border-b-sky-500/35! dark:text-sky-300!',
  protocol: 'border-blue-500/40 bg-blue-500/9 text-blue-700! hover:border-b-blue-500/40! dark:text-blue-300!',
  vite: 'border-violet-500/35 bg-violet-500/8 text-violet-700! hover:border-b-violet-500/35! dark:text-violet-300!',
  framework: 'border-green-500/35 bg-green-500/8 text-green-700! hover:border-b-green-500/35! dark:text-green-300!',
  neutral: 'border-gray-400/50 bg-gray-500/6 text-gray-600! dark:text-gray-400!',
}

const nodes: EcosystemNode[] = [
  {
    id: 'embedded',
    linksFrom: 'devframe',
    label: 'Embedded App',
    note: 'In-app surface',
    icon: 'i-ph-code-duotone',
    href: 'https://devfra.me/adapters/embedded',
    color: 'surface',
    shape: 'card',
    style: 'solid',
    position: { x: 0, y: 50 },
    width: 160,
    height: HEIGHT,
  },
  {
    id: 'cli',
    linksFrom: ['dev-server', 'mcp', 'static-build'],
    label: 'Standalone CLI',
    icon: 'i-ph-terminal-window-duotone',
    href: 'https://devfra.me/guide/standalone-cli',
    color: 'surface',
    shape: 'card',
    style: 'solid',
    position: { x: 350, y: -10 },
    width: 160,
    height: HEIGHT,
  },
  {
    id: 'dev-server',
    linksFrom: 'devframe',
    label: 'Dev Server',
    note: 'Standard dev server',
    icon: 'i-ph-browser-duotone',
    href: 'https://devfra.me/adapters/dev',
    color: 'surface',
    shape: 'card',
    style: 'solid',
    position: { x: 100, y: -10 },
    width: 180,
    height: HEIGHT,
  },
  {
    id: 'static-build',
    linksFrom: 'devframe',
    label: 'Static Build',
    note: 'Build to SPA for snapshoting',
    icon: 'i-ph-package-duotone',
    href: 'https://devfra.me/adapters/build',
    color: 'surface',
    shape: 'card',
    style: 'solid',
    position: { x: 200, y: 80 },
    width: 180,
    height: HEIGHT,
  },
  {
    id: 'mcp',
    linksFrom: 'devframe',
    label: 'MCP Server',
    icon: 'i-octicon-mcp-24',
    href: 'https://devfra.me/adapters/mcp',
    color: 'surface',
    shape: 'card',
    style: 'solid',
    position: { x: 400, y: 80 },
    width: 180,
    height: HEIGHT,
  },
  {
    id: 'devframe',
    label: 'Devframe',
    note: 'Universal DevTools Definition',
    image: '/images/devframe/devframe.svg',
    href: 'https://devfra.me/guide/devframe-definition',
    color: 'core',
    shape: 'card',
    style: 'solid',
    position: { x: 100, y: 180 },
    width: 180,
    height: HEIGHT,
  },
  {
    id: 'other-devframes',
    label: 'Other Devframes…',
    note: 'Augments multiple Devframes',
    icon: 'i-ph-stack-duotone',
    color: 'neutral',
    shape: 'card',
    style: 'dashed',
    position: { x: 350, y: 180 },
    width: 180,
    height: HEIGHT,
  },
  {
    id: 'hub',
    linksFrom: [
      { source: 'devframe', direction: 'vertical' },
      { source: 'other-devframes', dashed: true },
    ],
    label: 'Devframe Hub',
    note: 'Optional composition',
    icon: 'i-ph-circles-four-duotone',
    href: 'https://devfra.me/guide/hub',
    color: 'core',
    shape: 'card',
    style: 'solid',
    position: { x: 250, y: 300 },
    width: 180,
    height: HEIGHT,
  },
  {
    id: 'handler',
    linksFrom: [
      {
        source: 'devframe',
        emphasis: true,
        label: 'initDevframe()',
        labelOffset: 0,
        waypoints: [
          { x: 70, y: 320 },
        ],
      },
      { source: 'hub', emphasis: true, label: 'initHub()', labelOffset: 0 },
    ],
    label: 'Standard Handler',
    note: 'Request → Response · Middleware',
    icon: 'i-ph-arrows-left-right-duotone',
    href: 'https://devfra.me/adapters/initiate',
    color: 'protocol',
    shape: 'card',
    style: 'solid',
    position: { x: 250, y: 420 },
    width: 250,
    height: HEIGHT,
  },
  {
    id: 'nitro',
    linksFrom: 'handler',
    label: 'Nitro',
    icon: 'i-unjs-nitro',
    href: 'https://github.com/devframes/devframe/tree/main/examples/hub-nitro',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 10, y: 480 },
    width: 100,
    height: HEIGHT,
  },
  {
    id: 'hono',
    linksFrom: { source: 'handler', direction: 'vertical' },
    label: 'Hono',
    icon: 'i-logos-hono',
    href: 'https://github.com/devframes/devframe/tree/main/examples/hub-hono',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 110, y: 530 },
    width: 100,
    height: HEIGHT,
  },
  {
    id: 'next',
    linksFrom: { source: 'handler', dashed: true, direction: 'vertical' },
    label: 'Next.js',
    icon: 'i-logos-nextjs-icon',
    href: 'https://github.com/devframes/devframe/tree/main/examples/hub-next',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 400, y: 530 },
    width: 100,
    height: HEIGHT,
  },
  {
    id: 'any-framework',
    linksFrom: 'handler',
    label: 'Any Frameworks',
    note: 'Handler-compatible',
    icon: 'i-ph-infinity-duotone',
    href: 'https://devfra.me/adapters/initiate',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 520, y: 460 },
    width: 160,
    height: HEIGHT,
  },
  {
    id: 'vite-devtools',
    linksFrom: { source: 'handler', emphasis: true },
    label: 'Vite DevTools',
    note: 'First flagship host',
    image: '/images/devframe/vite.svg',
    href: 'https://devtools.vite.dev/guide/',
    color: 'vite',
    shape: 'pill',
    style: 'solid',
    position: { x: 250, y: 570 },
    width: 160,
    height: HEIGHT,
  },
  {
    id: 'astro-devtools',
    linksFrom: { source: 'vite-devtools', dashed: true },
    label: 'Astro',
    icon: 'i-logos-astro-icon',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 0, y: 640 },
    width: 90,
    height: HEIGHT,
  },
  {
    id: 'sveltekit-devtools',
    linksFrom: { source: 'vite-devtools', dashed: true, direction: 'vertical' },
    label: 'SvelteKit',
    icon: 'i-logos-svelte-icon',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 120, y: 660 },
    width: 100,
    height: HEIGHT,
  },
  {
    id: 'solidjs-devtools',
    linksFrom: { source: 'vite-devtools', dashed: true, direction: 'vertical' },
    label: 'Solid',
    icon: 'i-logos-solidjs-icon',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 390, y: 660 },
    width: 100,
    height: HEIGHT,
  },
  {
    id: 'more-vite-devtools',
    linksFrom: { source: 'vite-devtools', dashed: true },
    label: 'Frameworks on Vite',
    note: 'Framework-specific layers',
    icon: 'i-ph-dots-three-circle-duotone',
    color: 'neutral',
    shape: 'pill',
    style: 'dashed',
    position: { x: 500, y: 600 },
    width: 190,
    height: HEIGHT,
  },
  {
    id: 'vue-devtools',
    linksFrom: 'vite-devtools',
    label: 'Vue DevTools',
    icon: 'i-logos-vue',
    href: 'https://devtools.vuejs.org/guide/vite-plugin',
    color: 'framework',
    shape: 'pill',
    style: 'solid',
    position: { x: 160, y: 730 },
    width: 130,
    height: HEIGHT,
  },
  {
    id: 'nuxt-devtools',
    linksFrom: [{ source: 'vite-devtools', emphasis: true }, 'vue-devtools'],
    label: 'Nuxt DevTools',
    icon: 'i-logos-nuxt-icon',
    href: 'https://devtools.nuxt.com/guide/getting-started',
    color: 'framework',
    shape: 'pill',
    style: 'solid',
    position: { x: 340, y: 730 },
    width: 130,
    height: HEIGHT,
  },
]

const edges: EcosystemEdge[] = nodes.flatMap((node) => {
  if (!node.linksFrom)
    return []

  const links = Array.isArray(node.linksFrom) ? node.linksFrom : [node.linksFrom]
  return links.map(link => ({
    ...(typeof link === 'string' ? { source: link as NodeId } : link),
    target: node.id,
  }))
})

const rawLayoutNodes: LayoutNode[] = nodes.map(({ position, ...node }) => ({
  ...node,
  ...position,
}))
const bounds = layoutBounds(rawLayoutNodes)
const diagramWidth = bounds.width + diagramPadding.x * 2
const diagramHeight = bounds.height + diagramPadding.y * 2
const layoutNodes: LayoutNode[] = rawLayoutNodes.map(node => ({
  ...node,
  x: node.x - bounds.left + diagramPadding.x,
  y: node.y - bounds.top + diagramPadding.y,
}))
const layoutNodesById = Object.fromEntries(layoutNodes.map(node => [node.id, node])) as Record<NodeId, LayoutNode>

const verticalEdgeLine = line<Point>()
  .x(point => point.x)
  .y(point => point.y)
  .curve(curveBumpY)

const horizontalEdgeLine = line<Point>()
  .x(point => point.x)
  .y(point => point.y)
  .curve(curveBumpX)

const layoutEdges: LayoutEdge[] = edges.map((edge) => {
  const source = layoutNodesById[edge.source]
  const target = layoutNodesById[edge.target]
  const waypoints = edge.waypoints?.map(point => ({
    x: point.x - bounds.left + diagramPadding.x,
    y: point.y - bounds.top + diagramPadding.y,
  })) ?? []
  const routedPoints = clipEdge([source, ...waypoints, target], source, target)
  const direction = edge.direction ?? 'auto'
  const lineGenerator = direction === 'horizontal'
    ? horizontalEdgeLine
    : direction === 'vertical'
      ? verticalEdgeLine
      : Math.abs(target.x - source.x) > Math.abs(target.y - source.y) * 1.2
        ? horizontalEdgeLine
        : verticalEdgeLine

  return {
    ...edge,
    d: lineGenerator(routedPoints) ?? '',
    labelPosition: edge.label
      ? pointAlongPolyline(routedPoints, 0.5, edge.labelOffset ?? 0)
      : undefined,
  }
})

function layoutBounds(layoutNodes: LayoutNode[]) {
  const left = Math.min(...layoutNodes.map(node => node.x - node.width / 2))
  const right = Math.max(...layoutNodes.map(node => node.x + node.width / 2))
  const top = Math.min(...layoutNodes.map(node => node.y - node.height / 2))
  const bottom = Math.max(...layoutNodes.map(node => node.y + node.height / 2))

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  }
}

function clipEdge(points: Point[], source: LayoutNode, target: LayoutNode): Point[] {
  if (points.length < 2)
    return points

  const routed = points.map(point => ({ ...point }))
  routed[0] = pointOnNodeBoundary(routed[0]!, routed[1]!, source)
  routed[routed.length - 1] = pointOnNodeBoundary(routed[routed.length - 1]!, routed[routed.length - 2]!, target)
  return routed
}

function pointOnNodeBoundary(center: Point, toward: Point, node: LayoutNode): Point {
  const dx = toward.x - center.x
  const dy = toward.y - center.y
  const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : node.width / 2 / Math.abs(dx)
  const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : node.height / 2 / Math.abs(dy)
  const scale = Math.min(scaleX, scaleY)

  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale,
  }
}

function pointAlongPolyline(points: Point[], ratio: number, offset = 0): Point {
  const segments = points.slice(1).map((point, index) => {
    const previous = points[index]!
    return {
      dx: point.x - previous.x,
      dy: point.y - previous.y,
      length: Math.hypot(point.x - previous.x, point.y - previous.y),
      previous,
    }
  })
  const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0)
  let distance = totalLength * ratio

  for (const segment of segments) {
    if (distance > segment.length) {
      distance -= segment.length
      continue
    }

    const progress = segment.length === 0 ? 0 : distance / segment.length
    const normalX = segment.length === 0 ? 0 : -segment.dy / segment.length
    const normalY = segment.length === 0 ? 0 : segment.dx / segment.length
    return {
      x: segment.previous.x + segment.dx * progress + normalX * offset,
      y: segment.previous.y + segment.dy * progress + normalY * offset,
    }
  }

  return points.at(-1) ?? { x: 0, y: 0 }
}

function nodeStyle(node: LayoutNode) {
  return {
    height: `${node.height}px`,
    left: `${node.x - node.width / 2}px`,
    top: `${node.y - node.height / 2}px`,
    width: `${node.width}px`,
  }
}
</script>

<template>
  <figure
    aria-labelledby="devframe-ecosystem-map-title"
    class="box-border w-[min(56rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-[#8883] rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 mx-[50%] my-11! text-gray-700 shadow-[0_1.25rem_4rem_#0000000d] dark:from-[#111113] dark:to-[#09090b] dark:text-gray-300 dark:shadow-[0_1.25rem_4rem_#0006] max-sm:w-[calc(100vw-1rem)]"
  >
    <header flex items-end justify-between gap-4 px-6 pb-3 pt-5 max-sm:items-start max-sm:px-4>
      <div>
        <div id="devframe-ecosystem-map-title" text-lg font-700>
          One Devframe, Many Destinations
        </div>
        <div text-sm op50>
          Run standalone, compose into a Hub, or mount into any host
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-3 text-[0.65rem] op60 max-sm:hidden">
        <span flex items-center gap-1.5>
          <span w-4 border="t solid gray-400/60" />
          Available path
        </span>
        <span flex items-center gap-1.5>
          <span w-4 border="t dashed gray-400/60" />
          Ecosystem extension
        </span>
      </div>
    </header>

    <div overflow-x-auto px-6 pb-6 pt-3 max-sm:px-4>
      <div
        class="relative mx-auto"
        :style="{ height: `${diagramHeight}px`, width: `${diagramWidth}px` }"
      >
        <svg
          aria-hidden="true"
          absolute inset-0 h-full w-full overflow-visible
          :viewBox="`0 0 ${diagramWidth} ${diagramHeight}`"
        >
          <defs>
            <marker
              id="devframe-ecosystem-arrow"
              markerHeight="8"
              markerUnits="userSpaceOnUse"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path class="fill-gray-400 dark:fill-gray-500" d="M 0 0 L 8 4 L 0 8 Z" />
            </marker>
            <marker
              id="devframe-ecosystem-arrow-emphasis"
              markerHeight="8"
              markerUnits="userSpaceOnUse"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
              viewBox="0 0 8 8"
            >
              <path class="fill-teal-500 dark:fill-teal-400" d="M 0 0 L 8 4 L 0 8 Z" />
            </marker>
          </defs>

          <g
            v-for="edge of layoutEdges"
            :key="`${edge.source}-${edge.target}`"
            :class="edge.emphasis ? 'opacity-60 dark:opacity-55' : 'opacity-55'"
          >
            <path
              :d="edge.d"
              fill="none"
              :marker-end="`url(#devframe-ecosystem-arrow${edge.emphasis ? '-emphasis' : ''})`"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              :stroke-width="edge.emphasis ? 2.5 : 1.5"
              :stroke-dasharray="edge.dashed ? '4 4 ' : undefined"
              :class="edge.emphasis ? 'text-teal-500 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'"
            />
          </g>

          <text
            v-for="edge of layoutEdges.filter(edge => edge.labelPosition)"
            :key="`${edge.source}-${edge.target}-label`"
            :x="edge.labelPosition!.x"
            :y="edge.labelPosition!.y"
            class="fill-gray-500 stroke-zinc-50 dark:fill-gray-400 dark:stroke-[#101012]"
            font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            paint-order="stroke"
            stroke-linejoin="round"
            stroke-width="6"
            style="font-size: 12px !important"
            text-anchor="middle"
          >
            {{ edge.label }}
          </text>
        </svg>

        <component
          :is="node.href ? 'a' : 'div'"
          v-for="node of layoutNodes"
          :key="node.id"
          :href="node.href"
          :target="node.href ? '_blank' : undefined"
          :rel="node.href ? 'noreferrer' : undefined"
          class="group absolute z-1 flex items-center gap-1.5 overflow-hidden border px3 no-underline! outline-none transition-transform duration-200 ease-out"
          :class="[
            colorClasses[node.color],
            node.shape === 'pill' ? 'justify-center rounded-full' : 'rounded-xl',
            node.style === 'dashed' && 'border-dashed',
            node.href && 'hover:z-5 hover:scale-[1.025] focus-visible:z-5 focus-visible:scale-[1.025] focus-visible:ring-2 focus-visible:ring-current/40',
          ]"
          :style="nodeStyle(node)"
          :aria-label="node.href ? `Open ${node.label} documentation` : node.label"
        >
          <img
            v-if="node.image"
            :src="node.image"
            alt=""
            class="m-0! h-4.5! w-4.5! shrink-0 object-contain"
          >
          <span v-else :class="node.icon" h-4.5 w-4.5 shrink-0 text-4.5 aria-hidden="true" />
          <span min-w-0 flex-1 overflow-hidden leading-tight>
            <span class="block truncate text-[0.7rem] font-600">{{ node.label }}</span>
            <span v-if="node.note" class="block truncate text-[0.56rem] op55">{{ node.note }}</span>
          </span>
          <span
            v-if="node.href"
            i-ph-arrow-up-right-bold
            absolute right-1.5 top-1.5 text-2.5 op0 transition-opacity
            group-hover:op45 group-focus-visible:op45
            aria-hidden="true"
          />
        </component>
      </div>
    </div>

    <figcaption class="border-t border-[#8883] bg-[#88808] px-6 py-3 text-xs op65 max-sm:px-4">
      A Devframe can run alone, join a Hub, or mount directly through the same standard handler. Vite DevTools is one host; framework DevTools can inherit and extend it.
    </figcaption>
  </figure>
</template>
