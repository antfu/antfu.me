<script setup lang="ts">
defineProps<{
  id: string
  noScale?: boolean
}>()
</script>

<template>
  <div>
    <iframe
      class="aspect-16/9 w-full rounded-lg shadow"
      :class="noScale ? '' : 'lg:scale-120 lg:my-20'"
      :src="`https://www.youtube-nocookie.com/embed/${id}`"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </div>
</template>
