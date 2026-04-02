<script setup lang="ts">
import { useRouter } from 'vue-router/auto'
import { productsData } from '~/data/productsAuto'

const router = useRouter()

const products = Object.values(productsData)

const currentIndex = ref(0)
const isAnimating = ref(false)

const totalCards = products.length

function getTransform(index: number, current: number): string {
  const offset = index - current
  const normalizedOffset = ((offset % totalCards) + totalCards) % totalCards

  if (normalizedOffset === 0)
    return 'translateX(0) translateZ(0) scale(1) rotateY(0deg)'
  if (normalizedOffset === 1 || normalizedOffset === -totalCards + 1)
    return 'translateX(80%) translateZ(-50px) scale(0.85) rotateY(-25deg)'
  if (normalizedOffset === totalCards - 1 || normalizedOffset === -1)
    return 'translateX(-80%) translateZ(-50px) scale(0.85) rotateY(25deg)'
  if (normalizedOffset === 2 || normalizedOffset === -totalCards + 2)
    return 'translateX(140%) translateZ(-100px) scale(0.7) rotateY(-35deg)'
  if (normalizedOffset === totalCards - 2 || normalizedOffset === -2)
    return 'translateX(-140%) translateZ(-100px) scale(0.7) rotateY(35deg)'

  return 'translateX(0) translateZ(-150px) scale(0.6) rotateY(0deg)'
}

function getOpacity(index: number, current: number): number {
  const offset = Math.abs(((index - current + totalCards) % totalCards))
  if (offset === 0)
    return 1
  if (offset === 1 || offset === totalCards - 1)
    return 0.7
  if (offset === 2 || offset === totalCards - 2)
    return 0.4
  return 0
}

function getZIndex(index: number, current: number): number {
  const offset = ((index - current + totalCards) % totalCards)
  if (offset === 0)
    return 10
  if (offset === 1 || offset === totalCards - 1)
    return 8
  if (offset === 2 || offset === totalCards - 2)
    return 6
  return 4
}

function next() {
  if (isAnimating.value)
    return
  isAnimating.value = true
  currentIndex.value = (currentIndex.value + 1) % totalCards
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

function prev() {
  if (isAnimating.value)
    return
  isAnimating.value = true
  currentIndex.value = (currentIndex.value - 1 + totalCards) % totalCards
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

function goToDetail(slug: string) {
  router.push(`/product/${slug}`)
}
</script>

<template>
  <div class="product-carousel">
    <div class="carousel-container">
      <div class="cards-wrapper">
        <div
          v-for="(product, index) in products"
          :key="product.slug"
          class="card"
          :class="{ active: index === currentIndex }"
          :style="{
            transform: getTransform(index, currentIndex),
            opacity: getOpacity(index, currentIndex),
            zIndex: getZIndex(index, currentIndex),
          }"
          @click="goToDetail(product.slug)"
        >
          <div class="card-inner">
            <div class="card-image">
              <img :src="product.image" :alt="product.title" class="no-preview">
            </div>
            <div class="card-content">
              <h3 class="card-title">
                {{ product.title }}
              </h3>
              <p class="card-desc">
                {{ product.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="nav-btn prev" @click="prev">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
    <button class="nav-btn next" @click="next">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div class="dots">
      <span
        v-for="(_, index) in products"
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      />
    </div>
  </div>
</template>

<style scoped>
.product-carousel {
  position: relative;
  width: 100%;
  height: calc(100vh - 30rem);
  display: flex;
  flex-direction: column;
  perspective: 1200px;
}

.carousel-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards-wrapper {
  position: relative;
  width: 350px;
  height: 100%;
  max-height: 450px;
  transform-style: preserve-3d;
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-inner {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid var(--c-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.dark .card-inner {
  background: #444444;
  border-color: #404040;
}

.card.active .card-inner {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.card-image {
  height: 55%;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  margin: 0;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--c-text);
}

.card-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--c-text);
  opacity: 0.7;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: var(--c-bg-soft);
  color: var(--c-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 20;
  margin-top: -25px;
}

.nav-btn:hover {
  background: var(--c-bg);
  border-color: var(--c-text);
}

.nav-btn.prev {
  left: 2rem;
}

.nav-btn.next {
  right: 2rem;
}

.dots {
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 20;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.dark .dot {
  background: #666;
}

.dark .dot.active {
  background: #fff;
}

.dot.active {
  background: #333;
  width: 24px;
  border-radius: 4px;
}
</style>
