<script setup lang="ts">
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import { useShikiStore } from '~/store/shiki'
import { code1, code2 } from './ShikiMagicMoveDemoCode'

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
    <div flex="~" py2 mb--2 mt--2>
      <div
        flex-1 border-b mb--1px
        :class="index !== 1 ? 'border-base' : 'border-transparent'"
      >
        <button
          w-full border-x border-t border-base rounded-t px2 py1 transition duration-300
          :class="index === 1 ? 'bg-base' : 'bg-gray:5 op25 hover:op75'"
          @click="index = 1; clearTimer()"
        >
          Options API
        </button>
      </div>
      <div
        flex-1 border-b mb--1px
        :class="index !== 2 ? 'border-base' : 'border-transparent'"
      >
        <button
          w-full border-x border-t border-base rounded-t px2 py1 transition duration-300
          :class="index === 2 ? 'bg-base' : 'bg-gray:5 op25 hover:op75'"
          @click="index = 2; clearTimer()"
        >
          Composition API
        </button>
      </div>
    </div>
    <ShikiMagicMove
      v-if="shiki.highlighter"
      :highlighter="shiki.highlighter"
      :code="code"
      lang="vue"
      :theme="shiki.theme"
      :options="{
        duration: 800,
        animateContainer: false,
        stagger: 3,
      }"
      class="font-mono h-112 important-p4 border-x border-b border-base important-rounded-t-none important-bg-transparent"
      style="scrollbar-gutter: stable"
    />
    <div
      v-else
      class="font-mono h-95 important-p4 border border-base important-rounded-b-none important-bg-transparent flex items-center justify-center"
    >
      Loading...
    </div>
  </div>
</template>
