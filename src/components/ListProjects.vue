<script setup lang="ts">
import { defineProps } from 'vue'

const { projects } = defineProps({
  projects: Object,
})
</script>

<template lang="pug">
h1.hidden Projects of Anthony Fu

.-mt-10
  h2 My Projects
  p.opacity-75
    em List of projects that I am proud of

template(v-for="key in Object.keys(projects)" :key='key')
  p.opacity-25.text-sm.mt-10.font-bold {{key}}
  .project-grid.py-2.-mx-3.gap-2
    a.item.relative.flex(
      v-for="item, idx in projects[key]"
      :key='idx'
      :href='item.url'
      target='_blank'
      :class='!item.url ? "opacity-0 pointer-events-none h-0 -mt-8 -mb-4" : ""'
    )
      .pt-2.pr-4.opacity-75(v-if='item.icon')
        Icon.text-xl.opacity-50(:icon='item.icon || "carbon:unknown"')
      .flex-auto
        .text-normal {{item.name}}
        .desc.text-sm.opacity-75(v-html='item.desc')

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

  .item {
    padding: 0.8em 1em;
    background: transparent;
    transition: .2s all ease-out;
    text-decoration: none;
    font-size: 1.1rem;

    &:hover {
      background: #88888810;
    }

    .dark &:hover {
      background: #88888808;
    }

    .desc {
      color: #888888;
    }
  }
}
</style>
