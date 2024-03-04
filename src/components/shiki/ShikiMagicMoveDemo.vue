<script setup lang="ts">
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import { code1, code2 } from './ShikiMagicMoveDemoCode'
import 'shiki-magic-move/style.css'
import { useShikiStore } from '~/store/shiki'

const index = ref(1)
const code = computed(() => index.value === 1 ? code1 : code2)

let timer: ReturnType<typeof setInterval> | null = null

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const shiki = useShikiStore()

onMounted(() => {
  timer = setInterval(() => {
    index.value = index.value === 1 ? 2 : 1
  }, 3000)
})
</script>

<template>
  <div>
    <ShikiMagicMove
      v-if="shiki.highlighter"
      :highlighter="shiki.highlighter"
      :code="code"
      lang="vue"
      :theme="shiki.theme"
      :options="{
        duration: 800,
        animateContainer: false,
      }"
      class="font-mono h-95 important-p4 border border-base important-rounded-b-none important-bg-transparent"
    />
    <div
      v-else
      class="font-mono h-95 important-p4 border border-base important-rounded-b-none important-bg-transparent flex items-center justify-center"
    >
      Loading...
    </div>
    <div flex="~ gap-2" py2 mt--2>
      <button
        flex-1 border-x border-b border-base rounded-b px2 py1 transition duration-300
        :class="index === 1 ? 'bg-base' : 'bg-gray:5 op25 hover:op75'"
        @click="index = 1; clearTimer()"
      >
        Options API
      </button>
      <button
        flex-1 border-x border-b border-base rounded-b px2 py1 transition duration-300
        :class="index === 2 ? 'bg-base' : 'bg-gray:5 op25 hover:op75'"
        @click="index = 2; clearTimer()"
      >
        Composition API
      </button>
    </div>
  </div>
</template>
