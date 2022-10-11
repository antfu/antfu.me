<script setup lang="ts">
defineProps<{
  repo: string
  name?: string
}>()
</script>

<template>
  <span class="flex-inline items-center">
    <carbon-logo-github class="inline-block opacity-70" />
    <a
      class="opacity-50 ml-1"
      :href="`https://github.com/${repo}`"
      target="_blank"
    >{{ name || (repo.startsWith('antfu/') ? repo.slice(6) : repo) }}</a>
  </span>
</template>
