<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="px-2 -mx-2 mt-4 py-2 flex block items-center gap2">
    <img src="https://vueuse.org/favicon.svg" class="h-1.5rem !w-1.5rem !my-0 flex-none">
    <span class="opacity-75">Avaliable in VueUse: </span><a class="ml-2 font-mono opacity-75 hover:opacity-100" :href="`https://vueuse.org/${name}`">{{ name }}</a>
  </div>
</template>
