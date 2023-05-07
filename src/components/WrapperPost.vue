<script setup lang='ts'>
import { formatDate } from '~/logics'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

const base = 'https://antfu.me'
const tweetUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading @antfu7\'s ${base}${route.path}\n\nI think...`)}`)
const elkUrl = computed(() => `https://elk.zone/intent/post?text=${encodeURIComponent(`Reading @antfu@m.webtoo.ls\'s ${base}${route.path}\n\nI think...`)}`)

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      document.querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  navigate()
  setTimeout(navigate, 500)
})
</script>

<template>
  <ClientOnly v-if="frontmatter.plum">
    <Plum />
  </ClientOnly>
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto mb-8">
    <h1 class="mb-0 slide-up">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p
      v-if="frontmatter.date"
      class="opacity-50 !-mt-2 slide-up"
    >
      {{ formatDate(frontmatter.date) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p
      v-if="frontmatter.subtitle"
      class="opacity-50 !-mt-6 italic slide-up"
    >
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <article ref="content">
    <slot />
  </article>
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8 slide-up animate-delay-500">
    <template v-if="frontmatter.duration">
      <span font-mono op50>> </span>
      <span op50>comment on </span>
      <a :href="elkUrl" target="_blank" op50>mastodon</a>
      <span op25> / </span>
      <a :href="tweetUrl" target="_blank" op50>twitter</a>
    </template>
    <br>
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
  </div>
</template>
