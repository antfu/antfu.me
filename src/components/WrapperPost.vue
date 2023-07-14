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
        ?.scrollIntoView({ behavior: 'auto' })
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
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto mb-8" :class="frontmatter.wrapperClass">
    <h1 class="mb-0 slide-enter">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p
      v-if="frontmatter.date"
      class="opacity-50 !-mt-2 slide-enter"
    >
      {{ formatDate(frontmatter.date, false) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p
      v-if="frontmatter.subtitle"
      class="opacity-50 !-mt-6 italic slide-enter"
    >
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter" bg-orange-4:10 text-orange-4 border="l-3 orange-4" px4 py2
    >
      This is a draft post, the content may be incomplete. Please check back later.
    </p>
  </div>
  <article ref="content" :class="frontmatter.tocAlwaysOn ? 'toc-always-on' : ''">
    <slot />
  </article>
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500">
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
