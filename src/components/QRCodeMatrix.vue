<script setup lang="ts">
const props = defineProps<{
  title?: string
  src: string
  xTitle: string
  xScale: [number, number, number]
  xValue: number
  yTitle: string
  yScale: [number, number, number]
  yValue: number
  aspectRatio: number
  fixedRowsBefore?: [string, string | number][]
  fixedRowsBetween?: [string, string | number][]
  fixedRowsAfter?: [string, string | number][]
}>()

const xSize = computed(() => Math.round((props.xScale[1] - props.xScale[0]) / props.xScale[2]) + 1)
const ySize = computed(() => Math.round((props.yScale[1] - props.yScale[0]) / props.yScale[2]) + 1)

const x = ref(props.xValue || 0)
const y = ref(props.yValue || 0)
</script>

<template>
  <div border="~ base rounded-lg" my2>
    <div v-if="title" text-center op75 py2>
      {{ title }}
    </div>
    <div
      relative of-hidden rounded-t-lg
      :style="{
        aspectRatio: props.aspectRatio,
      }"
    >
      <div scale-101>
        <img
          lazy
          :src="props.src"
          absolute
          :style="{
            top: 0,
            left: 0,
            margin: 0,
            transform: `translate(${-x * 100 / xSize}%, ${-y * 100 / ySize}%)`,
            minWidth: `${xSize * 100}%`,
          }"
        >
      </div>
    </div>

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
      <input v-model="x" class="slider" type="range" min="0" :max="xSize - 1" :step="1">
      <div font-mono>
        {{ (x * xScale[2] + xScale[0]).toFixed(1) }}
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
      <input v-model="y" class="slider" type="range" min="0" :max="ySize - 1" :step="1">
      <div font-mono>
        {{ (y * yScale[2] + yScale[0]).toFixed(1) }}
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
