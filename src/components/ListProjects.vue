<script setup lang="ts">
import { defineProps } from 'vue'

const { projects } = defineProps({
  projects: Object,
})
</script>

<template lang="pug">
template(v-for="key in Object.keys(projects)" :key='key')
  h4.mt-10.font-bold {{key}}
  .project-grid.py-2.-mx-3.gap-2
    a.item.relative.flex(
      v-for="item, idx in projects[key]"
      :key='idx'
      :href='item.link'
      target='_blank'
      :class='!item.link ? "opacity-0 pointer-events-none h-0 -mt-8 -mb-4" : ""'
    )
      .pt-2.pr-5(v-if='item.icon')
        Icon.text-3xl.opacity-50(:icon='item.icon || "carbon:unknown"')
      .flex-auto
        .text-normal {{item.name}}
        .desc.text-sm.opacity-50.font-normal(v-html='item.desc')

.markdown.mt-10
  p.opacity-75
    em
      | Thanks for getting intersted in my works! If like them or find them useful, consider
      a(href='https://github.com/sponsors/antfu', target='_blank', rel='nofollow noopener noreferrer') &nbsp;sponsoring me&nbsp;
      | to support me keeping them sustainable. Cheers! :)
</template>

<style lang="postcss" scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  a.item {
    padding: 0.8em 1em;
    background: transparent;
    font-size: 1.1rem;

    &:hover {
      background: #88888808;
    }
  }
}
</style>
