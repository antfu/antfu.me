<script setup lang="ts">
</script>

<template>
  <div slide-enter border="~ base rounded-lg rounded" shadow mt-10 flex="~ col gap-2" of-hidden>
    <div p4 mb--2>
      <div i-ri-calendar-event-line mr1 />
      Series of building <a href="https://github.com/nuxt/learn.nuxt.com" target="_blank">Nuxt Playground</a> from scratch.
    </div>
    <div aspect="16/9" relative>
      <iframe
        class="aspect-16/9 h-full"
        src="https://www.youtube.com/embed/Jh-jPx5ef8g"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
  </div>
</template>
