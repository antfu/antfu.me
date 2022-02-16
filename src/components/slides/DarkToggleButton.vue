<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { isDark } from '~/logics'

const toggleDark = useToggle(isDark)
</script>

<template>
  <button
    class="bg-[#42b883] rounded border-b-2 border-green-900 text-white text-sm px-2 pt-1.5 pb-1 inline-block !outline-none hover:bg-opacity-85"
    @click="toggleDark"
  >
    <div class="flex">
      <carbon:moon v-if="isDark" />
      <carbon:sun v-else />
      <span class="mr-1 ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
    </div>
  </button>
</template>
