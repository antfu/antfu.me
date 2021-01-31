<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '/~/logics'

const lang = ref('en')
const router = useRouter()
const routes = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date)
  .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date))

const posts = computed(() =>
  routes.filter(i => !i.path.endsWith('.html') && i.meta.frontmatter.lang === lang.value),
)
</script>

<template>
  <div class="lang">
    <span
      class="opacity-50 mr-2 cursor-default text-normal"
      :class="{'opacity-100': lang === 'en'}"
      @click="lang='en'"
    >
      EN
    </span>
    <span
      class="opacity-50 mr-2 cursor-default text-normal"
      :class="{'opacity-100': lang === 'zh'}"
      @click="lang='zh'"
    >
      ZH
    </span>
  </div>

  <ul>
    <router-link
      v-for="route in posts"
      :key="route.path"
      class="item block font-normal mb-6 mt-2 no-underline"
      :to="route.path"
    >
      <li class="no-underline">
        <div class="title text-lg">
          {{ route.meta.frontmatter.title }}
        </div>
        <div class="time opacity-50 text-sm -mt-1">
          {{ formatDate(route.meta.frontmatter.date) }} <span v-if="route.meta.frontmatter.duration">· {{ route.meta.frontmatter.duration }}</span>
        </div>
      </li>
    </router-link>
  </ul>
</template>
