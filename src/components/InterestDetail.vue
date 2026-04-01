<script setup lang="ts">
import { useRoute } from 'vue-router/auto'
import { type InterestData, interestsData } from '~/data/interestsAuto'

const route = useRoute()
const slug = route.params.slug as string

const data = computed<InterestData>(() => interestsData[slug] || interestsData.travel)

const groupedByCity = computed(() => {
  const groups: Record<string, Record<string, string[]>> = {}
  data.value.images.forEach((img) => {
    if (!groups[img.city])
      groups[img.city] = {}
    if (!groups[img.city][img.spot])
      groups[img.city][img.spot] = []
    groups[img.city][img.spot].push(img.url)
  })
  return groups
})
</script>

<template>
  <div class="detail-container">
    <div class="detail-cover">
      <img :src="data.cover" :alt="data.title">
      <div class="cover-overlay">
        <h1 class="detail-title">
          {{ data.title }}
        </h1>
      </div>
    </div>

    <div class="detail-content">
      <p v-if="data.intro" class="detail-intro">
        {{ data.intro }}
      </p>

      <div v-if="data.content" class="detail-body" v-html="data.content.replace(/\n/g, '<br>')" />

      <div v-for="(spots, city) in groupedByCity" :key="city" class="city-section">
        <h2 class="city-title">
          {{ city }}
        </h2>
        <div v-for="(images, spot) in spots" :key="spot" class="spot-section">
          <h3 class="spot-title">
            {{ spot }}
          </h3>
          <div class="image-grid">
            <div v-for="(img, i) in images" :key="i" class="image-item">
              <img :src="img" :alt="`${city}-${spot}`">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.detail-cover {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.detail-cover img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin: 0;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.detail-content {
  padding: 0 1rem;
}

.detail-intro {
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.detail-body {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.city-section {
  margin-bottom: 2rem;
}

.city-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--c-border);
}

.spot-section {
  margin-bottom: 1.5rem;
}

.spot-title {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.7;
  margin: 0 0 0.75rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0;
}

.image-item {
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0 0.75rem 0 0;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  margin: 0;
}

.image-item:hover img {
  transform: scale(1.05);
}
</style>
