<script setup lang="ts">
import { talks } from '../../data/talks'
import { englishOnly, formatDate } from '../logics'

function getSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-')
}
</script>

<template>
  <template v-for="talk, idx of talks" :key="idx">
    <div v-if="!englishOnly || talk.lang !== 'zh'">
      <div v-if="idx !== 0" pt4>
        <hr>
      </div>
      <h2 :id="getSlug(talk.title)" tabindex="-1" important-mb-0>
        <span v-if="talk.series" text-xl font-400 op50>
          {{ talk.series }}
          <br>
        </span>
        {{ talk.title }}
        <span
          v-if="talk.lang === 'zh'"
          align-top flex-none
          class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 my-auto"
        >中文</span>
        <a class="header-anchor" :href="`#${getSlug(talk.title)}`" aria-hidden="true">#</a>
      </h2>
      <div v-if="talk.description" op75 pt2>
        {{ talk.description }}
      </div>
      <div grid="~ cols-1 md:cols-[1fr_max-content] gap-4" pt6>
        <template v-for="p, idx2 in talk.presentations" :key="idx2">
          <template v-if="!englishOnly || p.lang !== 'zh'">
            <div>
              <a :href="p.conferenceUrl" target="_blank" rel="noopener noreferrer">
                {{ p.conference }}
              </a>
              <span
                v-if="p.lang === 'zh'"
                align-top flex-none ml2
                class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 my-auto"
              >中文</span>
              <div text-sm op50>
                {{ formatDate(p.date, false) }} · {{ p.location }}
              </div>
            </div>
            <div flex="~ gap-3 justify-end items-start">
              <a v-if="p.recording" :href="p.recording" target="_blank" rel="noopener noreferrer" op50 hover:op100 important-transition-opacity duration-500 important-border-0>
                <div i-ri-play-large-line />
                Watch
              </a>
              <a v-if="p.transcript" :href="p.transcript" target="_blank" rel="noopener noreferrer" op50 hover:op100 important-transition-opacity duration-500 important-border-0>
                <div i-ri-file-list-3-line />
                Transcript
              </a>
              <a v-if="p.spa" :href="p.spa" target="_blank" rel="noopener noreferrer" op50 hover:op100 important-transition-opacity duration-500 important-border-0>
                <div i-ri-presentation-fill />
                Slides
              </a>
              <a v-if="p.pdf" :href="p.pdf" target="_blank" rel="noopener noreferrer" op50 hover:op100 important-transition-opacity duration-500 important-border-0>
                <div i-ri-download-2-line />
                PDF
              </a>
            </div>
          </template>
        </template>
      </div>
    </div>
  </template>
</template>
