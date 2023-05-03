<script setup lang="ts">
import { useRouter } from 'vue-router'
import { englishOnly, formatDate } from '~/logics'
import type { Post } from '~/types'

const props = defineProps<{
  type?: string
  posts?: Post[]
  extra?: Post[]
}>()

const router = useRouter()
const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date)
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

const posts = computed(() =>
  [...(props.posts || routes), ...props.extra || []]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .filter(i => !englishOnly.value || i.lang !== 'zh'),
)

const getYear = (a: Date | string | number) => new Date(a).getFullYear()
const isFuture = (a?: Date | string | number) => a && new Date(a) > new Date()
const isSameYear = (a?: Date | string | number, b?: Date | string | number) => a && b && getYear(a) === getYear(b)
const isSameGroup = (a: Post, b?: Post) => {
  return (isFuture(a.date) === isFuture(b?.date)) && isSameYear(a.date, b?.date)
}

const getGroupName = (p: Post) => {
  if (isFuture(p.date))
    return 'Upcoming'
  return getYear(p.date)
}
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>

    <template v-for="route, idx in posts" :key="route.path">
      <div v-if="!isSameGroup(route, posts[idx - 1])" relative h20 pointer-events-none>
        <span text-8em op8 absolute left--3rem top--2rem font-bold>{{ getGroupName(route) }}</span>
      </div>
      <app-link
        class="item block font-normal mb-6 mt-2 no-underline"
        :to="route.path"
      >
        <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
          <div class="title text-lg leading-1.2em">
            <span
              v-if="route.lang === 'zh'"
              align-middle
              class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 md:ml--10.5 mr2"
            >中文</span>
            <span align-middle>{{ route.title }}</span>
            <span
              v-if="route.recording"
              align-middle mx1 text-red5 saturate-50
              i-ri-movie-line
              title="Has recording playback"
            />
          </div>

          <div class="time opacity-50 text-sm">
            {{ formatDate(route.date, true) }}
            <span v-if="route.duration" op80>· {{ route.duration }}</span>
            <span v-if="route.platform" op80>· {{ route.platform }}</span>
          </div>
        </li>
      </app-link>
    </template>
  </ul>
</template>
