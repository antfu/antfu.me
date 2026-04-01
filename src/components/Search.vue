<script setup lang="ts">
import { useRouter } from 'vue-router/auto'
import { formatDate } from '~/logics'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const router = useRouter()
const searchQuery = ref('')
const isOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const allPosts = computed(() => {
  return router.getRoutes()
    .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date && !i.meta.frontmatter.draft)
    .filter(i => !i.path.endsWith('.html'))
    .map(i => ({
      path: i.meta.frontmatter.redirect || i.path,
      title: i.meta.frontmatter.title,
      date: i.meta.frontmatter.date,
      lang: i.meta.frontmatter.lang,
      duration: i.meta.frontmatter.duration,
      desc: i.meta.frontmatter.description,
    }))
})

const searchResults = computed(() => {
  if (!searchQuery.value.trim())
    return []
  const query = searchQuery.value.toLowerCase()
  return allPosts.value
    .filter(post =>
      post.title.toLowerCase().includes(query)
      || post.desc?.toLowerCase().includes(query),
    )
    .slice(0, 10)
})

function close() {
  isOpen.value = false
  searchQuery.value = ''
}

function navigate(path: string) {
  router.push(path)
  close()
}

// Close on escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value)
      close()
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="search-overlay" @click="close" />
    <Transition name="search">
      <div v-if="isOpen" class="search-modal">
        <div class="search-header">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索文章..."
            autofocus
          >
          <button class="search-close" @click="close">
            <div i-ri-close-line />
          </button>
        </div>

        <div class="search-results">
          <template v-if="searchQuery.trim() && searchResults.length === 0">
            <div class="search-empty">
              未找到相关文章
            </div>
          </template>
          <template v-else-if="searchResults.length > 0">
            <div
              v-for="post in searchResults"
              :key="post.path"
              class="search-item"
              @click="navigate(post.path)"
            >
              <div class="search-item-title">
                {{ post.title }}
              </div>
              <div class="search-item-meta">
                <span>{{ formatDate(post.date, true) }}</span>
                <span v-if="post.duration">{{ post.duration }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="search-hint">
              输入关键词搜索文章
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

.dark .search-overlay {
  background: rgba(255, 255, 255, 0.15);
}

.search-modal {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 560px;
  background: var(--c-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--c-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--c-border);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.125rem;
  color: var(--c-text);
}

.search-input::placeholder {
  color: var(--c-text);
  opacity: 0.5;
}

.search-close {
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.search-close:hover {
  opacity: 1;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-empty,
.search-hint {
  padding: 2rem;
  text-align: center;
  opacity: 0.5;
}

.search-item {
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.search-item:hover {
  background: var(--c-bg-soft);
}

.search-item-title {
  font-weight: 500;
}

.search-item-meta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.5;
}

.search-enter-active,
.search-leave-active {
  transition: all 0.2s ease;
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>
