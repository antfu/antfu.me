---
title: Rewrite in Vite
date: 2021-01-25T16:00:00Z
lang: en
duration: 8min
---

The page you are looking at is now powered by [Vite](https://github.com/vitejs/vite). This is something I want to do for a long while since Vite came out, and it's finally done. As I have mentioned in my [first blog post](https://antfu.me/posts/new-house), this site was powered [Gridsome](https://gridsome.org/) using Vue 2. With this overhaul, I can now take the full advantage of Vue 3 and the [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) with the new [`<script setup>` SFC style](https://github.com/vuejs/rfcs/pull/227).

The reason for it taking me so long to do this is because I am busy (enjoy) doing yak shaving, for the tools I need to build this site.

### Fundamentals

It begins on me trying to improve the DX using icons in [this post](https://antfu.me/posts/journey-with-icons). At that time, Vue 3 just into RC and Vite didn't reach 1.0 yet. Hearing a lot of how good Vue 3 and Vite are, I decided to give them a try on building the icons site I need. Since Vite is so brand new thing, there isn't really many tools/plugins out there, the ecosystem is way far from what Webpack has. So I took that as a chance for me to dive in deep of how Vite works and do some contributions to it's ecosystem, I made a few tools while making [Icônes](https://github.com/antfu/icones):

- [vite-plugin-components](https://github.com/antfu/vite-plugin-components) - On-demand components auto importing for Vite.
- [vite-plugin-pwa](https://github.com/antfu/vite-plugin-pwa) - Zero-config PWA for Vite.
- [vite-plugin-purge-icons](https://github.com/antfu/purge-icons) - Bundles icons on demand, with a Vite plugin.

And found some awesome tools form the community:

- [Iconify](https://github.com/iconify/iconify) - Universal icon framework, by [@cyberalien](https://github.com/cyberalien).
- [vite-plugin-voie](https://github.com/brattonross/vite-plugin-voie) - File system based routing for Vite, by [@brattonross](https://github.com/brattonross).

With them, I got the fundamentals of a Vite project setup that has file based routing and component auto importing. Where I am quite satisfied with as I can now focus more on the content and logics rather that getting distracted by the routes setup and component registering.

I also learned [Tailwind CSS](https://tailwindcss.com/) as a replacement of the missing UI component libraries for Vue 3. It turns out that I really enjoy Tailwind's way of rapid prototyping. As I got more control over styling things, it make me think more about the design rather then just applying the default theme of the components library I use.

### Dark Mode

> useDark

### Markdown

Then I started working on the [Codecember](http://codecember.ink/) project with [@octref](https://blog.matsu.io/about), an initiative of learning and creating generative arts in December. With the sprite of dogfooding, we chosen Vite for building the site. In Codecember we need to do have a prompt everyday with some texts, code snippets and demos. This comes with the problem that Vite does not have a plugin for handling markdown files at that moment, so I made one myself.

- [vite-plugin-md](https://github.com/antfu/vite-plugin-md) - Markdown for Vite.
- [vite-ssg](https://github.com/antfu/vite-ssg) - Server-side generation for Vite.

### The Vite Template

### Serve-side Generatation (SSG)

Also as we are more like a site than an App, I would need to do some server-side generation to improve our SEO.

### Syntax Hightlighting

### The Missing Piece for SSG

### Thanks

