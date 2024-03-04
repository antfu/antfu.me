<script setup lang="ts">
import { isDark } from '../logics'

defineProps<{
  conversation?: 'none'
}>()

onMounted(() => {
  // @ts-expect-error cdn
  window?.twttr.widgets.load()
})
</script>

<template>
  <div class="flex items-center justify-center">
    <blockquote
      class="twitter-tweet"
      :data-theme="isDark ? 'dark' : 'light'"
      :data-conversation="conversation ? conversation : undefined"
    >
      <slot />
    </blockquote>
  </div>
</template>
