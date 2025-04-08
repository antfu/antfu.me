<script setup lang="ts">
import type { Photo } from '../../../photos/data'

defineProps<{
  photos: Photo[]
}>()

const container = useTemplateRef<HTMLDivElement>('container')
let hasHorizontalScroll = false
function handleWheel(e: WheelEvent) {
  if (hasHorizontalScroll)
    return
  if (e.deltaX !== 0) {
    hasHorizontalScroll = true
    return
  }
  if (!container.value)
    return
  if (container.value.scrollLeft <= 0 && e.deltaY <= 0)
    return
  if (container.value.scrollLeft >= container.value.scrollWidth - container.value.clientWidth && e.deltaY > 0)
    return
  // change vertical scroll to horizontal scroll
  container.value?.scrollTo({
    left: container.value.scrollLeft + e.deltaY,
  })
  e.preventDefault()
}
</script>

<template>
  <div
    ref="container"
    class="photos flex gap-4 py3" w-screen of-x-auto
    style="margin-left: calc(var(--prose-margin) * -1); padding-left: var(--prose-margin); padding-right: var(--prose-margin);"
    @wheel="handleWheel"
  >
    <div v-for="photo, idx in photos" :key="idx" :lang="photo.lang">
      <img
        :src="photo.url"
        :alt="photo.text"
        :data-photo-index="idx"
        loading="lazy"
        w-full aspect-square object-cover
        w-80 h-80 max-w-80 max-h-80 min-w-80 min-h-80
      >
      <div text-sm op75 mt2>
        {{ photo.text }}
      </div>
    </div>
  </div>
</template>
