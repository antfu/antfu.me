<script setup lang="ts">
</script>

<template>
  <div slide-enter border="~ base rounded-lg rounded" shadow mt-10 flex="~ col gap-2" of-hidden>
    <div p4 mb--2>
      <div i-ri-calendar-event-line mr1 />
      Regular streaming on <a href="https://www.youtube.com/playlist?list=PL4ETc_mXFfxUGiY852jH3ctljnI2e9Rax" target="_blank">YouTube</a> every <span font-600>Tuesday</span> and <span font-600>Thursday</span> at <a href="https://www.google.com/search?q=1pm+utc">1pm UTC</a>,
      bulding <a href="https://github.com/nuxt/learn.nuxt.com" target="_blank">Nuxt Playground</a> from scratch.
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
