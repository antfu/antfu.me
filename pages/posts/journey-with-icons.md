---
title: Journey with Icons
description: To solve the pain I faced in using icons for the web, I built several tools to make the DX better.
date: 2020-08-16T16:00:00.000+00:00
lang: en
duration: 7min
---

### TL;DR

To solve the pain I faced in using icons for the web, I built the following tools to make the DX better.

#### Apps

* [Icônes](https://github.com/antfu/icones) - Icon Explorer with Instant Fuzzy searching
* [Iconify IntelliSense](https://github.com/antfu/vscode-iconify) - VS Code Extension for inline icon previewing
* [Vitesse](https://github.com/antfu/vitesse) - An Opinionated Vite Starter Template

#### Tools

* [PurgeIcons](https://github.com/antfu/purge-icons) - Bundles icons on demand
* [SVG Packer](https://github.com/antfu/svg-packer) - Pack SVGs to Icon Fonts - In Browser

Would be nice if you are willing to give them a try. As there are still a lot of works to be done, contributions are greatly welcome :)

## Journey with Icons

I make websites and small web-based utilities from time to time. Every time I build them, I take care of the design by myself. Amount of the different aspects, icons always play a big role to me. [Material Design Icons](https://materialdesignicons.com/) is the icon set I used most overtime, it has an excellent design foundation from Google and a wide range of icons maintained by the community. And the most important fact is that it has a complete tooling ecosystem - svgs with js, web fonts or even being built-in supported by Vuetify. I could just plugin it in most any kind of apps with very low effort.

However, if you want to try some other icon sets for different looks & feels, you may not be that lucky. Many awesome icon-sets only offer SVGs for download and need to be manually imported to your projects. This could be a laborious and time-consuming work, even just preview them on your apps.

Fortunately, I found [Iconify](https://iconify.design/) - a unified icons framework that offers over 6,000 icons from 80+ popular icon sets with a single CDN entry and on demand loading. The usage would be something like this:

```html
<!--Import Framework-->
<script src="https://code.iconify.design/1/1.0.7/iconify.min.js"></script>
```

```html
<!--Use an icon from Font Awesome-->
<span class="iconify" data-icon="fa:home"></span>

<!--Use another icon from Material Design Icons-->
<span class="iconify" data-icon="mdi:flask"></span>
```

It's done. You get access to all the 6,000 icons with in an unfied syntax. As it's on-demand, you can switch your icon systems whenever you want without worrying about the setup or the bundle size. It's also framework independent, which means you can use it in Vue, React, Svelte, plain html or whatever you want.

This looks so good and the story should be end here, however, it does have some limitations. As it's loaded on demand via web queries with its icon services, there will be a visible delay for icons to be loaded on the first page, specially when users have unstable connections to the Iconify servers. Also, you might have some logic to change icons with user interactions, Iconify will only start to request the icon when you actually rendered the id into the DOM. This causes some flickers on the icon switching which you possibly want to avoid.

The solution for this is quite straight forward, preloading the icons and the icon rendering could become synchronized. However, loading the entire icon set will impact your bundle size while manually picking what you used could be laborious and make it less flexible.

### [PurgeIcons](https://github.com/antfu/purge-icons)

Inspired by [PurgeCSS](https://purgecss.com/), I made the tool called [PurgeIcons](https://github.com/antfu/purge-icons). It statical analyzes your code and generates the [icon bundle](https://docs.iconify.design/sources/bundles/) on-demand.

![](https://user-images.githubusercontent.com/11247099/89781398-ce625a80-db45-11ea-86bf-d50471c526b7.gif)

Along with [the Vite plugin](https://github.com/antfu/purge-icons/tree/master/packages/vite-plugin-purge-icons/README.md), you can simplify import this inline in your app's entry, and the icons you use will be bundled into your code and load them synchronously.

```ts
import { createApp } from 'vue'
import App from './App.vue'

import '@purge-icons/generated' // <-- This

createApp(App).mount('#app')
```

It also provides a CLI tool and plugins for [Webpack](https://github.com/antfu/purge-icons/tree/main/packages/purge-icons-webpack-plugin) and [Rollup](https://github.com/antfu/purge-icons/tree/main/packages/rollup-plugin-purge-icons). More frameworks support like Vue CLI, Nuxt, Gridsome or even plain html are coming soon.

With it, the tooling is kinda prefect to me now - I can use any icons without any compromise in the runtime. If you want to give it a try, I also made a pre-configured start template [🏕 Vitesse](https://github.com/antfu/vitesse) with PurgeIcons built-in.

## Icon Searching

The tooling get solved, here comes to my another pain for a long time - searching for icons.

I live in China, my network conditions are usually quite unstable for oversee connections. It often took me around 30 seconds to get the searching in [Material Design Icons](https://materialdesignicons.com/) or [Iconify](https://iconify.design/). And for most of the time, you won't get the perfect icons on your first try. Repeating searching for multiple times with a huge delay is just killing me.

And so, I finally get some time and motivation to work on making one my own recently. Also considering this being a chance for me to try Vue 3 + Vite and to learn Tailwind CSS.

### Icônes

By the power of Iconify, I can only ship with the icon IDs and leave the icon loading task to Iconify. In this way, searching could be done locally - instantly.

![](https://github.com/antfu/icones/raw/master/screenshots/1.png)

![](https://github.com/antfu/icones/raw/master/screenshots/2.png)

With Iconify's data collection, it can get access to all the 80+ icon sets within a single place.

I also made a small utility called [SVG Packer](https://github.com/antfu/svg-packer) for Icônes. With it, you can select the icons you want and pack them into ready to used icon fonts. 

![](https://github.com/antfu/icones/raw/master/screenshots/5.png)

![](https://github.com/antfu/icones/raw/master/screenshots/3.png)

> Tips: You can also copy the icons as Vue or React components

Try it out if you haven't. A fully-offline electron version is also coming soon.

## Editor Support

Browsing and searching for icons are good to me now. Now comes to the editor integration. It's actually kinda hard to know what the icons look like from their IDs. Auto-completion for IDs is also a good feature I would love to have. 

### [Iconify IntelliSense](https://github.com/antfu/vscode-iconify) for VS Code

With a lot of inspirations from the [VS Code extension for MDI](https://github.com/lukas-tr/vscode-materialdesignicons-intellisense), Iconify IntelliSense was born.

![](https://github.com/antfu/vscode-iconify/raw/master/screenshots/preview-1.png)

Loading icon data and cache them on demand, it encoded svgs into data urls to be displayed as images in VS Code. With the [TextEditorDecoration](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions) API, I achieve the feature to replace the icon IDs with the icon image itself in place. The icons will become visible and editable when you move the cursor around them.

Auto-completion with icon preview is also available. By typing the icon set id and the following delimiter colon `:`, a list of icons in the set will popup and you may continue type to do a simple search.

### Journey is not ended

These apps and tools solved my long pain with icons. I can focus on bringing ideas live much more efficiently. I will call it a page for now, however, the journey is not yet ended. I am still passioning about exploring how the tooling for icons could go. And also keep polishing these tools to make them easier to use and integrate. Wish they could benefit more developers and designers, and make site building more simple and pleasant. 

Glad if you found them useful to you as well. And thanks for reading XD.
