---
title: Develop with Vite - Vue Beijing
type: talk
date: 2021-03-28T16:00:00.000+00:00
lang: en
recording: true
duration: 18min
---

[vite]: https://github.com/vitejs/vite
[esbuild]: https://github.com/evanw/esbuild
[awesome list]: https://github.com/vitejs/awesome-vite

> This is the transcript of my talk at [Vue Beijing](https://twitter.com/beijing_vue)
>
> Slides: [English ver.](https://antfu.me/talks/2021-03-28/en) | [中文 ver.](https://antfu.me/talks/2021-03-28/zh)
> 
> Recording: [YouTube (English)](https://www.youtube.com/watch?v=xx8gEHet6n8)

I guess many of you have already heard about [Vite], as the next thing replacing other bundlers like Webpack. Well, it's actually not 100% true. While we are used to "Build with Webpack", and now, more precisely, we are **Developing with Vite**.

Today I am going to present you with a brief introduction to Vite, the next-generation development tools. And I believe you will find out the answer after it.

## What is Vite?

Vite is a French word meaning fast. The initial motivation of it is that Evan You, the creator of Vue, got an idea of making a dev server with hot reload for Vue Single File Component without a bundler. And yeah, after a few days, Vite comes out.

With the name of fast, it has to be fast. And it is.

Let me show you a quick [demonstration of how fast it is](https://twitter.com/amasad/status/1355379680275128321). On the left-hand side, we have Create React App, and on the right we have Vite. And you can see during I am introducing to them, the Vite app is already ready and playable, while the other one just finishes installing its dependencies. In this demo, we can see we have over 4x faster boot-up speed improvement over Create React App, on the single component starter template. And actually, it's not even showing the full potential of Vite.

So how could Vite be so fast? 

First, Vite is opinionated on providing better DX. It assumes that you are using modern browsers for development, so we don't need to have complex transpiling and polyfills involved. Also since your browser already understands Native ES module, we can even skip the bundling process and let the browser do it for us. We also involved with some optimizations to make it even faster, which I will go through them later.

We have a build mode for production powered by rollup. The difference between development and production make Vite capable of having good experiences for both of them.

### The Dev Server

In a traditional bundle-based dev server, when we start the server, it will bundle your entire app and the server is ready only until the bundling is finished. In a large-scale app, it could take quite a lot of time.

Native ESM bases server, on the other hand, does need to do the bundling at all. The server is ready immediately and it will only transpile the modules of the pages you have opened on-demanded. So even you have a huge app with thousands of pages, it will be constantly fast as it only needs to transpile the modules for one page.

The transpling is powered by [esbuild]. It is a transpiler and bundler written in Go and build to native code. It is optimized with speed in mind and utilizes the potential of parallelism. It claims that it can be 10-100x faster than the traditional build tools.

With the support [esbuild], we are able to support JSX, TypeScript out-of-the-box.

### Dependencies Pre-bundling

Another optimization of Vite is the dependencies pre-bundling. Normally, your dependencies do not change really often unless you are upgrading them, but on the other hand, your user code can change everyday. 

So by treating the user code and dependencies differently, we pre bundles your dependencies into a single file standard ESM that can be understood by the browser. In this way, we ease out the difference of packages shipping different js formats like `cjs` or node favored modules. It also reduced HTTP request overhead and importing waterfall.

And this bundling process is also powered by [esbuild], with over 20x faster performance.

### Hot Module Replacement

Another important part of Vite is that it has out-of-box hot module replacement support. Whenever you made a change to your code, the HMR is triggered. It's smart enough to know which modules would be affected by the changes and replace them efficiently. And we have first-party support for Vue single-file components and React Refresh.

As Vite is made by Evan, you may think it's only Vue. Well, initially, it was kind of true, but things are different now.

From Vite 2.0, it's now framework-agnostic and Vue is supported through a plugin. It also comes with a bunch of new features and improvements, for example the universal plugin system and first-class SSR. For more details, you check out the links in the slide.

You can use `npm init` to create the starter project with the official templates. As you can see, we have supported Vue, React, Preact, Lit Element, Svelte, and even vanilla. It's not limited to these, we will keep adding more as we go.

---

## Powerful Plugins System

Vite's plugins are compatible with Rollup plugins. This means you can use the huge amount of existing plugins from rollup on Vite.

You can check out [this Vite Rollup Plugins site](https://github.com/patak-js/vite-rollup-plugins) by our team member [@patak-js](https://github.com/patak-js). It lists all the compatibility of popular rollup plugins with some demo and guides of how to use them.

We also have [an awesome list](https://github.com/vitejs/awesome-vite) that lists Vite plugins for different ecosystems. Check it out, I believe you will find some of them useful to you.

---

## Fresh Vue Authoring Experience

I'd like to feature some Vite plugins for Vue that provide the Fresh authoring experience on creating Vue apps.

### [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) by [@hannoeru](https://github.com/hannoeru)

It provides Nuxt.js-like file base routing, with dynamic routes support that can be accessed as the props in the page component.

Only with 3 lines of code, you can set up this feature and use it immediately.

```ts
import { createRouter } from 'vue-router'
import routes from 'virtual:generated-pages'

const router = createRouter({ routes })
```

Check [its docs](https://github.com/hannoeru/vite-plugin-pages) for more.

### [`vite-plugin-components`](https://github.com/hannoeru/vite-plugin-components) by [@antfu](https://github.com/antfu)

In Vue, writing the name of the component four times in order to import them is kind of a pain for me. So I made this plugin to do the component auto-importing. Now you can put your components under `src/components` and then use them everywhere without needing to import them. We also have built-in support for auto importing component libraries with minimal configurations. For now, we have supported Vuetify, Ant Design Vue, Element Plus, Vant, and so on.

From:

```html
<script>
import HelloWorld from './src/components/HelloWorld.vue'

export default {
  components: {
    HelloWorld
  }
}
</script>

<template>
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>
```

To:

```html
<template>
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>
```


### [`vite-plugin-icons`](https://github.com/hannoeru/vite-plugin-icons) by [@antfu](https://github.com/antfu)

Another one is `vite-plugin-icons`. It allows you to use icons from any icon set, for example, Material design icons and Font awesome. Which the on-demand spirit of Vite, this will only ship with the icons that you actually use. So you can say goodbye to the old-school icon font approach that downloads a huge font with all the icons that you don't actually need.

It also works well with the component auto importing, and you can use them like magic.

```html
<template>
  <i-carbon-accessibility/>
  <i-mdi-account-box style="font-size: 2em; color: red"/>
</template>
```

### [`vite-plugin-windicss`](https://github.com/windicss/vite-plugin-windicss) by [@antfu](https://github.com/antfu)

If you have ever used [Tailwind CSS](https://tailwindcss.com/), you must aware it's actually quite slow in the dev server as it ships all the utilities with megabytes of CSS to your client. This becomes the slowest part of my Vite app.

Luckily, we have a new thing called [Windi CSS](https://github.com/windicss/windicss), which you can think of it as the on-demand Tailwind CSS. Instead of shipping all the combinations of classes and purge them down later. It only generates the classes you actually use. Turns out it can be 20-100x faster than the traditional Tailwind. While it's on-demand, it also opens up more features like unit auto-inferring. Do check it out if you are using Tailwind.

### Try them all

If you found them interesting and want to try it yourself, I also made a starter template call [Vitesse](https://github.com/antfu/vitesse), with all of them included and more features. Pull it down and check out.

These are only a small part of our plugins ecosystem, we have more of them available in the [awesome list] do remember to check them out.

### Vue 2 for Vite

If you are still using Vue 2, no worries, we have your covered!

While the official Vue plugin is for Vue 3. Another Vite team member [@underfin](http://github.com/underfin) made the plugin [`vite-plugin-vue2`](https://github.com/underfin/vite-plugin-vue2) for Vue 2. With a single line in the config, you are good to go. It's been wildly adapted already, for example, [Nuxt 2 for Vite](https://github.com/nuxt/vite) is powered on it.

In the [awesome list], we have marked the compatibility for each plugin of the Vue 2 support. Many of them are isomorphic to both Vue 3 and 2. If you are going to try Vue 2, you don't want to miss it.

### Legacy Browser Support

Vite uses native ESM on both development and production, but if you want to enable legacy browsers that do not support ESM, no problem, we have it.

There is an official plugin [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) that uses Babel and System JS to transform the modules for legacy support. 

```ts
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```

Check out the docs for more details.

---

## Ecosystem and Community

Then, let's talk a bit about the community.

I bet you already have this question - Vite is great, but what does Vite mean for the existing Vue ecosystem? Let me help you to find it out.

How about [VuePress](https://github.com/vuepress/vuepress-next)? It's actually [already supported Vite in the version 2 beta](https://twitter.com/meteorlxy_cn/status/1370728812971917315)! In v2, you can swap the engine between Webpack and Vite, and have the instant reload from Vite. Check out the docs for how it works!

As for Nuxt, we actually have some exciting news! The [upcoming Nuxt 3 will support interchangeable engines between Webpack and Vite](https://twitter.com/_pi0_/status/1352344462954016768). And you can get the benefit of the huge Nuxt community. It will be available as a public beta at Q2 this year. They also release [an experimental project for Nuxt 2 to support Vite](https://twitter.com/_pi0_/status/1365049110982778884) where you can try it today.

About Vue CLI, as [Evan mentioned](https://twitter.com/youyuxi/status/1354584410482499585), we weren't intended to replace Vue CLI with Vite, but it turns out it could be. The long-term goal of Vue CLI is to support Vite with a powerful scaffolding capability and easier to get started.

We also have a community plugin [`vue-cli-plugin-vite`](https://github.com/IndexXuan/vue-cli-plugin-vite) that enables Vite support in Vue CLI that you can play with it today.

---

## Higher-level Integrations

We also have a community plugin that enables Vite support in Vue CLI that you can try today. And on top of Vite, we are now having some cool higher-level integrations tools.

The first one is [VitePress](https://github.com/vuejs/vitepress), a Vite and Vue powered static site generator. Similar to VuePress, but with more opinionated pre-configuration. This project is still experimental but already served as the generator for many official documentation sites, including the Vite docs itself.

[Ream](https://github.com/ream/ream) is a Vite-based framework with the support of fast SSR built-in by [@egoist](https://github.com/egoist). At the time I am preparing these slides, it's doing a rewrite to make not only for Vue but also for any frameworks. Stay tuned on that.

Edge side rendering becomes quite popular recently, and we are also having a tool called [Vitedge](https://github.com/frandiox/vitedge) by [@frandiox](https://github.com/frandiox) to bring it to Vite. Take a look at its repo as well.

Vite also supports [backend integrations](https://vitejs.dev/guide/backend-integration.html), now we already have [Vite Ruby](https://github.com/ElMassimo/vite_ruby) by [@ElMassimo](https://github.com/ElMassimo) and [Laravel Vite](https://github.com/innocenzi/laravel-vite)by [@innocenzi](https://github.com/innocenzi) in the community. They leverage Vite to serve the front-end and benefit from Vite's fast performance.

You can also set up your own backend integrations easily by following the docs below.

---

## Upcoming

Not only for Vue and the new tools. The tools you love are also going to support Vite. Here are some news for upcoming things I'd like to share with you.

[Svelte Kit](https://github.com/sveltejs/kit) is the next official build tools for Svelte, and [they are moving from Snowpack to Vite](https://github.com/sveltejs/kit/pull/409). It's in the early beta now and you can check it out if it got you interested.

[Cypress is also adding the first-class Vite support](https://twitter.com/_jessicasachs/status/1354585366620221443). I believe we can see it ready within this year.

And [Storybook is also exploring the interchangeable engines for Vite and Snowpack](https://twitter.com/storybookjs/status/1371894052015239170). You can also keep an eye on that.

---

## Start Vite today!

We are waiting for you to join our community and start playing with us! 

Just firing up this command in your terminal to get the first impressions!

```bash
npm init @vitejs/app
```

That's all for today. Join the [discord](http://chat.vitejs.dev/) to chat with us and follow us on [Twitter](https://twitter.com/vite_js) to get the latest news.

See you in the community, thank you!
