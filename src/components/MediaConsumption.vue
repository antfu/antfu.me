<script setup lang="ts">
import type { MediaType } from '../../data/media'
import { media } from '../../data/media'

const route = useRoute()

const type = computed<MediaType>(() => route.query.type as MediaType || 'anime')
</script>

<template>
  <div font-mono>
    <div flex="~ gap-2">
      <RouterLink
        v-for="t of Object.keys(media)"
        :key="t"
        :to="{ query: { type: t } }"
        px-2
        class="border-none!"
        :class="type === t ? 'bg-black dark:bg-white text-white! dark:text-black!' : ''"
      >
        {{ t }}
      </RouterLink>
    </div>

    <template v-for="t of Object.keys(media)" :key="t">
      <table v-show="type === t" lang="ja" font-400>
        <tbody>
          <template v-for="m of media[type]" :key="m.name">
            <tr v-if="!m.state" v-bind="m.lang ? { lang: m.lang } : {}">
              <td>{{ m.name }}</td>
              <td text-right>
                {{ m.creator }}
              </td>
              <td v-if="m.note" lt-sm:hidden>
                {{ m.note }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>
