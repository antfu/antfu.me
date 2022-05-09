<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>()
</script>

<template>
  <template v-for="key in Object.keys(projects)" :key="key">
    <h4 class="mt-10 font-bold">
      {{ key }}
    </h4>
    <div class="project-grid py-2 -mx-3 gap-2">
      <a
        v-for="item, idx in projects[key]"
        :key="idx"
        class="item relative flex items-center"
        :href="item.link"
        target="_blank"
        :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
        :title="item.name"
      >
        <div v-if="item.icon" class="pt-2 pr-5">
          <Slidev v-if="item.icon === 'slidev'" class="text-4xl opacity-50" />
          <VueUse v-else-if="item.icon === 'vueuse'" class="text-4xl opacity-50" />
          <VueReactivity v-else-if="item.icon === 'vue-reactivity'" class="text-4xl opacity-50" />
          <VueDemi v-else-if="item.icon === 'vue-demi'" class="text-4xl opacity-50" />
          <Unocss v-else-if="item.icon === 'unocss'" class="text-4xl opacity-50" />
          <Vitest v-else-if="item.icon === 'vitest'" class="text-4xl opacity-50" />
          <div v-else class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
        </div>
        <div class="flex-auto">
          <div cla ss="text-normal">{{ item.name }}</div>
          <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
        </div>
      </a>
    </div>
  </template>
  <div class="markdown pb5">
    <p op75>
      <em>
        Thanks for getting intersted in my works! If like them or find them useful, consider
        &nbsp;<a
          href="https://github.com/sponsors/antfu"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >sponsoring me</a>&nbsp;to support me keeping them sustainable. Cheers! :)
      </em>
    </p>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.project-grid a.item {
  padding: 0.8em 1em;
  background: transparent;
  font-size: 1.1rem;
}

.project-grid a.item:hover {
  background: #88888808;
}
</style>
