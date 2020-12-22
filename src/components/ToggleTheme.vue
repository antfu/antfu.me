<template lang="pug">
a.select-none(@click='toggleDark')
  span(v-show='isDark')
    span.iconify.text-lg(data-icon='ri:moon-line')
  span(v-show='!isDark')
    span.iconify.text-lg(data-icon='ri:sun-line')
</template>

<script setup lang='ts'>
import { isDark } from '/~/logics'

function toggleDark() {
  isDark.value = !isDark.value
}
</script>
