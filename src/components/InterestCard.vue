<script setup lang="ts">
import { useRouter } from 'vue-router/auto'
import { interestsData } from '~/data/interestsAuto'

const router = useRouter()

const interests = Object.entries(interestsData).map(([slug, data], index) => ({
  id: index + 1,
  slug,
  title: data.title,
  summary: data.intro,
  image: data.cover,
  date: data.images[0]?.date?.split('T')[0] || '2024-01-01',
}))

function goToDetail(slug: string) {
  router.push(`/interest/${slug}`)
}
</script>

<template>
  <div class="interest-container">
    <div class="waterfall">
      <div v-for="item in interests" :key="item.id" class="waterfall-item">
        <div class="interest-card" @click="goToDetail(item.slug)">
          <div class="card-image">
            <img :src="item.image" :alt="item.title" class="no-preview">
          </div>
          <div class="card-content">
            <h3 class="card-title">
              {{ item.title }}
            </h3>
            <p class="card-summary">
              {{ item.summary }}
            </p>
            <time class="card-date">{{ item.date }}</time>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interest-container {
  width: 100%;
}

.waterfall {
  column-count: 2;
  column-gap: 1rem;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.interest-card {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--c-border);
  background: var(--c-bg-soft);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

.interest-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dark .interest-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-image {
  width: 100%;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
  margin: 0;
}

.interest-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.card-summary {
  font-size: 0.875rem;
  color: var(--c-text);
  opacity: 0.7;
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.card-date {
  font-size: 0.75rem;
  opacity: 0.5;
}
</style>
