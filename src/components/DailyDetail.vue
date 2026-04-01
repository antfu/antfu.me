<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { dailyRecords } from '../data/dailiesAuto'

const props = defineProps<{
  date: string
}>()

const md = new MarkdownIt()

const record = computed(() => dailyRecords.find(r => r.date === props.date))

const formattedDate = computed(() => {
  if (!props.date)
    return ''
  const [year, month, day] = props.date.split('-')
  return `${year}年${month}月${day}日`
})

const renderedContent = computed(() => {
  if (!record.value?.content)
    return ''
  return md.render(record.value.content)
})
</script>

<template>
  <div class="daily-detail">
    <div v-if="record">
      <h1 class="detail-title">
        {{ formattedDate }}
      </h1>
      <div class="detail-content prose" v-html="renderedContent" />
    </div>
    <div v-else class="no-record">
      <p>暂无记录</p>
      <RouterLink to="/daily" class="add-link">
        前往日历添加记录
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.daily-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.detail-content {
  background: var(--c-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--c-border);
}

.no-record {
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
}

.add-link {
  display: inline-block;
  margin-top: 1rem;
  color: #667eea;
  text-decoration: none;
}
</style>
