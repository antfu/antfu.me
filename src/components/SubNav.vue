<script setup lang="ts">
import { useRoute } from 'vue-router'
import { englishOnly } from '../logics'

const inactiveStyle = 'opacity-20 hover:opacity-50'

const route = useRoute()
</script>

<template>
  <div class="prose m-auto mb-8 select-none animate-none! op100!">
    <button flex="~ gap1" items-center mb2 op30 text-sm @click="englishOnly = !englishOnly">
      <div :i="englishOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />
      English Only
    </button>

    <div mb-0 flex="~ gap2 sm:gap3 wrap" text-xl sm:text-3xl>
      <RouterLink to="/posts" class="!border-none !font-400" :class="route.path === '/posts' ? '' : inactiveStyle">
        Blog
      </RouterLink>
      <RouterLink to="/talks" class="!border-none !font-400" :class="route.path === '/talks' ? '' : inactiveStyle">
        Talks
      </RouterLink>
      <RouterLink to="/podcasts" class="!border-none !font-400" :class="route.path === '/podcasts' ? '' : inactiveStyle">
        Podcasts
      </RouterLink>
      <RouterLink to="/streams" class="!border-none !font-400" :class="route.path === '/streams' ? '' : inactiveStyle">
        Streams
      </RouterLink>
    </div>
  </div>
</template>
