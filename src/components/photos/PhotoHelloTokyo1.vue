<script setup lang="ts">
import type { Photo } from '../../../photos/data'
import raw from '../../../photos/data'

const photos: Photo[] = [
  'p-2018-01-30-14-18-35-000-1',
  'p-2018-01-31-08-17-06-000-1',
  'p-2018-02-03-14-21-24-000-1',
  'p-2018-01-27-08-05-30-000-1',
  'p-2018-02-02-08-26-27-000-1',
].map(name => raw.find(p => p.url.includes(name))!)
</script>

<template>
  <PhotoSlide :photos="photos" />
</template>
