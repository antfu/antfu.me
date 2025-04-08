<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2025-04-06-07-19-55-000-1',
  'p-2025-03-28-06-35-16-000-1',
  'p-2025-03-28-06-25-26-000-2',
  'p-2025-04-06-07-31-28-000-1',
  'p-2025-03-30-04-25-47-000-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
