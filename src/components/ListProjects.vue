<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>()

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, '-')
}
</script>

<template>
  <div class="max-w-300 mx-auto">
    <p text-center mt--6 mb5 op50 text-lg italic>
      Projects that I created or maintaining.
    </p>
    <div
      v-for="key, cidx in Object.keys(projects)" :key="key" slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <div
        :id="slug(key)"
        select-none relative h20 pointer-events-none slide-enter
        :style="{
          '--enter-stage': cidx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span text-5em color-transparent absolute left--1rem top-0rem font-bold leading-1em text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20>{{ key }}</span>
      </div>
      <div
        class="project-grid py-2 max-w-500 w-max mx-auto"
        grid="~ cols-1 md:cols-2 gap-4 lg:cols-3"
      >
        <a
          v-for="item, idx in projects[key]"
          :key="idx"
          class="item relative flex items-center"
          :href="item.link"
          target="_blank"
          :title="item.name"
        >
          <div v-if="item.icon" class="pt-2 pr-5">
            <Slidev v-if="item.icon === 'slidev'" class="text-4xl opacity-50" />
            <VueUse v-else-if="item.icon === 'vueuse'" class="text-4xl opacity-50" />
            <VueReactivity v-else-if="item.icon === 'vue-reactivity'" class="text-4xl opacity-50" />
            <VueDemi v-else-if="item.icon === 'vue-demi'" class="text-4xl opacity-50" />
            <Unocss v-else-if="item.icon === 'unocss'" class="text-4xl opacity-50" />
            <Vitest v-else-if="item.icon === 'vitest'" class="text-4xl opacity-50" />
            <Elk v-else-if="item.icon === 'elk'" class="text-4xl opacity-50" />
            <AnthonyFu v-else-if="item.icon === 'af'" class="text-4xl opacity-50" />
            <div v-else class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
          </div>
          <div class="flex-auto">
            <div class="text-normal">{{ item.name }}</div>
            <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
          </div>
        </a>
      </div>
    </div>
    <div class="prose pb5 mx-auto mt10 text-center">
      <div block mt-5>
        <a href="https://antfu.me/stars-rank" target="_blank" op50>All projects sort by Stars</a>
      </div>
      <hr>
      <SponsorButtons />
    </div>
  </div>
  <div>
    <div class="table-of-contents">
      <div class="table-of-contents-anchor">
        <div class="i-ri-menu-2-fill" />
      </div>
      <ul>
        <li v-for="key of Object.keys(projects)" :key="key">
          <a :href="`#${slug(key)}`">{{ key }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.project-grid a.item {
  background: transparent;
  font-size: 1.1rem;
  width: 350px;
  max-width: 100%;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 6px;
}

.project-grid a.item:hover {
  background: #88888811;
}
</style>
