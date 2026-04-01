<script setup lang="ts">
const scroll = useWindowScroll()

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <button
    title="回到顶部"
    fixed right-10 bottom-10 w-15 h-15 hover:op100 rounded-full
    hover-bg-hex-8883 transition duration-300 z-100 print:hidden
    :class="scroll.y.value > 300 ? 'op30' : 'op0! pointer-events-none'"
    @click="toTop()"
  >
    <div i-ri-arrow-up-line w-8 h-8 />
  </button>
</template>
