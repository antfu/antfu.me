<script setup lang="ts">
import type { Photo } from '../../../photos/data'

defineProps<{
  photos: Photo[]
}>()
</script>

<template>
  <div class="photos grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" max-w-500 mx-auto>
    <div v-for="photo, idx in photos" :key="idx">
      <img
        :src="photo.url"
        :alt="photo.text"
        :data-photo-index="idx"
        loading="lazy"
        w-full aspect-square object-cover
      >
    </div>
  </div>
</template>
