<script setup lang="ts">
/// <reference types="vite/client" />

interface PhotoMate {
  text?: string
}

const metaInfo = Object.entries(
  import.meta.glob<PhotoMate>('../../../photos/**/*.json', {
    eager: true,
    import: 'default',
  }),
).map(([name, data]) => {
  return {
    name: name.replace('../../../photos/', '').replace(/\.\w+$/, ''),
    data,
  }
})
const photos = Object.entries(
  import.meta.glob<string>('../../../photos/**/*.{jpg,png,JPG,PNG}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .map(([name, url]) => {
    return {
      ...metaInfo.find(info => info.name === name)?.data,
      name: name.replace('../../../photos/', '').replace(/\.\w+$/, ''),
      url,
    }
  })
  .sort((a, b) => b.name.localeCompare(a.name))
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
