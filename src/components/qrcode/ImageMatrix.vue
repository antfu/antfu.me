<script setup lang="ts">
const props = defineProps<{
  src: string
  x?: number
  y?: number
  xCount: number
  yCount: number
  xPadding?: [number, number]
  yPadding?: [number, number]
  aspectRatio: number
  externalLink?: boolean
}>()

const x = defineModel('x', {
  type: Number,
  default: 0,
})

const y = defineModel('y', {
  type: Number,
  default: 0,
})

const xPercent = computed(() => (1 - (props.xPadding?.[0] || 0) - (props.xPadding?.[1] || 0)) * 100)
const yPercent = computed(() => (1 - (props.yPadding?.[0] || 0) - (props.yPadding?.[1] || 0)) * 100)

const imageWidth = computed(() => 100 * props.xCount / (1 - (props.xPadding?.[0] || 0) - (props.xPadding?.[1] || 0)))
const transform = computed(() => `translate(${-x.value * xPercent.value / props.xCount - (props.xPadding?.[0] || 0) * 100}%, ${-y.value * yPercent.value / props.yCount - (props.yPadding?.[0] || 0) * 100}%)`)
</script>

<template>
  <component
    :is="externalLink ? 'a' : 'div'"
    v-bind="externalLink ? {
      href: props.src,
      target: '_blank',
      class: 'no-underline! border-0!',
    } : {}"
    relative of-hidden block bg-gray:30
    :style="{
      aspectRatio: props.aspectRatio,
    }"
  >
    <div scale-101>
      <img
        :src="props.src"
        absolute
        :style="{
          top: 0,
          left: 0,
          margin: 0,
          transform,
          minWidth: `${imageWidth}%`,
        }"
      >
    </div>
  </component>
</template>
