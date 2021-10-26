---
title: Journey with Icons Continues
description: My journey with icons and the solutions I made along the way
date: 2021-09-10T18:00:00.000+00:00
lang: en
duration: 15min
---

[[toc]]

<div class="flex gap-3 text-lg py-2">
  <tabler:code />
  <tabler:bolt />
  <tabler:triangle-square-circle />
  <tabler:confetti />
</div>

About one year ago, I wrote a blog post [Journey with Icons](/posts/journey-with-icons), sharing the tools I have made for solving my needs on using icons in frontend projects.

During this period, the Vite along its community has evolved quite a lot. The mindsets of Vite have inspired many projects to come up with efficient and innovative solutions.

In this post, I will share the continuation of my journey with icons and the tools I have ended up with so far.

## PurgeIcons & Its Limitations

[PurgeIcons](https://github.com/antfu/purge-icons) is my first attempt to improve the loading speed of [Iconify](https://iconify.design/) - a united icon library that allows you to use any icons for any framework. The main problem is that it's purely client-side. Even it's flexible to work with any framework, the client-side requests inevitably introduce the flash of missing icons. To solve that, I made PurgeIcons by statically scanning your icon usages and bundle them together with your app, so the Iconify runtime could load them without additional requests.

This solution works, but it only solves the problem partially. As the icons are bundled within JavaScript and functions outside the frameworks, it's not ideal for working with framework-specific features like server-side rendering/generation, props passing, etc. We need to find a better way of doing it.

## The New Solution

One of the core-concept of Vite is that everything is **on-demand**. Modules get transpiled only when they are being requested. In this way, the Vite server starts immediately without the need to bundle your entire app. Additionally, [Vite's plugin API](https://vitejs.dev/guide/api-plugin.html) is an extension on top of [Rollup's plugin system](https://rollupjs.org/guide/en/#plugin-development), which allows you to do some [custom transformations](https://rollupjs.org/guide/en/#transform) to the modules.

So, if we think in Vite's way - maybe we could solve this at compile-time instead of client-side! By using [virtual modules](https://vitejs.dev/guide/api-plugin.html#importing-a-virtual-file), I was able to serve the icons as components **on-the-fly** and made it as 
[`vite-plugin-icons`](https://github.com/antfu/unplugin-icons) (renamed to `unplugin-icons` later on).

```ts
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    IconsPlugin()
  ]
})

function IconsPlugin() {
  return {
    name: 'vite-plugin-icons',
    // tell Vite that ids start with `~icons/` are virtual files
    resolveId(id) {
      if (id.startsWith('~icons/'))
        return id
      return null
    },
    // custom logic to load the module
    load(id) {
      if (!id.startsWith('~icons/'))
        return
      const [prefix, collection, name] = id.split('/')
      // get icon data from Iconify
      const svg = getIconSVG(collection, name)
      // we compile the SVG as a Vue component
      return Vue3Compiler(svg)
    }
  }
}
```

And the usage will be like this:

```html
<script setup>
import MdiAlarm from '~icons/mdi/alarm'
import FaBeer from '~icons/fa/beer'
import TearsOfJoy from '~/icons/twemoji/face-with-tears-of-joy'
</script>

<template>
  <MdiAlarm />
  <FaBeer style="color: orange"/>
  <TearsOfJoy/>
</template>
```

<div class="flex gap-3 p-3">
<MdiAlarm />
<FaBeer style="color: orange"/>
<twemoji:face-with-tears-of-joy />
</div>

You might notice the usages are pretty similar to existing solutions like [React Icons](https://react-icons.github.io/react-icons/). However, most of them approaching this by compiling all the icons into multiple files and distribute them as npm packages. Not only does it ships additional bytes for every icon and increases the time for compilers to parsing them, that also means you are limited to what they have offered exclusively. 

With `unplugin-icons`, you can use any icons available in [Iconify](https://icones.js.org/) (which is 100+ icon sets with over 10,000 icons and continue growing) by the following convention:

```ts
import Icon from '~icons/[collection]/[name]'
```


You can learn more about the installation and usage on <GitHubLink repo="antfu/unplugin-icons" />

## Universal

### Universal on Icons

The unification or Icons are already done in Iconify by providing the icons in the same, normalized [JSON format](https://github.com/iconify/collections-json), so what if we could have it more universally available for the tools we loved?

<GitHubLink repo="iconify/collections-json" />

### Universal on Frameworks

Initially, I was made this plugin only for Vue 3 on Vite. But since we are doing the complication on-demand, I figured out that we could actually apply for different compilers based on the frameworks users use. With that idea, now it supports using icons as components for Vue 3, Vue 2, React, Preact and Solid! (Contributions to add more is great welcome!)

```ts
function Vue3Compiler(svg) { /* ... */ }
function Vue2Compiler(svg) { /* ... */ }
function JSXCompiler(svg) { /* ... */ }
function SolidCompiler(svg) { /* ... */ }
// ...add more!

function IconsPlugin({ compiler }) {
  return {
    name: 'vite-plugin-icons',
    resolveId(id) { /* ... */ },
    load(id) {
      /* ... */
      // we could apply different compilers here as needed
      return compiler(SVG)
    }
  }
}
```

With this, you can have it working in React like:

```jsx
import MdiAlarm from '~icons/mdi/alarm'
import FaBeer from '~icons/fa/beer'
import TearsOfJoy from '~/icons/twemoji/face-with-tears-of-joy'

export function MyComponent() {
  return (<>
    <MdiAlarm />
    <FaBeer style="color: orange"/>
    <TearsOfJoy/>
  </>)
}
```

### Universal on Build Tools

In the past few weeks, I have joined [NuxtLabs](https://nuxtlabs.com/) and worked on a universal plugin layer for our various bundling tools - <GitHubLink repo="unjs/unplugin" />. It allows you to use a unified plugin API to write plugins for Vite, Webpack, Rollup, Nuxt, Vue CLI, and more only once. To make it work, all we need to do is to change our code like:

```ts
export function VitePluginIcons() {
  return {
    name: 'vite-plugin-icons',
    resolveId(id) { /* ... */ },
    load(id) { /* ... */ }
  }
}
```

```ts
import { createUnplugin } from 'unplugin'

const unplugin = createUnplugin(() => {
  return {
    name: 'unplugin-icons',
    resolveId(id) { /* ... */ },
    load(id) { /* ... */ }
  }
})

// Use unplugin to generate plugins for different build tools
export const VitePluginIcons = unplugin.vite
export const WebpackPluginIcons = unplugin.webpack
export const RollupPluginIcons = unplugin.rollup
```

That's cool. With it, you don't need to learn each frameworks' plugin API and publish them in multiple packages - now you got one package for all of them!

<GitHubLink repo="unjs/unplugin" />

### Universal Solution

With all the effort above, I converted my `vite-plugin-icons`, a Vite + Vue 3 specific icon plugin, to `unplugin-icons` as a universal icons solution.

For what I mean universal, I mean literally, you can use:

<ul class="children:my-auto">
<li><span><logos:vue class="inline"/> Vue 3 + <vite-logo class="inline"/> Vite + <carbon:carbon class="inline"/> <a href="https://carbondesignsystem.com/guidelines/icons/library/" target="_blank">Carbon Icons</a></span></li>
<li><span><logos:react class="inline"/> React + <logos:nextjs-icon class="inline filter dark:invert"/> Next.js + <mdi:material-design class="inline"/> <a href="https://materialdesignicons.com/" target="_blank">Material Design Icons</a></span></li>
<li><span><logos:vue class="inline"/> Vue 2 + <logos:nuxt-icon class="inline"/> Nuxt.js + <uim:circle-layer class="inline"/> <a href="https://iconscout.com/unicons" target="_blank">Unicons</a></span></li>
<li><span><logos:preact class="inline"/> React + <logos:webpack class="inline"/> Webpack + <twemoji:star-struck class="inline"/> <a href="https://github.com/twitter/twemoji" target="_blank">Twemoji</a></span></li>
<li><span><solid-logo class="inline"/> Solid + <vite-logo class="inline"/> Vite + <tabler-writing-sign class="inline"/> <a href="https://tabler-icons.io/" target="_blank">Tabler</a></span></li>
<li><span><logos:javascript class="inline"/> Vanila + <logos:rollup class="inline"/> Rollup + <bx:bx-planet class="inline"/> <a href="https://github.com/atisawd/boxicons" target="_blank">BoxIcons</a></span></li>
<li><span><logos:webcomponents class="inline"/> Web Components + <vite-logo class="inline"/> Vite + <ant-design:carry-out-twotone class="inline"/> <a href="https://github.com/ant-design/ant-design-icons" target="_blank">Ant Design Icons</a></span></li>
<li><span><logos:svelte-icon class="inline"/> Svelte + <logos:svelte-icon class="inline"/> SvelteKit + <eos-icons:installing class="inline"/> <a href="https://gitlab.com/SUSE-UIUX/eos-icons" target="_blank">EOS Icons</a></span></li>
<li><span><line-md:question-circle class="inline"/> Any + <mdi:progress-question class="inline"/> Any + <ph:circle-wavy-question-duotone class="inline"/> Any</span></li>
</ul>

...really, you made the combinations!

Get it now 👇

<GitHubLink repo="antfu/unplugin-icons" />

## One More Thing

Oh, you are still here. So I guess you are looking for something even further.

As you might notice, whenever you want to use an icon, you need to import it first, name it, and then use it. In this case, the icon name has been repeated at least three times. For example:

###### Vue

```html
<script setup>
import MdiAlarm from '~icons/mdi/alarm'
</script>

<template>
  <MdiAlarm />
</template>
```

###### React

```jsx
import MdiAlarm from '~icons/mdi/alarm'

export function MyComponent() {
  return (
    <div>
      <MdiAlarm />
    <div/>
  )
}
```

So yes, we might need a better way to do this.

### Auto-importing

Inspired by <GitHubLink repo="nuxt/components" /> which registers components under your `./components` directory automatically, I made <GitHubLink repo="antfu/unplugin-vue-components" /> (yes, another unplugin!) do to compile-time components auto-importing on-demand. With the on-demand natural, we could even make the components resolving on-demand. What a perfect complement for our icon solution! 

`unplugin-vue-components` provide the options `resolvers` to provide custom functions to resolve where the components should be imported from.

Here is an example configuration for Vite (since both of them are unplugins, you can also use them for Webpack and Rollup):

```ts
// vite.config.js
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    /* ... */
    Icons(),
    Components({
      resolvers: [
        IconsResolver({
          // to avoid naming conflicts
          // a prefix can be specified for icons
          prefix: 'i'
        })
      ]
    })
  ]
})
```

Then we can use them directly in our templates, no more imports and repeats (and you can change the icons much easier as you don't need to update in three places):

```html
<template>
  <!-- both PascalCase and dash-case are supported by Vue -->
  <IMdiAlarm />
  <i-fa-beer style="color: orange"/>
</template>
```

Isn't it perfect?! 

Learn more: <GitHubLink repo="antfu/unplugin-vue-components" />

> Auto-import integrations for `@nuxt/components` is in progress.

#### Auto-importing for JSX

Oh, I almost forgot about it. Since JSX is more like plain JavaScript in some ways and JSX components are just functions or classes, the thing is actually a bit simpler. For that, we can use another unplugin I made - <GitHubLink repo="antfu/unplugin-auto-import" />.

For some background here, `unplugin-auto-import` is a compile-time successor of <GitHubLink repo="antfu/vue-global-api" /> to improve DX of Vue Composition API (directly use of `ref`, `computed`, etc.). 

With the expansion to a general auto-importing solution for any API sets, it's also possible to do auto-importing for JSX components. in `unplugin-auto-import`, we implement the same resolver interface for it.

```ts
// vite.config.js
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    /* ... */
    Icons({
      compiler: 'jsx'
    }),
    AutoImport({
      imports: [
        'react' // preset for react
      ],
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          extension: 'jsx'
        })
      ]
    })
  ]
})
```

Here is your React component, and you are welcome :)

```ts
export function MyComponent() {
  return (
    <>
      <IconMdiAlarm />
      <IconFaBeer style="color: orange"/>
    </>
  )
}
```

## Recap

For a quick summary, here is the list of projects mentioned for these solutions:

- <GitHubLink repo="unjs/unplugin" /> - Unified plugin system for Vite, Rollup, Webpack, and more.
- <GitHubLink repo="antfu/unplugin-icons" /> - Access thousands of icons as components on-demand.
- <GitHubLink repo="antfu/unplugin-vue-components" /> - On-demand components auto importing.
- <GitHubLink repo="antfu/unplugin-auto-import" /> - Auto import APIs on-demand.

Meanwhile, you might also find these tools from my last journey helpful:

- <GitHubLink repo="antfu/icones" /> - Icon Explorer for Iconify with Instant searching and exporting.
- <GitHubLink repo="antfu/vscode-iconify" /> - Iconify IntelliSense for VS Code.

If you enjoy them, you might also want to check my Vue + Vite starter template with them configured in-box.

- <GitHubLink repo="antfu/vitesse" /> - Opinionated Vite Starter Template.
- <GitHubLink repo="antfu/vitesse-lite" /> - Lightweight version of Vitesse.
- <GitHubLink repo="antfu/vitesse-webext" /> - WebExtension Vite Starter Template.
- <GitHubLink repo="antfu/vitesse-nuxt" /> - Vitesse experience for Nuxt 2 and Vue 2.

Again, thanks for reading through :)
