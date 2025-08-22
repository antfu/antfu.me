<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import { blurhashToGradientCssObject } from '@unpic/placeholder'

defineProps<{
  photos: Photo[]
  view?: 'cover' | 'contain'
}>()
</script>

<template>
  <div class="photos grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" max-w-500 mx-auto>
    <div v-for="photo, idx in photos" :key="idx">
      <img
        :src="photo.url"
        :alt="photo.text"
        :data-photo-index="idx"
        :style="photo.blurhash && view !== 'contain' ? blurhashToGradientCssObject(photo.blurhash) as any : ''"
        loading="lazy"
        w-full
        :class="view === 'contain' ? 'object-contain sm:aspect-square' : 'object-cover aspect-square'"
      >
    </div>
  </div>
</template>
