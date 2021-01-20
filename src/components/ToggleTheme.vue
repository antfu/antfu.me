<template lang="pug">
a.select-none(@click='toggleDark')
  ri-moon-line(v-show='isDark')
  ri-sun-line(v-show='!isDark')
</template>

<script setup lang='ts'>
import { isDark } from '/~/logics'

function toggleDark() {
  isDark.value = !isDark.value
}
</script>
