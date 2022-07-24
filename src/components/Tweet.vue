<script setup lang="ts">
import { isDark } from '../logics'

onMounted(() => {
  // @ts-expect-error cdn
  window?.twttr.widgets.load()
})
</script>

<template>
  <div class="">
    <blockquote class="twitter-tweet" :data-theme="isDark ? 'dark' : 'light'">
      <slot />
    </blockquote>
  </div>
</template>
