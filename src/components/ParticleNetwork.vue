<script setup lang="ts">
const props = defineProps<{
  nodeCount?: number
  maxDistance?: number
  colors?: string[]
}>()

const colors = props.colors || [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
]

const nodeCount = props.nodeCount || 30
const maxDist = props.maxDistance || 20

const nodes = ref<Array<{ x: number, y: number, vx: number, vy: number, color: string }>>([])

function initNodes() {
  for (let i = 0; i < nodeCount; i++) {
    nodes.value.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

function updateNodes() {
  nodes.value.forEach((node) => {
    node.x += node.vx
    node.y += node.vy
    if (node.x < 0 || node.x > 100)
      node.vx *= -1
    if (node.y < 0 || node.y > 100)
      node.vy *= -1
  })
}

let animationId: number
onMounted(() => {
  initNodes()
  const animate = () => {
    updateNodes()
    animationId = requestAnimationFrame(animate)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})

const allConnections = computed(() => {
  const connections: Array<{ x1: number, y1: number, x2: number, y2: number, opacity: number, color: string }> = []
  nodes.value.forEach((node, i) => {
    nodes.value.forEach((other, j) => {
      if (i >= j)
        return
      const dx = node.x - other.x
      const dy = node.y - other.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < maxDist) {
        connections.push({
          x1: node.x,
          y1: node.y,
          x2: other.x,
          y2: other.y,
          opacity: 1 - dist / maxDist,
          color: node.color,
        })
      }
    })
  })
  return connections
})
</script>

<template>
  <div class="particle-container">
    <svg class="particle-network" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <line
        v-for="(conn, i) in allConnections"
        :key="`line-${i}`"
        :x1="conn.x1"
        :y1="conn.y1"
        :x2="conn.x2"
        :y2="conn.y2"
        :stroke="conn.color"
        :stroke-opacity="conn.opacity * 0.6"
        stroke-width="0.08"
      />

      <circle
        v-for="(node, i) in nodes"
        :key="`node-${i}`"
        :cx="node.x"
        :cy="node.y"
        r="0.3"
        :fill="node.color"
        class="node-pulse"
      />
    </svg>
  </div>
</template>

<style scoped>
.particle-container {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.particle-network {
  width: 100%;
  height: 100%;
}

.node-pulse {
  animation: nodePulse 3s ease-in-out infinite;
}

@keyframes nodePulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
