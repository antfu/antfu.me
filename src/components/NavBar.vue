<template lang='pug'>
header.header
  a.w-10.h-10.absolute.m-6.select-none.outline-none(href='/' exact focusable='false')
    img(src='/logo.png' alt='logo')
  nav.nav
    .spacer
    .right
      a(href='/projects') Projects
      a(href='/blog') Blog
      a(href='/')
        ri-user-line
      //- a(href='/notes')
        //- span.iconify.text-lg(data-icon='ri:chat-1-line')
      a(href='/bookmarks')
        ri-bookmark-line

      toggle-theme
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
