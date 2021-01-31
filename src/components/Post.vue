<script setup lang='ts'>
import { defineProps } from 'vue'
import { formatDate } from '/~/logics'
import { useRoute } from 'vue-router'

const route = useRoute()
const { frontmatter } = defineProps<{frontmatter: any}>()
</script>

<template>
  <div v-if="frontmatter.title" class="prose m-auto mb-8">
    <h1 class="mb-0">
      {{ frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-50 mt-0">
      {{ formatDate(frontmatter.date) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p v-if="frontmatter.subtitle" class="opacity-50 mt-1 italic">
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <slot />
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8">
    <router-link
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono no-underline opacity-50 hover:opacity-75"
    >
      cd ..
    </router-link>
  </div>
</template>
