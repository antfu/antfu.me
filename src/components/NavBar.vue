<script setup lang="ts">
import { isDark } from '~/logics'
</script>

<template>
  <header class="header z-40">
    <router-link
      class="w-10 h-10 absolute lg:fixed m-6 select-none outline-none"
      to="/"
      focusable="false"
    >
      <img v-show="isDark" src="/logo-dark.svg?url" alt="logo">
      <img v-show="!isDark" src="/logo.svg?url" alt="logo">
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/posts" title="Blog">
          <span class="lt-md:hidden">Blog</span>
          <div i-ri-article-line md:hidden />
        </router-link>
        <router-link to="/projects" title="Projects">
          <span class="lt-md:hidden">Projects</span>
          <div i-ri-lightbulb-line class="md:hidden" />
        </router-link>
        <router-link to="/talks" class="lt-md:hidden" title="Talks">
          Talks
        </router-link>
        <router-link to="/podcasts" class="lt-md:hidden" title="Podcasts">
          Podcasts
        </router-link>
        <router-link to="/streams" class="lt-md:hidden" title="Streams">
          Streams
        </router-link>
        <router-link to="/demos" title="Demos">
          <span class="lt-md:hidden">Demos</span>
          <div i-ri-screenshot-line class="md:hidden" />
        </router-link>
        <!-- <router-link to="/bookmarks" title="Bookmarks">
          <div i-ri-bookmark-line />
        </router-link> -->
        <!-- <router-link to="/notes" title="Notes">
          <div i-ri-sticky-note-line />
        </router-link> -->
        <router-link to="/sponsors-list" title="Sponsors">
          <div i-ri-heart-line />
        </router-link>
        <a href="https://twitter.com/antfu7" target="_blank" title="Twitter" class="lt-md:hidden">
          <feather-twitter />
        </a>
        <a href="https://github.com/antfu" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
        <a href="/feed.xml" target="_blank" title="RSS" class="lt-md:hidden">
          <div i-la-rss-square style="font-size:1.25rem; margin: 0 -0.125rem;" />
        </a>
        <toggle-theme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
