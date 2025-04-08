<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2025-04-04-06-04-06-000-1',
  'p-2025-04-04-06-03-40-000-1',
  'p-2025-03-20-02-07-15-000-1',
  'p-2025-04-06-07-38-22-000-1',
  'p-2025-03-28-07-43-10-000-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
