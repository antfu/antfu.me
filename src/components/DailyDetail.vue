<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { dailyRecords } from '../data/dailiesAuto'

const props = defineProps<{
  date: string
}>()

const md = new MarkdownIt()

const record = computed(() => dailyRecords.find(r => r.date === props.date))
const isEditing = ref(false)
const editContent = ref('')
const saveStatus = ref<'idle' | 'saving' | 'success' | 'error'>('idle')

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

function startEdit() {
  editContent.value = record.value?.content || ''
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editContent.value = ''
}

async function saveContent() {
  saveStatus.value = 'saving'

  try {
    const content = editContent.value
    const filename = `${props.date}.md`

    // Try using File System Access API
    if ('showSaveFilePicker' in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Markdown',
          accept: { 'text/markdown': ['.md'] },
        }],
      })

      const writable = await handle.createWritable()
      await writable.write(content)
      await writable.close()

      // Update local data
      const idx = dailyRecords.findIndex(r => r.date === props.date)
      if (idx !== -1) {
        dailyRecords[idx].content = editContent.value
      }

      saveStatus.value = 'success'
      isEditing.value = false
    }
    else {
      // Fallback: download file
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      saveStatus.value = 'success'
      isEditing.value = false
    }

    setTimeout(() => {
      saveStatus.value = 'idle'
    }, 2000)
  }
  catch {
    saveStatus.value = 'error'
    setTimeout(() => {
      saveStatus.value = 'idle'
    }, 3000)
  }
}
</script>

<template>
  <div class="daily-detail">
    <div v-if="record">
      <div class="detail-header">
        <h1 class="detail-title">
          {{ formattedDate }}
        </h1>
        <button v-if="!isEditing" class="edit-btn" @click="startEdit">
          <div i-ri-edit-line />
          编辑
        </button>
      </div>

      <!-- Edit mode -->
      <div v-if="isEditing" class="edit-section">
        <textarea
          v-model="editContent"
          class="edit-textarea"
          rows="15"
          placeholder="输入碎记内容，支持 Markdown 格式..."
        />
        <div class="edit-actions">
          <button class="btn-secondary" @click="cancelEdit">
            取消
          </button>
          <button class="btn-primary" :disabled="saveStatus === 'saving'" @click="saveContent">
            <div v-if="saveStatus === 'saving'" i-ri-loader-4-line class="animate-spin" />
            {{ saveStatus === 'saving' ? '保存中...' : saveStatus === 'success' ? '已保存' : saveStatus === 'error' ? '保存失败' : '保存' }}
          </button>
        </div>
      </div>

      <!-- Preview mode -->
      <div v-else class="detail-content prose" v-html="renderedContent" />
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

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  color: var(--c-text);
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.detail-content {
  background: var(--c-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--c-border);
}

.edit-section {
  background: var(--c-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--c-border);
}

.edit-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: var(--c-bg);
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  line-height: 1.6;
  box-sizing: border-box;
}

.edit-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  color: var(--c-text);
}

.btn-secondary:hover {
  border-color: var(--c-text);
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
