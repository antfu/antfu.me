<script setup lang="ts">
import { isDark } from '/~/logics'
</script>

<template>
  <header class="header">
    <router-link
      class="w-10 h-10 absolute m-6 select-none outline-none"
      to="/"
      focusable="false"
    >
      <img v-show="isDark" src="/logo-dark.svg" alt="logo">
      <img v-show="!isDark" src="/logo.svg" alt="logo">
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/projects">
          Projects
        </router-link>
        <router-link to="/posts">
          Blog
        </router-link>
        <!--  a(href='/notes')//  span.iconify.text-lg(data-icon='ri:chat-1-line') -->
        <router-link to="/bookmarks" title="Bookmarks">
          <ri-bookmark-line />
        </router-link>
        <a href="https://twitter.com/antfu7" target="_blank" title="Twitter" class="hidden md:block">
          <feather-twitter />
        </a>
        <a href="https://github.com/antfu" target="_blank" title="GitHub" class="hidden md:block">
          <uil-github-alt />
        </a>
        <a href="/feed.xml" target="_blank" title="RSS" class="hidden md:block">
          <la-rss-square style="font-size:1.25rem; margin: 0 -0.125rem;" />
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
  width: 100vw;
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
