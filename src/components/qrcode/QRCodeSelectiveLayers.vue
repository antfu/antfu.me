<script setup lang="ts">
const layer = ref(0)
</script>

<template>
  <div>
    <div flex="~ gap-2">
      <button
        border="~ base rounded" px3 py1 text-sm
        :class="layer === 0 ? 'border-b-transparent rounded-b-0' : 'op50'"
        hover:bg-gray:5 hover:op75
        @click="layer = 0"
      >
        <span>Layer 1</span>
      </button>
      <button
        border="~ base rounded" px3 py1 text-sm
        :class="layer === 1 ? 'border-b-transparent rounded-b-0' : 'op50'"
        hover:bg-gray:5 hover:op75
        @click="layer = 1"
      >
        <span>Layer 2</span>
      </button>
    </div>
    <img v-show="layer === 0" important-mt-0 rounded-b-lg src="/images/ai-qrcode-101-selective-layer-1.png">
    <img v-show="layer === 1" important-mt-0 rounded-b-lg src="/images/ai-qrcode-101-selective-layer-2.png">
  </div>
</template>
