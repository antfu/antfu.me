<script setup lang="ts">
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

const dpr = 1
const SIZE = 250
const cx = SIZE / 2
const cy = SIZE / 2
const maxRadius = SIZE * 0.4

interface Particle {
  color: string
  alpha: number
  original: {
    x: number
    y: number
    alpha: number
  }
  x: number
  y: number
  vx: number
  vy: number
  va: number
}

const particlesRed: Particle[] = []
const particlesBlue: Particle[] = []
const focusTarget = ref<'red' | 'blue' | null>(null)

function pointerIn() {
  if (focusTarget.value)
    return
  focusTarget.value = Math.random() < 0.5 ? 'red' : 'blue'
}
function pointerOut() {
  focusTarget.value = null
}

onMounted(() => {
  const ctx = canvas.value!.getContext('2d', { willReadFrequently: true })!
  ctx.scale(dpr, dpr)
  ctx.font = '50px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#f43f5e'
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.fillText('async', SIZE / 2, SIZE / 2)
  const bitmapRed = ctx.getImageData(0, 0, SIZE, SIZE, { colorSpace: 'srgb' })
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#0ea5e9'
  ctx.fillText('sync', SIZE / 2, SIZE / 2)
  const bitmapBlue = ctx.getImageData(0, 0, SIZE, SIZE, { colorSpace: 'srgb' })
  ctx.clearRect(0, 0, SIZE, SIZE)

  function imageDataToParticles(data: ImageData) {
    const particles: Particle[] = []
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const r = data.data[(y * SIZE + x) * 4 + 0]
        const g = data.data[(y * SIZE + x) * 4 + 1]
        const b = data.data[(y * SIZE + x) * 4 + 2]
        const a = data.data[(y * SIZE + x) * 4 + 3]
        if (a > 0) {
          const deg = Math.random() * Math.PI * 2
          const radius = Math.random() * maxRadius
          particles.push({
            color: `rgb(${r}, ${g}, ${b})`,
            alpha: a / 255,
            original: {
              x,
              y,
              alpha: a / 255,
            },
            x: radius * Math.cos(deg) + cx,
            y: radius * Math.sin(deg) + cy,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            va: 0,
          })
        }
      }
    }
    return particles
  }

  particlesRed.push(...imageDataToParticles(bitmapRed))
  particlesBlue.push(...imageDataToParticles(bitmapBlue))

  function renderParticles(particles: Particle[]) {
    for (const particle of particles) {
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.alpha
      ctx.fillRect(particle.x, particle.y, 1, 1)
    }
    ctx.restore()
  }

  function diffuse(particles: Particle[], speed: number) {
    for (const particle of particles) {
      particle.vx += (Math.random() - 0.5) * 0.5
      particle.vy += (Math.random() - 0.5) * 0.5
      const r = Math.sqrt((particle.x - cx) ** 2 + (particle.y - cy) ** 2)
      if (r > maxRadius) {
        particle.vx += (cx - particle.x) * 0.02
        particle.vy += (cy - particle.y) * 0.02
      }
      if (Math.abs(particle.vx) > 2)
        particle.vx *= 0.9
      if (Math.abs(particle.vy) > 2)
        particle.vy *= 0.9

      particle.x += particle.vx * speed
      particle.y += particle.vy * speed
    }
  }
  function focus(particles: Particle[], speed: number) {
    for (const particle of particles) {
      const dx = particle.original.x - particle.x
      const dy = particle.original.y - particle.y
      particle.vx = dx * 0.1
      particle.vy = dy * 0.1
      particle.x += particle.vx * speed
      particle.y += particle.vy * speed
    }
  }
  function fadeIn(particles: Particle[], speed: number) {
    for (const particle of particles) {
      const da = particle.original.alpha - particle.alpha
      particle.va = Math.min(0.02, da * 0.1)
      particle.alpha += particle.va * speed
    }
  }
  function fadeOut(particles: Particle[], speed: number) {
    for (const particle of particles) {
      const da = 0 - particle.alpha
      particle.va = da * 0.1
      particle.alpha += particle.va * speed
    }
  }

  useRafFn(({ delta }) => {
    const speed = delta / 30
    ctx.clearRect(0, 0, SIZE, SIZE)
    if (focusTarget.value === 'red') {
      focus(particlesRed, speed)
      focus(particlesBlue, speed)
      fadeIn(particlesRed, speed)
      fadeOut(particlesBlue, speed)
    }
    else if (focusTarget.value === 'blue') {
      focus(particlesBlue, speed)
      focus(particlesRed, speed)
      fadeIn(particlesBlue, speed)
      fadeOut(particlesRed, speed)
    }
    else {
      diffuse(particlesRed, speed)
      diffuse(particlesBlue, speed)
      fadeIn(particlesRed, speed)
      fadeIn(particlesBlue, speed)
    }
    if (focusTarget.value === 'red') {
      renderParticles(particlesBlue)
      renderParticles(particlesRed)
    }
    else {
      renderParticles(particlesRed)
      renderParticles(particlesBlue)
    }
  })
})
</script>

<template>
  <div py10 flex="~ items-center justify-center col md:row md:justify-between" text-center>
    <div><b>Quan</b><span op75>tum</span> + <b><span :class="focusTarget === 'red' ? '' : 'op0'" transition duration-1000>a</span>Sync</b></div>

    <div
      flex="~" select-none
      my--4
    >
      <canvas
        ref="canvas"
        ma
        transition-all
        duration-300
        :width="SIZE * dpr"
        :height="SIZE * dpr"
        :class="focusTarget ? '' : 'blur-1px'"
        @pointerenter="pointerIn"
        @pointerover="pointerIn"
        @pointerout="pointerOut"
        @pointerleave="pointerOut"
      />
    </div>

    <div op75>
      <em transition-all duration-1000 :class="focusTarget === 'red' ? 'text-rose!' : focusTarget ? 'text-sky!' : 'text-purple!'">"Superposition"</em>
      <br>between <code important-text-sky transition-all duration-1000 :class="focusTarget === 'red' ? 'saturate-0' : ''">sync</code>
      and <code important-text-rose transition-all duration-1000 :class="focusTarget === 'blue' ? 'saturate-0' : ''">async</code>
    </div>
  </div>
</template>
