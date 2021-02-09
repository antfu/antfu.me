---
title: Rewrite in Vite
date: 2021-01-31T16:00:00Z
lang: en
duration: 10min
description: My site is now powered by Vite!
---

The page you are looking at is now powered by [Vite](https://github.com/vitejs/vite). This is something I want to do for a long while since Vite came out, and it's finally done. As I have mentioned in my [first blog post](/posts/new-house), it was powered [Gridsome](https://gridsome.org/) using Vue 2. With this overhaul, I can now take full advantage of Vue 3 and the [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) with the new [`<script setup>` SFC style](https://github.com/vuejs/rfcs/pull/227).

The reason for it taking me so long to do this is because I am busy (enjoy) doing [yak shaving](https://americanexpress.io/yak-shaving), for the tools I need to build this site.

### Fundamentals

It begins with me trying to improve the DX using icons in [this post](/posts/journey-with-icons). At that time, Vue 3 just into RC, and Vite didn't reach 1.0 yet. Hearing a lot of how good Vue 3 and Vite are, I decided to give them a try on building the icon site I want to build for a long time. Since Vite is such a brand new thing, there aren't many tools/plugins out there, the ecosystem was way far from what Webpack has. I took that as a chance for me to dive deep into how Vite works while doing some contributions the ecosystem. Here is a few tools I made while building the app [Icônes](https://github.com/antfu/icones):

- [vite-plugin-components](https://github.com/antfu/vite-plugin-components) - On-demand components auto importing for Vite.
- [vite-plugin-pwa](https://github.com/antfu/vite-plugin-pwa) - Zero-config PWA for Vite.
- [vite-plugin-purge-icons](https://github.com/antfu/purge-icons) - Bundles icons on demand, with a Vite plugin.

Also found some awesome tools form the community:

- [Iconify](https://github.com/iconify/iconify) - Universal icon framework, by [@cyberalien](https://github.com/cyberalien).
- [vite-plugin-voie](https://github.com/brattonross/vite-plugin-voie) - File system based routing for Vite, by [@brattonross](https://github.com/brattonross).
- [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) - Another file system based route generator, by [@hannoeru](https://github.com/hannoeru).

With them, I got the fundamentals of a Vite project setup. Nuxt-liked file-based routing and component auto importing. I was quite satisfied with it as I could focus more on the content and logic rather than getting distracted by the routes setup and component registration.

I also learned [Tailwind CSS](https://tailwindcss.com/) as a replacement of the missing UI component libraries for Vue 3. It turns out that I really enjoy Tailwind's way of rapid prototyping. As I got more control over styling things, it makes me think more about the design rather than just applying the default theme of the components library I use.

### Dark Mode

Dark mode is supported as an experimental feature in Tailwind CSS v1.8 and shipped in v2.0. It supports two modes for you to choose from - `media` and `class`. `media` is something that works out-of-box, it changes based on users' system preference. But the limitation is that you can't toggle it manually as you want. So I went with `class` mode where I have more controls over it. But that also means I would need to implement the toggling logic myself.

With the power of Vue's Composition API, I am able to combine the best parts of them - reactive to the system's preference while being able to override manually.

```ts
import { useStorage, usePreferredDark } from '@vueuse/core'

const preferredDark = usePreferredDark()
const colorSchema = useStorage('color-schema', 'auto')

export const isDark = computed({
  get() {
    return colorSchema.value === 'auto'
      ? preferredDark.value
      : colorSchema.value === 'dark'
  },
  set(v: boolean) {
    if (v === preferredDark.value)
      colorSchema.value = 'auto'
    else
      colorSchema.value = v ? 'dark' : 'light'
  },
})

watch(
  isDark,
  v => document.documentElement.classList.toggle('dark', v),
  { immediate: true },
)
```

Click it to try 👇🏼

<ToggleTheme class="text-2xl pb-2 pt-1"/>

If you would like to use it in your own apps, I also extract the logic above into [`useDark()` in VueUse](https://vueuse.js.org/core/usedark/). Where you can simply use like this:

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```


### Markdown

After building Icônes, I started working on the [Codecember](http://codecember.ink/) project with [@octref](https://blog.matsu.io/about), an initiative of learning and creating generative arts in December. With the spirit of dogfooding, we chosen Vite for building the site. In Codecember we will need to have a prompt every day with some texts, code snippets, and demos. This comes with the problem that Vite does not have a plugin for handling markdown files at that moment, so of course, I made one myself.

- [vite-plugin-md](https://github.com/antfu/vite-plugin-md) - Markdown for Vite.

Basically, it uses [`markdown-it`](https://markdown-it.github.io/) to transform markdown into HTML and feed it into Vue's template compiler. As the generated template is handled by Vue, we can easily support Vue components inside Markdown.

### Syntax Highlighting

Getting syntax highlight works in dark mode isn't an easy task as well. [Shiki](https://github.com/shikijs/shiki) inlined all the colors into the HTML so you would not be bored by the CSS namespace pollution, but that also means it will be really hard to get the colors aware of your global color scheme. [Prism](https://prismjs.com/) on the other hand, uses the classes combining the CSS theme to do the job. It's easier to merge two color schemes and make them aware of the `dark` trigger. The bad thing is, themes are often wrote by different authors with different styles of coloring and styling things. Sometimes, even the font and spacing could be different across different themes. If you ever ran into a similar situation, you should know what I mean. If you don't (lucky you!), see [Prism's themes collection](https://github.com/PrismJS/prism-themes/tree/master/themes)([`prism-vs.css`](https://github.com/PrismJS/prism-themes/blob/c24ddffde2737293d9b2df7dc59939d527648863/themes/prism-vs.css#L9) and [`prism-vsc-dark-plus.css`](https://github.com/PrismJS/prism-themes/blob/c24ddffde2737293d9b2df7dc59939d527648863/themes/prism-vsc-dark-plus.css#L6) for example).

Fight with them for a while you might be able to ease the misalignment eventually. But what if we can have a smarter way to do this?

- [prism-theme-vars](https://github.com/antfu/prism-theme-vars) - A customizable Prism.js theme using CSS variables.

Instead of dealing with the lengthy CSS theme, now you can have one in less than 20 lines of CSS variables. For example:

```css
@import "prism-theme-vars/base.css";

:root {
  --prism-foreground: #393a34;
  --prism-background: #fbfbfb;
  --prism-comment: #b8c4b8;
  --prism-string: #c67b5d;
  --prism-literal: #3a9c9b;
  --prism-keyword: #248459;
  --prism-function: #849145;
  --prism-deleted: #a14f55;
  --prism-class: #2b91af;
  --prism-builtin: #a52727;
  --prism-property: #ad502b;
  --prism-namespace: #c96880;
  --prism-punctuation: #8e8f8b;
}
```

To have it supports dark mode is extremely simple as well:

```css
html:not(.dark) {
  --prism-foreground: #393a34;
  --prism-background: #f8f8f8;
  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #bc8671;
  --prism-punctuation: #80817d;
  --prism-literal: #36acaa;
  --prism-keyword: #248459;
  --prism-function: #849145;
  --prism-deleted: #9a050f;
  --prism-class: #2b91af;
  --prism-builtin: #800000;
}

html.dark {
  --prism-foreground: #d4d4d4;
  --prism-background: #1e1e1e;
  --prism-namespace: #aaaaaa;
  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #ce9178;
  --prism-punctuation: #d4d4d4;
  --prism-literal: #36acaa;
  --prism-keyword: #38a776;
  --prism-function: #dcdcaa;
  --prism-deleted: #9a050f;
  --prism-class: #4ec9b0;
  --prism-builtin: #d16969;
}
```

That's all. You can also play with the themes in the [Playground](https://prism-theme-vars.netlify.app/) and make some your own within 5 mins. I created my first code theme in my life using it, which is also exactly what you are looking at :)


### Serve-Side Generatation (SSG)

While Codecember is more like a site than an app, we would need to do some server-side generation to improve our [SEO](https://searchengineland.com/guide/what-is-seo). Read quite a lot of code from [VitePress](https://github.com/vuejs/vitepress), I came up with this plugin:

- [vite-ssg](https://github.com/antfu/vite-ssg) - Server-side generation for Vite.

The idea here is fairly simple: bundle the app entry, then for each route, dump the app using APIs from the [`@vue/server-renderer`](https://github.com/vuejs/vue-next/tree/master/packages/server-renderer) package. Simplified code here:

```ts
import { renderToString } from '@vue/server-renderer'

const createApp = required('dist-ssr/app.js')

await Promise.all(
  routes.map(async(route) => {
    const { app, router, head } = createApp(false)

    router.push(route)
    await router.isReady()

    const appHTML = await renderToString(app)
    const renderedHTML = renderHTML(indexHTML, appHTML)

    await fs.writeFile(`${route}.html`, renderedHTML, 'utf-8')
  })
)
```

The full code can be found [here](https://github.com/antfu/vite-ssg/blob/fa256449923e05e55bf15dcf4747d517bc22e33a/src/node/build.ts#L94-L104).

With the [@vueuse/head](https://github.com/vueuse/head) package made by [@egoist](https://github.com/egoist), I made the document head/meta manipulation in SSG with ease. Combining with [vite-plugin-md](https://github.com/antfu/vite-plugin-md), you can even use the frontmatter to set the meta (title, description, og:image, etc.).

```html
<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Website Title',
  meta: [
    {
      name: 'description',
      content: 'Website description',
    },
  ],
})
</script>
```

### The Vite Template

I found myself making small web apps frequently. Setting up plugins and configs for Vite kinda becomes the bottleneck for me to make my idea landded. So combining with those tools I am using, I made an opinionated template for myself but unexpectedly got quite some good feedback:

- [Vitesse](https://github.com/antfu/vitesse) - Opinionated Vite Starter Template

## This Website

This site is **made from [Vitesse](https://github.com/antfu/vitesse) combining with all the tools I mentioned above**. To be honest, even making a static site generator right is something hard to me, not to mention that most of the hard parts are already handled by Vite. I am really happy to see so many things I have learned and crafted along the way. And glad I can make these contributions to the Vite ecosystem, that someone could find my work useful for building their apps.

## Thanks

I can't make all these happened without the help/support from the great community, thank y'all!

Also want to have some special thanks to people made significant contributions towards these projects 🙌 (A-Z)

- [@hannoeru](https://github.com/hannoeru)
- [@matias-capeletto](https://github.com/matias-capeletto)
- [@privatenumber](https://github.com/privatenumber)
- [@sibbng](https://github.com/sibbng)

Appreciation to my sponsors as well for supporting my works:

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'>
  </a>
</p>

And thank you for reading through!

**This site is now open sourced at [antfu/antfu.me](https://github.com/antfu/antfu.me)**


