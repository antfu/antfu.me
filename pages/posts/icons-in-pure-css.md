---
title: Icons in Pure CSS 
date: 2021-10-31T16:00:00Z
lang: en
duration: 10min
description: The icon solution in pure CSS.
---

[[toc]]

> [中文 Chinese Version](/posts/icons-in-pure-css-zh)

In my previous post about [Reimagine Atomic CSS](/posts/reimagine-atomic-css#pure-css-icons), I introduced a preset of [UnoCSS](https://github.com/antfu/unocss) that provides the ability to **use any icons on-demand in purely CSS**. Today in this post, I'd like to share with you how we made it possible.

## My Icon Explorations

If you are interested in how I get here, there is an index of my previous post about the stories of my icon explorations and experiments.

- Aug. 2020 - [Journey with Icons](/posts/journey-with-icons)
- Sep. 2021 - [Journey with Icons Continues](/posts/journey-with-icons-continues)
- Oct. 2021 - [Reimagine Atomic CSS (The CSS Icons Preset)](/posts/reimagine-atomic-css#pure-css-icons)
- Nov. 2021 - Icons in Pure CSS - *you are here!*

## Prior Arts

I know there is a Pure CSS icon solution called [`css.gg`](https://github.com/astrit/css.gg), which is a great idea to use pseudo-elements (`::before`, `::after`) to construct the icons. However, that could require some expert knowledge of how CSS works, but I imagine that approach could be hard to create more complex icons. Instead of the limited choices in a specific set, I am seeking **a more general solution that could apply to any icons**.

## The Idea

The idea come from [this feature request](https://github.com/antfu/unplugin-icons/issues/88) created by [@husayt](https://github.com/husayt) to `unplugin-icons` and the initial implementation in [this pull request](https://github.com/antfu/unplugin-icons/pull/90) by [@userquin](https://github.com/userquin). The idea here is quite straightforward - to generate CSS with the icons in [DataURI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) as the background image.

```css
.my-icon {
  background: url(data:...) no-repeat center;
  background-color: transparent;
  background-size: 16px 16px;
  height: 16px;
  width: 16px;
  display: inline-block;
}
```

With that, we could use any images inlined in CSS with a single class.

<div grid="~ cols-2">

```html
<div class="my-icon"></div> 
```

<div i-twemoji-grinning-face text-5xl my-auto mx-4 />
</div>

It's indeed an interesting idea. However, this is more like an image instead of an icon. To me, an icon has to be scalable and colorable (if it's monochrome).

## Make it Work

### DataURI

Thanks again to [Iconify](https://iconify.design/), which unified 100+ icon sets with 10,000+ icons into [the consistent JSON format](https://github.com/iconify/collections-json). It allows us to get the SVG of any icon set by simply providing the collection and icon ids. The usage is like this:

```ts
import { iconToSVG, getIconData } from '@iconify/utils'

const svg = iconToSVG(getIconData('mdi', 'alarm'))
// (this is not the exact API, simplified here for demo)
```

Once we got the SVG string, we could convert the it to DataURI:

```ts
const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
```

Talking about DataURI, it's almost the default choice to use [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) until I read [Probably Don't Base64 SVG](https://css-tricks.com/probably-dont-base64-svg/) by Chris Coyier. Base64 is needed to encode binary data like images to be used in plain text files like CSS, while for SVG, since it's already in text format, the extra encoding to Base64 actually makes the file size larger.

Combine the technique mentioned in [Optimizing SVGs in data URIs](https://codepen.io/Tigt/post/optimizing-svgs-in-data-uris) by Taylor Hunt to improve the output size, further, here is the solution we end up with.

```ts
// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
function encodeSvg(svg: string) {
  return svg.replace('<svg', (~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}

const dataUri = `data:image/svg+xml;utf8,${encodeSvg(svg)}`
```

### Scalable

The first step of making the "image" more like an icon, we need to make it scalable to the context.

Luckily we have the first-class support scaling support - the `em` unit.

```css
.my-icon {
  background: url(data:...) no-repeat center;
  background-color: transparent;
  background-size: 100% 100%;
  height: 1em;
  width: 1em;
}
```

By changing the `height` and `width` to `1em`, and the `background-size` to `100%`, we made the image scales based on the parent's font size.

- <span text-sm>Small <span inline-block vertical-text-bottom i-ri-bike-line></span></span>
- <span text-base>Normal <span inline-block vertical-text-bottom i-ri-bike-line></span></span>
- <span text-xl>Large <span inline-block vertical-text-bottom i-ri-bike-line></span></span>

### Colorable

In inlined SVG, we could use [`fill="currentColor"`](https://www.w3.org/TR/css-color-3/#currentcolor) to make the color of the SVG matches with the current text color. However, when we use it as a background image, it becomes a flat image. The dynamic parts of the SVG are lost, so is the `currentColor` magic (it's just like you can't override the color of a PNG).

If you do a quick search, you will find that most people are telling you that you can't. Some might offer you the option to assign the colors in the SVG before converting to DataURI, which could solve the specific problem that you want the icon to have color, but not the root cause that the color is not reactive to the context.

Then you might come up with the idea of using [CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter), like Una Kravets mentioned in [Solved with CSS! Colorizing SVG Backgrounds](https://css-tricks.com/solved-with-css-colorizing-svg-backgrounds/). That sounds valid, but only that you need to calculate the matrix of how to transform the color to the desired ones. Probably feasible by introducing some runtime JavaScript for that? Maybe, if so, we lost the whole point of trying icons in pure CSS.

This sounds like a dead-end to me. Until I accidentally found the article [Coloring SVGs in CSS Background Images](https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images) by Noah Blon. In the article, Noah mentioned a brilliant idea of using [CSS masks](https://developer.mozilla.org/en-US/docs/Web/CSS/mask) - a property that I have never heard of before.

```css
.my-icon {
  background-color: red;
  mask-image: url(icon.svg);
}
```

Instead of using the icon as a background image and figuring out a way to color it, we could actually use the icon as a mask to clip the filled background color. Furthermore, we could now use the `currentColor` magic to have the icon matching with the parent text color!

```css
.my-icon {
  background-color: currentColor;
  mask-image: url(icon.svg);
}
```

<div pt-4 />
<div text-sky text-xl>This is a blue text, with the blue icon <div i-uil-cloud-showers-heavy /><div i-uil:wind /></div>
<div text-lime text-xl>Green <div i-uil:trees /><div i-uil:desert /></div>
<div text-orange text-xl>Orange <div i-uil:restaurant /><div i-uil:store-alt /></div>

### Icons with Colors

We made the monochrome icons colorable but now it problem comes to the icons with colors. With the mask approach, the colors and content of the icons got lost, for example:

<div text-4xl inline-flex gap-2 py-4 px-8 bg-gray-400:15 rounded>
<div text-base my-auto>Icon:</div>
<div i-twemoji:astonished-face />

<div text-base my-auto ml-4>Masked:</div>
<div i-ph:circle-fill style="transform: scale(1.3)" />
</div>

Yes, I might say it's hard for one approach to cover all the cases.

Unless - you could **blend two approaches into one**! Remember we just talked about the background image approach serving the icons as images? Isn't that just what we want for colored icons? - We don't need to change the colors after all!

So the solution is actually pretty simple, we just need to find a way to distinguish the monochrome and colored icons smartly. Luckily, since we had access the the SVG content, we could have:

```ts
// if an SVG icon have the `currentColor` value,
// it's very likely to be a monochrome icon
const mode = svg.includes('currentColor')
  ? 'mask'
  : 'background-img'

const uri = `url("data:image/svg+xml;utf8,${encodeSvg(svg)}")`

// monochrome
if (mode === 'mask') {
  return {
    'mask': `${uri} no-repeat`,
    'mask-size': '100% 100%',
    'background-color': 'currentColor',
    'height': '1em',
    'width': '1em',
  }
}
// colored
else {
  return {
    'background': `${uri} no-repeat`,
    'background-size': '100% 100%',
    'background-color': 'transparent',
    'height': '1em',
    'width': '1em',
  }
}
```

And it works surprisingly well! You know, it's now behavior similar to the thing we are using daily - system's native emojis. The color of texts changes based on the context, while emojis stay the colors of their own.

Here are some showcases of what we end up with:

<div text-xl all:mx-1 all:my-2 all:vertical-middle>

<span op60 text-sm inline-block w-40 text-right>Material Design</span> <div i-ic:baseline-account-circle /> <div i-ic:baseline-card-membership /> <div i-ic:baseline-verified text-green5 /> <div i-ic:outline-explore text-sky5 />
<br><span op60 text-sm inline-block w-40 text-right>Carbon</span> <div i-carbon:chart-multitype /> <div i-carbon:network-4 /> <div i-carbon:wind-gusts /> <div i-carbon:collaborate />
<br><span op60 text-sm inline-block w-40 text-right>Tabler</span> <div i-tabler:building-carousel /> <div i-tabler:circle-square /> <div i-tabler:color-swatch /> <div i-tabler:cut />
<br><span op60 text-sm inline-block w-40 text-right>Twemoji</span> <div i-twemoji:grinning-face-with-smiling-eyes /> <div i-twemoji:face-in-clouds /> <div i-twemoji:weary-cat /> <div i-twemoji:teacup-without-handle />
<br><span op60 text-sm inline-block w-40 text-right>Logos</span> <div i-logos:vue /> <div i-logos:blender /> <div i-logos:chrome /> <div i-logos:codepen-icon />

</div>

To see and find all the icons available, you can check out my other project [Icônes](https://icones.js.org/).

## Use It

If you want to try this icons solution in your project, you can install [UnoCSS](https://github.com/antfu/unocss) and the icons preset:

```bash
npm i -D unocss @unocss/preset-icons @iconify/json
```

`@iconify/json` is the package that stores the icon data from Iconify. Alternatively, you could install per icon set, for example, `@iconify-json/mdi` for Material Design Icons or `@iconify-json/carbon` for Carbon Icons and so on.

Then in your `vite.config.js`

```ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss'
import UnocssIcons from '@unocss/preset-icons'

export default defineConfig({
  plugins: [
    UnoCSS({
      // when `presets` is specified, the default preset will be disabled
      // so you could only use the pure CSS icons in addition to your
      // existing app without polluting other CSS 
      presets: [
        UnocssIcons({
          // options
          prefix: 'i-',
          extraProperties: {
            display: 'inline-block'
          }
        }),
        // presetUno() - if you want to use other atomic CSS as well
      ],
    }),
  ],
})
```

And that's it for today. Hope you enjoy this icons solution from UnoCSS, or get some inspiration from it for your own projects.

Thanks for reading, and see you :) 
