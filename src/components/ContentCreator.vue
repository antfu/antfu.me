<script setup lang="ts">
type ContentType = 'post' | 'daily' | 'product' | 'interest'

interface Field {
  key: string
  label: string
  type: 'text' | 'date' | 'textarea' | 'select'
  required: boolean
  options?: string[]
  default?: string
}

interface ContentConfig {
  type: ContentType
  label: string
  directory: string
  extension: string
  fields: Field[]
}

const contentConfigs: Record<ContentType, ContentConfig> = {
  post: {
    type: 'post',
    label: '博客文章',
    directory: 'pages/posts',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'lang', label: '语言', type: 'select', required: false, options: ['zh', 'en'], default: 'zh' },
      { key: 'duration', label: '阅读时长', type: 'text', required: false },
      { key: 'description', label: '描述', type: 'textarea', required: false },
    ],
  },
  daily: {
    type: 'daily',
    label: '碎记',
    directory: 'pages/content/daily',
    extension: '.md',
    fields: [
      { key: 'date', label: '日期', type: 'date', required: true },
    ],
  },
  product: {
    type: 'product',
    label: '产品',
    directory: 'pages/content/product',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'category', label: '分类', type: 'select', required: true, options: ['cli-tool', 'design-system', 'node-framework', 'vite-plugin', 'vue-components', 'other'] },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'link', label: '链接', type: 'text', required: false },
      { key: 'github', label: 'GitHub 链接', type: 'text', required: false },
    ],
  },
  interest: {
    type: 'interest',
    label: '兴趣',
    directory: 'pages/content/interest',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'category', label: '分类', type: 'text', required: false },
    ],
  },
}

// Form state
const selectedType = ref<ContentType>('post')
const formData = ref<Record<string, string>>({})
const content = ref('')
const generatedMd = ref('')
const showPreview = ref(false)
const copied = ref(false)

const currentConfig = computed(() => contentConfigs[selectedType.value])

// Reset form when type changes
watch(selectedType, () => {
  formData.value = {}
  content.value = ''
  generatedMd.value = ''
  showPreview.value = false

  // Set defaults
  currentConfig.value.fields.forEach((field) => {
    if (field.default) {
      formData.value[field.key] = field.default
    }
  })
})

// Generate markdown preview
function generateMarkdown() {
  const config = currentConfig.value
  const frontmatter: Record<string, any> = {}

  config.fields.forEach((field) => {
    if (field.key === 'draft') {
      frontmatter[field.key] = formData.value[field.key] === 'true'
    }
    else if (formData.value[field.key]) {
      frontmatter[field.key] = formData.value[field.key]
    }
  })

  let filename: string
  if (selectedType.value === 'daily') {
    filename = `${formData.value.date || new Date().toISOString().split('T')[0]}.md`
  }
  else {
    const title = formData.value.title || 'untitled'
    filename = `${slugify(title)}.md`
  }

  let md = '---\n'
  Object.entries(frontmatter).forEach(([key, value]) => {
    md += `${key}: ${value}\n`
  })
  md += '---\n\n'

  if (selectedType.value !== 'daily') {
    md += content.value
  }
  else {
    md += content.value
  }

  generatedMd.value = md
  return { filename, md }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .trim()
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(generatedMd.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch {
    // silent fail
  }
}

function downloadFile() {
  const { filename, md } = generateMarkdown()
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Initialize
onMounted(() => {
  selectedType.value = 'post'
})
</script>

<template>
  <div class="content-creator">
    <div class="creator-header">
      <h1 class="text-2xl font-bold">
        创建内容
      </h1>
      <p class="op60 mt-2">
        选择内容类型，填写表单，生成 Markdown 文件
      </p>
    </div>

    <!-- 类型选择 -->
    <div class="type-selector">
      <button
        v-for="(config, type) in contentConfigs"
        :key="type"
        class="type-btn"
        :class="{ active: selectedType === type }"
        @click="selectedType = type"
      >
        {{ config.label }}
      </button>
    </div>

    <!-- 表单 -->
    <div class="form-section">
      <div class="form-grid">
        <div
          v-for="field in currentConfig.fields"
          :key="field.key"
          class="form-field"
          :class="{ required: field.required }"
        >
          <label :for="field.key">{{ field.label }}</label>

          <select
            v-if="field.type === 'select'"
            :id="field.key"
            v-model="formData[field.key]"
          >
            <option value="">
              请选择
            </option>
            <option
              v-for="opt in field.options"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>

          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.key"
            v-model="formData[field.key]"
            rows="3"
          />

          <input
            v-else
            :id="field.key"
            v-model="formData[field.key]"
            :type="field.type"
          >
        </div>
      </div>

      <!-- 正文输入 -->
      <div v-if="selectedType !== 'daily'" class="content-field">
        <label for="content">正文内容 (Markdown)</label>
        <textarea
          id="content"
          v-model="content"
          rows="12"
          placeholder="输入正文内容，支持 Markdown 格式..."
        />
      </div>

      <div v-else class="content-field">
        <label for="content">碎记内容</label>
        <textarea
          id="content"
          v-model="content"
          rows="12"
          placeholder="输入碎记内容..."
        />
      </div>

      <!-- 预览 & 生成 -->
      <div class="actions">
        <button class="btn-secondary" @click="generateMarkdown">
          <div i-ri-eye-line />
          预览
        </button>
        <button class="btn-primary" @click="downloadFile">
          <div i-ri-download-line />
          下载
        </button>
        <button class="btn-secondary" @click="copyToClipboard">
          <div :class="copied ? 'i-ri-check-line' : 'i-ri-clipboard-line'" />
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </div>

    <!-- 预览面板 -->
    <div v-if="generatedMd" class="preview-section">
      <div class="preview-header">
        <h3>预览</h3>
        <span class="preview-path">{{ currentConfig.directory }}/xxx.md</span>
      </div>
      <pre class="preview-content"><code>{{ generatedMd }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.content-creator {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.creator-header {
  margin-bottom: 2rem;
}

.type-selector {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.type-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.type-btn:hover {
  border-color: var(--c-text);
}

.type-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.form-section {
  background: var(--c-bg-soft);
  border-radius: 1rem;
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
}

.form-field.required label::after {
  content: ' *';
  color: #ff6b6b;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: 0.5rem;
  background: var(--c-bg);
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #667eea;
}

.content-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.content-field label {
  font-size: 0.875rem;
  font-weight: 500;
}

.content-field textarea {
  padding: 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: 0.5rem;
  background: var(--c-bg);
  font-size: 0.875rem;
  resize: vertical;
  font-family: inherit;
}

.content-field textarea:focus {
  outline: none;
  border-color: #667eea;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
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

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  color: var(--c-text);
}

.btn-secondary:hover {
  border-color: var(--c-text);
}

.preview-section {
  margin-top: 1.5rem;
  background: var(--c-bg-soft);
  border-radius: 1rem;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--c-border);
}

.preview-header h3 {
  font-weight: 600;
}

.preview-path {
  font-size: 0.75rem;
  opacity: 0.6;
  font-family: monospace;
}

.preview-content {
  padding: 1.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
