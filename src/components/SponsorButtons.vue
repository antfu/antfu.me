<template>
  <p>
    If you enjoy my work and find them useful,
    consider sponsor me and the ecosystem to help Open Source sustainable. Thank you!
  </p>

  <p flex="~ gap-2 wrap items-center">
    <SponsorButtonCollective />
    <span op50 text-sm>
      <a href="/posts/sponsorship-forwarding" target="_blank">How does this work?</a>
    </span>
  </p>
  <p flex="~ gap-2 wrap">
    <a
      href="https://github.com/sponsors/antfu"
      target="_blank"
      class="group btn-rose inline-block"
    >
      <div
        i-ph-heart-duotone
        group-hover="i-ph-heart-fill text-rose"
        transition-all duration-200 ease-out
      />
      Sponsor to support Anthony
    </a>
    <a
      href="https://afdian.com/a/antfu"
      target="_blank"
      class="group btn-yellow inline-block"
    >
      <div
        i-ph-lightning-duotone
        group-hover="i-ph-lightning-fill text-yellow"
        transition-all duration-200 ease-out
      />
      在爱发电上支持我
    </a>
  </p>
</template>
