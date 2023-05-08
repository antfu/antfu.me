<script setup lang="ts">
import { isDark, toggleDark } from '~/logics'
</script>

<template>
  <button
    class="bg-[#42b883] rounded border-b-2 border-green-900 text-white text-sm px-2 pt-1.5 pb-1 inline-block !outline-none hover:bg-opacity-85"
    @click="toggleDark"
  >
    <div class="flex">
      <div i-ri-sun-line dark:i-ri-moon-line />
      <span class="mr-1 ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
    </div>
  </button>
</template>
