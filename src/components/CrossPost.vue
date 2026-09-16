<script setup lang="ts">
const props = defineProps<{
  link: string
  website: string
}>()
</script>

<template>
  <div class="px4 py2 border text-cyan-6 border-cyan-6:75 bg-cyan-5:10 rounded border-dashed">
    <div i-carbon-arrows-horizontal mr2 />
    <span>Cross-posted with </span><a :href="props.link" target="_blank" rel="noopener noreferrer" class="text-cyan-5! border-b-transparent! hover:border-b-cyan-6! font-medium!">{{ props.website }}</a>.
  </div>
</template>
