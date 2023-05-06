<script setup lang="ts">
useHead({
  meta: [
    { property: 'og:title', content: 'Anthony Fu' },
    { property: 'og:image', content: 'https://antfu.me/og.png' },
    { property: 'og:description', content: 'Anthony Fu\'s Portfolio' },
    { property: 'og:url', content: 'https://antfu.me' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@antfu7' },
    { name: 'twitter:creator', content: '@antfu7' },
    { name: 'twitter:title', content: 'Anthony Fu' },
    { name: 'twitter:description', content: 'Anthony Fu\'s Portfolio' },
    { name: 'twitter:image', content: 'https://antfu.me/og.png' },
  ],
})
</script>

<template>
  <NavBar />
  <main class="px-7 py-10">
    <RouterView />
    <Footer />
  </main>
</template>
