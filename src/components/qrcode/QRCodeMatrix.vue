<script setup lang="ts">
const props = defineProps<{
  title?: string
  src: string
  xTitle: string
  xScale: string[] | { min: number; max: number; step: number }
  xValue?: number
  yTitle: string
  yScale: string[] | { min: number; max: number; step: number }
  yValue?: number
  xPadding?: [number, number]
  yPadding?: [number, number]
  aspectRatio: number
  fixedRowsBefore?: [string, string | number][]
  fixedRowsBetween?: [string, string | number][]
  fixedRowsAfter?: [string, string | number][]
  externalLink?: boolean
}>()

const xScaleNormalized = computed(() => {
  const xScale = props.xScale
  if (Array.isArray(xScale))
    return xScale
  else
    return Array.from({ length: Math.round((xScale.max - xScale.min) / xScale.step) + 1 }, (_, i) => (i * xScale.step + xScale.min).toFixed(1))
})

const yScaleNormalized = computed(() => {
  const yScale = props.yScale
  if (Array.isArray(yScale))
    return yScale
  else
    return Array.from({ length: Math.round((yScale.max - yScale.min) / yScale.step) + 1 }, (_, i) => (i * yScale.step + yScale.min).toFixed(1))
})

const xSize = computed(() => xScaleNormalized.value.length)
const ySize = computed(() => yScaleNormalized.value.length)

const x = ref(props.xValue || 0)
const y = ref(props.yValue || 0)

const binding = reactive({
  x,
  y,
  xScaleNormalized,
  yScaleNormalized,
  xValue: computed(() => xScaleNormalized.value[x.value]),
  yValue: computed(() => yScaleNormalized.value[y.value]),
})
</script>

<template>
  <div border="~ base rounded-lg" my2 of-hidden>
    <div v-if="title" text-center op75 py2>
      {{ title }}
    </div>
    <ImageMatrix
      v-model:x="x"
      v-model:y="y"
      :src="props.src"
      :x-count="xSize"
      :y-count="ySize"
      :x-padding="props.xPadding"
      :y-padding="props.yPadding"
      :aspect-ratio="props.aspectRatio"
      :external-link="props.externalLink"
    />
    <slot name="pre" v-bind="binding" />
    <slot v-bind="binding">
      <div grid="~ cols-[max-content_1fr_max-content] gap-x-3 gap-y-1 items-center" py3 px4>
        <template v-for="x, idx of fixedRowsBefore || []" :key="idx">
          <div font-mono text-sm op75 text-right>
            {{ x[0] }}
          </div>
          <div font-mono>
            {{ x[1] }}
          </div>
          <div />
        </template>
        <div font-mono text-sm op75 text-right>
          {{ xTitle }}
        </div>
        <input v-model.number="x" class="slider" type="range" min="0" :max="xSize - 1" :step="1">
        <div font-mono>
          {{ xScaleNormalized[x] }}
        </div>
        <template v-for="x, idx of fixedRowsBetween || []" :key="idx">
          <div font-mono text-sm op75 text-right>
            {{ x[0] }}
          </div>
          <div font-mono>
            {{ x[1] }}
          </div>
          <div />
        </template>
        <div font-mono text-sm op75 text-right>
          {{ yTitle }}
        </div>
        <input v-model.number="y" class="slider" type="range" min="0" :max="ySize - 1" :step="1">
        <div font-mono>
          {{ yScaleNormalized[y] }}
        </div>
        <template v-for="x, idx of fixedRowsAfter || []" :key="idx">
          <div font-mono text-sm op75 text-right>
            {{ x[0] }}
          </div>
          <div font-mono>
            {{ x[1] }}
          </div>
          <div />
        </template>
      </div>
    </slot>
    <slot name="post" v-bind="binding" />
  </div>
</template>

<style scoped>
.slider {
  appearance: none;
  height: 20px;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  --uno: border border-base rounded of-hidden bg-gray:20;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  --uno: dark:bg-white:80 bg-black:50 rounded;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  cursor: pointer;
  --uno: dark:bg-white:80 bg-black:50 rounded;
}
</style>
