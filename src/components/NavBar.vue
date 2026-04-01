<script setup lang="ts">
import Search from './Search.vue'

const searchOpen = ref(false)
</script>

<template>
  <header class="header fixed top-0 left-0 right-0 z-40">
    <div class="header-left">
      <RouterLink
        class="logo select-none outline-none"
        to="/"
        focusable="false"
      >
        <text class="rainbow">
          Rex Wang
        </text>
      </RouterLink>
    </div>
    <nav class="nav">
      <div class="spacer" />
      <div class="right" print:op0>
        <button title="搜索" class="search-btn mr-2" @click="searchOpen = true">
          <div i-ri-search-line />
        </button>
        <RouterLink to="/posts" title="博客">
          <span class="lt-md:hidden">博客</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <RouterLink to="/daily" title="碎记">
          <span class="lt-md:hidden">碎记</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <!-- <RouterLink to="/thinking" title="思考">
          <span class="lt-md:hidden">思考</span>
          <div i-ri-article-line md:hidden />
        </RouterLink> -->
        <!-- <RouterLink to="/design" title="设计">
          <span class="lt-md:hidden">设计</span>
          <div i-ri-article-line md:hidden />
        </RouterLink> -->
        <RouterLink to="/product" title="产品">
          <span class="lt-md:hidden">产品</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <RouterLink to="/interest" title="兴趣">
          <span class="lt-md:hidden">兴趣</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <a href="https://github.com/OnlyProbie" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
        <div class="theme-btn">
          <ToggleTheme />
        </div>
      </div>
    </nav>
  </header>
  <Search v-model="searchOpen" />
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  height: 4rem;
  background: linear-gradient(to right, var(--c-bg), transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--c-border);
}

.dark .header {
  background: linear-gradient(to right, var(--c-bg), transparent);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}

.nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition:
    opacity 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
  opacity: 0.6;
  outline: none;
  text-align: center;
  width: 3.5rem;
  height: 2rem;
  line-height: 2rem;
  display: inline-block;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav a.router-link-active {
  opacity: 1;
  color: var(--c-text);
  background: rgba(128, 128, 128, 0.2);
  border-radius: 0.5rem;
}

.nav a.router-link-active .lt-md\:hidden {
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.nav .right {
  display: grid;
  grid-gap: 0;
  grid-auto-flow: column;
  align-items: center;
}

.nav .right > *:not(.search-btn):not(a[href^='http']):not(.theme-btn) {
  margin: auto;
}

.search-btn {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.search-btn:hover {
  opacity: 1;
}
</style>
