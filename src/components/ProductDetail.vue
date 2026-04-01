<script setup lang="ts">
import { useRoute } from 'vue-router/auto'
import { type ProductData, productsData } from '~/data/productsAuto'

const route = useRoute()
const slug = route.params.slug as string

const product = computed<ProductData | undefined>(() => productsData[slug])
</script>

<template>
  <div class="product-detail">
    <div class="detail-cover">
      <img :src="product.image" :alt="product.title">
      <div class="cover-overlay">
        <h1 class="detail-title">
          {{ product.title }}
        </h1>
      </div>
    </div>

    <div class="detail-content">
      <p class="detail-intro">
        {{ product.content }}
      </p>

      <div class="detail-section">
        <h2 class="section-title">
          核心特性
        </h2>
        <ul class="features-list">
          <li v-for="(feature, index) in product.features" :key="index">
            <span class="feature-icon">✓</span>
            {{ feature }}
          </li>
        </ul>
      </div>

      <div class="detail-section">
        <h2 class="section-title">
          技术栈
        </h2>
        <div class="tech-stack">
          <span v-for="tech in product.techStack" :key="tech" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </div>

      <div class="detail-meta">
        <time>更新时间：{{ product.date }}</time>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail {
  max-width: 900px;
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
  height: 400px;
  object-fit: cover;
  margin: 0;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  padding: 2rem;
}

.detail-title {
  font-size: 2.5rem;
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
  color: var(--c-text);
  opacity: 0.85;
  margin-bottom: 2.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--c-border);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.feature-icon {
  color: #22c55e;
  font-weight: bold;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-tag {
  padding: 0.5rem 1rem;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 2rem;
  font-size: 0.875rem;
}

.detail-meta {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--c-border);
  font-size: 0.875rem;
  opacity: 0.6;
}
</style>
