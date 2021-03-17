<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { onMounted, watch } from 'vue'
import { isDark } from '../logics'

if (isClient) {
  onMounted(() => {
  // @ts-ignore
    window?.twttr.widgets.load()
  })
}
</script>

<template>
  <div class="">
    <blockquote class="twitter-tweet" :data-theme="isDark ? 'dark': 'light'">
      <slot />
    </blockquote>
  </div>
</template>
