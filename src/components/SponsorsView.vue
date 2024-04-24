<script setup lang="ts">
import SponsorsTiers from '../../public/sponsors.svg?component'

const showCircle = ref(true)
</script>

<template>
  <div flex="~ gap-2 items-center justify-center" z-100 mt-5>
    <button op50 hover:op100 :class="showCircle ? 'op75' : 'op50'" @click="showCircle = true">
      Sponsor Circles
    </button>
    <span op25>|</span>
    <button op50 hover:op100 :class="showCircle ? 'op50' : 'op75'" @click="showCircle = false">
      Sponsor Tiers
    </button>
  </div>

  <SponsorsCircles v-if="showCircle" />
  <SponsorsTiers v-else h-auto max-w-250 w-full mx-auto />
</template>
