<script setup lang="ts">
import raw from '../../../photos/data'

const props = defineProps<{
  limit?: number
}>()

const photos = computed(() => {
  if (props.limit)
    return raw.slice(0, props.limit)
  return raw
})
</script>

<template>
  <PhotoGrid :photos="photos" />
</template>
