---
title: 聊聊纯 CSS 图标
date: 2021-10-31T16:00:00Z
lang: zh
duration: 10min
description: 纯 CSS 中的图标解决方案
---

[[toc]]

> 感谢印记中文的 [QC-L](https://github.com/QC-L) 对本文进行翻译，英文原文: [English Version](/posts/icons-in-pure-css)。

在 [重新构想原子化 CSS](/posts/reimagine-atomic-css#pure-css-icons) 中，我提到了 [UnoCSS](https://github.com/antfu/unocss) 的一个预设，它提供了**在纯 CSS 中按需使用任何图标的能力**。在这篇文章中，我想和大家分享下它的工作原理。

## 我的图标探索之旅

如果你对我如何探索图标解决方案的过程感兴趣，下面这个博文列表，是我在图标探索过程中总结和相关实验

- 2020 年 8 月 - [图标探索之旅](/posts/journey-with-icons)
- 2021 年 9 月 - [图标探索之旅后续](/posts/journey-with-icons-continues)
- 2021 年 10 月 - [重新构想原子化 CSS](/posts/reimagine-atomic-css-zh)
- 2021 年 11 月 - 聊聊纯 CSS 图标 - *你在这里！*

## 现有方案

有个名为 [`css.gg`](https://github.com/astrit/css.gg) 的纯 CSS 图标解决方案，它完全通过伪元素（`::before`，`::after`）来构建图标。使用这种方案意味着你需要对 CSS 工作原理有深刻的理解，但同时也很难创造更为复杂的图标（只有3个元素可以使用）。我在寻找 **一种更加通用化的解决方案，可以适用于任何图标** 而并非在特定集合中进行有限的选择。

## 我的方案

这个方案来源于社区小伙伴 [@husayt](https://github.com/husayt) 在 `unplugin-icons` 中提出 [需求](https://github.com/antfu/unplugin-icons/issues/88) 并由 [@userquin](https://github.com/userquin) 在 [此 PR 中](https://github.com/antfu/unplugin-icons/pull/90) 提供了初版的实现。这个方案非常简单，用 [DataURI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 中的图标作为背景图，并生成如下 CSS。

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

有了这种方案，我们就可以使用一个单独的类在 CSS 中内嵌任何图像。

<div grid="~ cols-2">

```html
<div class="my-icon"></div> 
```

<div i-twemoji-grinning-face text-5xl my-auto mx-4 />
</div>

这个想法非常有趣，但是这更其实更像一张图片而非图标。对我而言，一个图标必须是可以根据上下文进行缩放和着色的。

## 实现

### DataURI

再次感谢 [Iconify](https://iconify.design/)，它将 100 多个图标集与上万个图标统一为 [一致的 JSON 格式](https://github.com/iconify/collections-json)。它允许我们通过简单地提供集合和图标 ID 的方式来获取任意图标集中的 SVG，使用方式如下：

```ts
import { iconToSVG, getIconData } from '@iconify/utils'

const svg = iconToSVG(getIconData('mdi', 'alarm'))
// (此处并非真实 API，仅供示意)
```

当我们得到 SVG 字符串后，可以将其转换为 DataURI：

```ts
const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
```

说到 DataURI，使用 [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) 几乎一直是我的默认选择 -- 直到我看到 Chris Coyier 所写的 [你可能不需要使用 Base64 SVG](https://css-tricks.com/probably-dont-base64-svg/) 文章。对于图像等二进制数据必须使用 Base64 进行编码，以便在 CSS 等纯文本文件中使用，而对于 SVG 来说，由于它已经是文本格式，所以使用 Base64 编码实际上会使得文件体积变得变大。

结合 Taylor Hunt 在 [优化 DataURI 中的 SVG](https://codepen.io/Tigt/post/optimizing-svgs-in-data-uris) 提到的相关技术，进一步对输出大小进行了改进，以下是我们的最终解决方案。

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

### 可缩放

使 ”图片“ 更像图标的第一步，我们需要让它可以根据上下文进行缩放。

幸运的是，CSS 为我们提供了原生的缩放支持 —— `em` 单位。

```css
.my-icon {
  background: url(data:...) no-repeat center;
  background-color: transparent;
  background-size: 100% 100%;
  height: 1em;
  width: 1em;
}
```

通过改变 `height` 和 `width` 为 `1em`，并设置 `background-size` 为 `100%`，我们可以使得图片的比例基于其父级元素的字体大小变化。

- <span text-sm>小 <span inline-block vertical-text-bottom i-ri-bike-line></span></span>
- <span text-base>中 <span inline-block vertical-text-bottom i-ri-bike-line></span></span>
- <span text-xl>大 <span inline-block vertical-text-bottom i-ri-bike-line></span></span>

### 可着色

在内联的 SVG 中，我们可以使用 [`fill="currentColor"`](https://www.w3.org/TR/css-color-3/#currentcolor) 来为 SVG 着色。但是，当我们将其作为背景图时，它就变成了一个图片。SVG 的动态性消失了，`currentColor` 的效果也随之消失（这和你无法覆盖 PNG 的颜色一样）。

如果你 Google 一下，你会发现大多数人都告诉你告诉你，这个就是个限制没有办法。少部分人会给你提供一个解决方案 -- 在转换为 DataURI 前在 SVG 中设置颜色，这可以解决对于特定图标着色的问题，但是没有从根本上解决上下文着色的问题。

此时，可能会有小伙伴想到使用 [CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)，就像 Una Kravets 在 [使用 CSS 给 SVG 背景上色](https://css-tricks.com/solved-with-css-colorizing-svg-backgrounds/) 一文中提到的那样。听起来还不错，也许引入一些运行时的 JavaScript 去计算如何将颜色转化为最终所需的颜色矩阵便可以做到。但这就违背了我们在探索纯 CSS 中图标的目的。

在我快要放弃这个方案时，我无意中发现了 Noah Blon 的 [在 CSS 背景图片中为 SVGs 上色](https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images)。文中提到了一个非常绝妙的主意，通过使用 [CSS masks](https://developer.mozilla.org/en-US/docs/Web/CSS/mask) 对背景进行蒙版 - 一个从未听说过 CSS 属性。

```css
.my-icon {
  background-color: red;
  mask-image: url(icon.svg);
}
```

与其想办法给背景图片着色，不如换种思路，把图标作为一个蒙版，来对背景的颜色进行裁剪。这样做，我们还可以使用 `currentColor` 为其着色！

```css
.my-icon {
  background-color: currentColor;
  mask-image: url(icon.svg);
}
```

<div pt-4 />
<div text-sky text-xl>蓝色的文字和蓝色的图标 <div i-uil-cloud-showers-heavy /><div i-uil:wind /></div>
<div text-lime text-xl>绿色 <div i-uil:trees /><div i-uil:desert /></div>
<div text-orange text-xl>橙色 <div i-uil:restaurant /><div i-uil:store-alt /></div>

### 彩色图标

我们把单色的图标做成了可着色的，但又遇到了新的问题。当使用 mask 时，图标的颜色和内容会丢失。例如：

<div text-4xl inline-flex gap-2 py-4 px-8 bg-gray-400:15 rounded>
<div text-base my-auto>图标：</div>
<div i-twemoji:astonished-face />

<div text-base my-auto ml-4>蒙版：</div>
<div i-ph:circle-fill style="transform: scale(1.3)" />
</div>

我想，很多时候可能很难通过一种方案来解决所有问题。

但是，其实我们可以使用**两种方案**！还记得我们最开始提到了将图像作为背景图片的方案吗？这个不正适用于彩色图标 -- 毕竟使用彩色图标时，我们也不需要修改它的颜色。

解决方案其实很简单，我们只需找到一种方法来巧妙地区分单色图标和彩色图标。既然我们可以得到 SVG 的内容，我们便可以使用如下方法：

```ts
// 如果 SVG 的图标包含 `currentColor` 的值
// 它大概率是一个单色图标
const mode = svg.includes('currentColor')
  ? 'mask'
  : 'background-img'

const uri = `url("data:image/svg+xml;utf8,${encodeSvg(svg)}")`

// 单色图标
if (mode === 'mask') {
  return {
    'mask': `${uri} no-repeat`,
    'mask-size': '100% 100%',
    'background-color': 'currentColor',
    'height': '1em',
    'width': '1em',
  }
}
// 彩色图标
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

而且最终效果出乎意料的完美！它的效果其实和我们日常接触到的一个工具非常相似 - 系统的原生 Emoji。文本颜色会根据上下文而发生变化，而 Emoji 则保持自己的颜色。

最终效果展示：

<div text-xl all:mx-1 all:my-2 all:vertical-middle>

<span op60 text-sm inline-block w-40 text-right>Material Design</span> <div i-ic:baseline-account-circle /> <div i-ic:baseline-card-membership /> <div i-ic:baseline-verified text-green5 /> <div i-ic:outline-explore text-sky5 />
<br><span op60 text-sm inline-block w-40 text-right>Carbon</span> <div i-carbon:chart-multitype /> <div i-carbon:network-4 /> <div i-carbon:wind-gusts /> <div i-carbon:collaborate />
<br><span op60 text-sm inline-block w-40 text-right>Tabler</span> <div i-tabler:building-carousel /> <div i-tabler:circle-square /> <div i-tabler:color-swatch /> <div i-tabler:cut />
<br><span op60 text-sm inline-block w-40 text-right>Twemoji</span> <div i-twemoji:grinning-face-with-smiling-eyes /> <div i-twemoji:face-in-clouds /> <div i-twemoji:weary-cat /> <div i-twemoji:teacup-without-handle />
<br><span op60 text-sm inline-block w-40 text-right>Logos</span> <div i-logos:vue /> <div i-logos:blender /> <div i-logos:chrome /> <div i-logos:codepen-icon />

</div>

如果想要查看或者搜索所有可用的图标，可以参考我的另一个开源项目 [Icônes](https://icones.js.org/)。

## 使用

如果你想在项目中尝试这个图标解决方案，你可以安装 [UnoCSS](https://github.com/antfu/unocss) 和图标预设：

```bash
npm i -D unocss @unocss/preset-icons @iconify/json
```

`@iconify/json` 包含了所有 Iconify 收录的图标集（120MB 左右）。或者，你也可以按图标集的方式进行安装以节省流量和储存空间，例如，需使用 Material Design 的图标，你可以安装 `@iconify-json/mdi`，使用 Carbon 的图标，你可以安装 `@iconify-json/carbon` 等。

接着配置你的 `vite.config.js`：

```ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss'
import UnocssIcons from '@unocss/preset-icons'

export default defineConfig({
  plugins: [
    UnoCSS({
      // 但 `presets` 被指定时，默认的预设将会被禁用，
      // 因此你可以在你原有的 App 上使用纯 CSS 图标而不需要担心 CSS 冲突的问题。
      presets: [
        UnocssIcons({
          // 其他选项
          prefix: 'i-',
          extraProperties: {
            display: 'inline-block'
          }
        }),
        // presetUno() - 取消注释以启用默认的预设
      ],
    }),
  ],
})
```

这就是今天的全部内容了。希望你能喜欢这个来自 UnoCSS 的图标解决方案，或者能为你提供灵感，用于你自己的项目。

感谢阅读，下次见 :)
