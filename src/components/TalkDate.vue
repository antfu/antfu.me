<script setup lang="ts">
import { formatDate } from '~/logics'

const props = defineProps<{
  date: string
}>()

const daysLeft = computed(() => {
  const diff = +new Date(props.date) - +new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})
</script>

<template>
  <time :date="date" :title="date">
    {{ formatDate(props.date) }} <span v-if="daysLeft > 0" op50 text-xs>(in {{ daysLeft }} days)</span>
  </time>
</template>
