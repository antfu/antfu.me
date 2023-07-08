<script setup lang="ts">
const route = useRoute()

const imageModel = ref<HTMLImageElement>()

useEventListener('click', (e) => {
  const path = e.composedPath()
  const first = path[0]
  if (!(first instanceof HTMLElement))
    return
  if (first.tagName !== 'IMG')
    return
  if (!path.some(el => el instanceof HTMLDivElement && el.classList.contains('prose')))
    return

  imageModel.value = first as HTMLImageElement
})
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer :key="route.path" />
  </main>
  <Transition name="fade">
    <div v-if="imageModel" fixed top-0 left-0 right-0 bottom-0 z-500 @click="imageModel = undefined">
      <div absolute top-0 left-0 right-0 bottom-0 bg-black:80 z--1 />
      <img :src="imageModel.src" :alt="imageModel.alt" w-full h-full object-contain>
    </div>
  </Transition>
</template>
