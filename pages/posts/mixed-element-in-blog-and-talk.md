


---
title: Mixed Element in Blog and Talk
date: 2020-06-12T16:00:00Z
duration: 2min
lang: en
description: description
recording: true
type: talk+blog
---
[[toc]]
> Note: This is my personal notes/tips for migrating to Vue 3 and will be updated overtime. Please refer to [the official docs](https://v3.vuejs.org) for the complete changelog.

$\sqrt{3x-1}+(1+x)^2$

Sorted by the importance of my personal sense.

### 💫 use `markRaw` for vendor objects
<script setup lag="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>



As you might notice, I recently added a sliding enter effect to almost all the pages in my blog. And I quite like it. If you missed it, <a @click="router.go(0)">refresh the page</a> to see it in action.

<div flex justify-evenly gap-3 items-center>
  <a
    href="https://github.com/nuxt/framework"
    title="Nuxt3"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-nuxt3.svg" class="w-15!" />
  </a>
  <a
    href="https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme"
    title="Vite Node"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-vite-node.svg" class="w-15!" />
  </a>
  <a
    href="https://github.com/vitest-dev/vitest"
    title="Vitest"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-vitest.svg" class="w-15!" />
  </a>
  <a
    href="https://histoire.dev/"
    title="Histoire"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-histoire.svg" class="w-15!" />
  </a>
  <a
    href="https://github.com/vue-terminal/vue-termui"
    title="Vue Termui"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-termui.svg" class="w-15!" />
  </a>
  <div i-ri-question-line w-15 h-15 title="Yours?" op50 />
</div>

- [The Problem](#the-problem)


When using asynchronous `setup()`, **you have to use effects and lifecycle hooks before the first `await` statement.** ([details](https://github.com/vuejs/rfcs/discussions/234))


<div class="flex gap-3 text-lg py-2">
  <tabler:code />
  <tabler:bolt />
  <tabler:triangle-square-circle />
  <tabler:confetti />
</div>