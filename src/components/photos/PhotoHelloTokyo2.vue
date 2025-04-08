<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2025-03-18-23-32-18-000-1',
  'p-2025-03-18-23-38-45-000-1',
  'p-2025-03-18-23-39-20-000-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
