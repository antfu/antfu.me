<script setup lang="ts">
import { useRouter } from 'vue-router'
import { englishOnly, formatDate } from '~/logics'
import type { Post } from '~/types'

const props = defineProps<{
  type?: string
  posts?: Post[]
}>()

const router = useRouter()
const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date)
  .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date))
  .filter(i => !i.path.endsWith('.html') && i.meta.frontmatter.type === props.type)
  .map(i => ({
    path: i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    lang: i.meta.frontmatter.lang,
    duration: i.meta.frontmatter.duration,
    recording: i.meta.frontmatter.recording,
    upcoming: i.meta.frontmatter.upcoming,
  }))

const posts = computed(() => (props.posts || routes).filter(i => !englishOnly.value || i.lang !== 'zh'))

const getYear = (a: Date | string | number) => new Date(a).getFullYear()
const isSameYear = (a: Date | string | number, b: Date | string | number) => a && b && getYear(a) === getYear(b)
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>

    <template v-for="route, idx in posts" :key="route.path">
      <div v-if="!isSameYear(route.date, posts[idx - 1]?.date)" relative h20 pointer-events-none>
        <span text-8em op10 absolute left--3rem top--2rem font-bold>{{ getYear(route.date) }}</span>
      </div>
      <app-link
        class="item block font-normal mb-6 mt-2 no-underline"
        :to="route.path"
      >
        <li class="no-underline">
          <div class="title text-lg leading-1.2em">
            <span
              v-if="route.lang === 'zh'"
              align-middle
              class="text-xs border border-current rounded px-1 pb-0.2 md:ml--10.5 mr2"
            >中文</span>
            <span
              v-if="route.upcoming"
              align-middle
              class="text-xs border rounded px-1 pb-0.2 md:ml--19 mr2 bg-lime/10 border-lime text-lime"
            >upcoming</span>
            <span align-middle>{{ route.title }}</span>
            <span
              v-if="route.recording"
              align-middle mx1 text-red5
              i-ri-movie-line
              title="Has recording playback"
            />
          </div>

          <div class="time opacity-50 text-sm">
            {{ formatDate(route.date) }}
            <span v-if="route.duration" op80>· {{ route.duration }}</span>
            <span v-if="route.platform" op80>· {{ route.platform }}</span>
          </div>
        </li>
      </app-link>
    </template>
  </ul>
</template>
