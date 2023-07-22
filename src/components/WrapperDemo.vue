<script setup lang="ts">
import { formatDate } from '~/logics'

const { frontmatter, video, date } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
  video: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <a
      border="~ base rounded-lg" block of-hidden
      class="group"
      hover="scale-101 shadow-xl z-10" transition-all duration-500 bg-base relative
      :href="frontmatter.link"
      target="_blank"
    >
      <video
        v-if="video"
        :src="video"
        w-full autoplay loop muted playsinline border="b base"
      />

      <div class="prose prose-sm p4 m0 pb3">
        <slot />
        <div op50 text-sm pt2>{{ formatDate(date, false) }}</div>
      </div>
    </a>
  </div>
</template>
