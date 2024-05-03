<script setup lang='ts'>
import type { Fn } from '@vueuse/core'

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const color = '#88888825'

const el = ref<HTMLCanvasElement | null>(null)

const { random } = Math
const size = reactive(useWindowSize())

const start = ref<Fn>(() => {})
const MIN_BRANCH = 30
const len = ref(6)
const stopped = ref(false)

function initCanvas(canvas: HTMLCanvasElement, width = 400, height = 400, _dpi?: number) {
  const ctx = canvas.getContext('2d')!

  const dpr = window.devicePixelRatio || 1
  // @ts-expect-error vendor
  const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1

  const dpi = _dpi || dpr / bsr

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = dpi * width
  canvas.height = dpi * height
  ctx.scale(dpi, dpi)

  return { ctx, dpi }
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}

onMounted(async () => {
  const canvas = el.value!
  const { ctx } = initCanvas(canvas, size.width, size.height)
  const { width, height } = canvas

  let steps: Fn[] = []
  let prevSteps: Fn[] = []

  const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
    const length = random() * len.value
    counter.value += 1

    const [nx, ny] = polar2cart(x, y, length, rad)

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()

    const rad1 = rad + random() * r15
    const rad2 = rad - random() * r15

    // out of bounds
    if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
      return

    const rate = counter.value <= MIN_BRANCH
      ? 0.8
      : 0.5

    // left branch
    if (random() < rate)
      steps.push(() => step(nx, ny, rad1, counter))

    // right branch
    if (random() < rate)
      steps.push(() => step(nx, ny, rad2, counter))
  }

  let lastTime = performance.now()
  const interval = 1000 / 40 // 50fps

  let controls: ReturnType<typeof useRafFn>

  const frame = () => {
    if (performance.now() - lastTime < interval)
      return

    prevSteps = steps
    steps = []
    lastTime = performance.now()

    if (!prevSteps.length) {
      controls.pause()
      stopped.value = true
    }

    // Execute all the steps from the previous frame
    prevSteps.forEach((i) => {
      // 50% chance to keep the step for the next frame, to create a more organic look
      if (random() < 0.5)
        steps.push(i)
      else
        i()
    })
  }

  controls = useRafFn(frame, { immediate: false })

  /**
   * 0.2 - 0.8
   */
  const randomMiddle = () => random() * 0.6 + 0.2

  start.value = () => {
    controls.pause()
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1
    ctx.strokeStyle = color
    prevSteps = []
    steps = [
      () => step(randomMiddle() * size.width, -5, r90),
      () => step(randomMiddle() * size.width, size.height + 5, -r90),
      () => step(-5, randomMiddle() * size.height, 0),
      () => step(size.width + 5, randomMiddle() * size.height, r180),
    ]
    if (size.width < 500)
      steps = steps.slice(0, 2)
    controls.resume()
    stopped.value = false
  }

  start.value()
})
const mask = computed(() => 'radial-gradient(circle, transparent, black);')
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
    style="z-index: -1"
    :style="`mask-image: ${mask};--webkit-mask-image: ${mask};`"
  >
    <canvas ref="el" width="400" height="400" />
  </div>
</template>
