<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer :key="route.path" />
  </main>
</template>
