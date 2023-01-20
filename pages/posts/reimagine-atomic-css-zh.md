---
title: 重新构想原子化 CSS
date: 2021-10-26T16:00:00Z
lang: zh
duration: 25min
description: 打破常规，重新思考原子化 CSS 的最优解。
---

[[toc]]

> 感谢印记中文的 [QC-L](https://github.com/QC-L) 对本文进行翻译，英文原文: [English Version](/posts/reimagine-atomic-css)。

> 本文会比往期文章相对长些。这是我个人的一个重大的工具发布，有许多内容我想谈论。如果你能花些时间读完，不胜感激。若你在电脑端阅读，可在右侧查看目录。最后，希望能对你有所帮助 :)

## 什么是原子化 CSS?

首先，让我们为 **原子化 CSS** (Atomic CSS) 给出适当的定义：

John Polacek 在 [文章 Let’s Define Exactly What Atomic CSS is](https://css-tricks.com/lets-define-exactly-atomic-css/) 中写道：

> Atomic CSS is the approach to CSS architecture that favors small, single-purpose classes with names based on visual function.

译文：

> 原子化 CSS 是一种 CSS 的架构方式，它倾向于小巧且用途单一的 class，并且会以视觉效果进行命名。

有些人可能会称其为函数式 CSS，或者 CSS 实用工具。本质上，你可以将原子化的 CSS 框架理解为这类 CSS 的统称：

```css
.m-0 {
  margin: 0;
}
.text-red {
  color: red;
}
/* ... */
```

市面上有不少实用至上的 CSS 框架，如 [Tailwind CSS](https://tailwindcss.com/)，[Windi CSS](https://cn.windicss.org/) 以及 [Tachyons](https://tachyons.io/) 等。

同时有些 UI 库也会附带一些 CSS 工具类作为框架的补充，如 [Bootstrap](https://getbootstrap.com/docs/5.1/utilities/api/) 和 [Chakra UI](https://chakra-ui.com/docs/features/style-props)。

这篇文章并不打算和你讨论使用原子化 CSS 的优缺点，相信你己经在各种地方听到了许多讨论。今天我们将从框架作者的角度来聊聊如何权衡设计以构建出那些你喜欢的框架，它们的局限性，以及如何能将它们做得更好以使得我们的日常工作受惠。

## 背景

在正式开始前，先来聊聊背景。如果你还不认识我，我叫 Anthony Fu，是 [Vite](https://vitejs.dev/) 团队的成员，也是 [Vitesse](https://github.com/antfu/vitesse) (Vite 社区最受欢迎的起手模板之一) 的作者。我享受原子化 CSS 带来的快速开发体验，而因此选择了 [Tailwind CSS](https://tailwindcss.com/) 作为 Vitesse 的默认 UI 框架。虽然 Vite 较 Webpack 等工具相比，在加载速度上有了大幅提升，但由于 Tailwind 生成了数 MB 的 CSS，使得加载与更新 CSS 成为了整个 Vite 应用的性能瓶颈。我曾以为这是使用为了原子式 CSS 的一种权衡，直到我发现了 [Windi CSS](https://cn.windicss.org)。

<img src="/images/discover-windicss-zh.png" class="transform scale-110 py-2"/>

[Windi CSS](https://cn.windicss.org) 是从零开始编写的 Tailwind CSS 的替代方案。它的零依赖，也不要求用户安装 PostCSS 和 Autoprefixer。更为重要的是，它支持 **按需生成**。Windi CSS 不会一次生成所有的 CSS，而是只会生成你在代码中实际使用到的原子化 CSS。这与 Vite 按需使用的理念不谋而合，也因此，我为它编写了 [一个 Vite 插件](https://github.com/windicss/vite-plugin-windicss)。不出所料，从一个简单的测试上可以看到它比 Tailwind 要快了 [20~100 倍](https://twitter.com/antfu7/status/1361398324587163648)。

项目进展相当顺利，Windi CSS 也快速成长为一个团队，我们也引入了许多创新，如 [自动值推导](https://cn.windicss.org/features/value-auto-infer.html)，[可变修饰组](https://windicss.org/features/variant-groups.html)，[Shortcuts](https://windicss.org/features/shortcuts.html)，[在 DevTools 中进行设计](https://twitter.com/antfu7/status/1372244287975387145)，[属性化模式](https://twitter.com/windi_css/status/1387460661135896577) 等。作为结果，Tailwind 也 [因此](https://twitter.com/adamwathan/status/1371542711086559237?s=20) 使用了同样的技术并推出了自己的 [JIT 按需引擎](https://tailwindcss.com/docs/just-in-time-mode)。

## 剖析原子化 CSS

在文章开始前，我们来聊聊原子化 CSS 的工作原理。

### 传统方案

制作原子化 CSS 的传统方案其实就是提供所有你可能需要用到的 CSS 工具。例如，你可能会用预处理器（这里选用的是 SCSS）生成如下代码：

```scss
// style.scss

@for $i from 1 through 10 {
  .m-#{$i} {
    margin: $i / 4 rem;
  }
}
```

编译结果为：

```css
.m-1 { margin: 0.25 rem; }
.m-2 { margin: 0.5 rem; }
/* ... */
.m-10 { margin: 2.5 rem; }
```

现在你可以直接使用 `class="m-1"` 来设置边距。但正如你所见，用这种方法的情况下，你不能使用除了 1 到 10 之外的边距，而且，即使你只使用了其中一条 CSS 规则，但还是要为其余几条规则的文件体积买单。如果之后你还想支持不同的 margin 方向，使用比如 `mt` 代表 `margin-top`，`mb` 代表 `margin-bottom` 等，加上这 4 个方向以后，你的 CSS 大小会变成原来的 5 倍。如果再有使用到像 `:hover` 和 `:focus` 这样的伪类时，体积还会得更变大。以此类推，每多加一个工具类，往往意味着你 CSS 文件的大小也会随之增加。这也就是为什么传统的 Tailwind 生成的 CSS 文件会有数 MB 的大小。

为了解决这个问题，Tailwind 通过使用 [PurgeCSS](https://purgecss.com/) 来扫描你的大包产物并删除你不需要的规则。这得以使其在生产环境中 CSS 文件缩减为几 KB。然而，请注意，这个清除操作仅在生成构建下有效，而开发环境下仍要使用包含了所有规则巨大的 CSS 文件。这在 Webpack 中表现可能并不明显，但在 Vite 中却有着巨大的影响，毕竟其他内容的加载都非常迅捷。

既然生成再清除的方法存在局限性，那是否有更好的解决方案？

### 按需生成

"按需生成" 的想法引入了一种全新的思维方式。让我们先来对比下这些方案：

<img src="/images/unocss-traditional-way-zh.png" class="filter dark:invert" />

传统的方式不仅会消耗不必要的资源（生成了但未使用），甚至有时更是无法满足你的需求，因为总会有部分需求无法包含在内。

<img src="/images/unocss-on-demand-way-zh.png" class="filter dark:invert" />

通过调换 "生成" 和 "扫描" 的顺序，"按需" 会为你节省浪费的计算开销和传输成本，同时可以灵活地实现预生成无法实现的动态需求。另外，这种方法可以同时在开发和生产中使用，提供了一致的开发体验，使得 HMR (Hot Module Replacement, 热更新) 更加高效。

为了实现这一点，Windi CSS 和 Tailwind JIT 都采用了预先扫描源代码的方式。下面是一个简单示例：

```ts
import { promises as fs } from 'fs'
import glob from 'fast-glob'

// 通常这个是可以配置的
const include = ['src/**/*.{jsx,tsx,vue,html}']

async function scan() {
  const files = await glob(include)

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    // 将文件内容传递给生成器并配对 class 的使用情况
  }
}

await scan()
// 扫描会在构建/服务器启动前完成
await buildOrStartDevServer()
```

为了在开发期间提供 HMR，通常会启动一个 [文件系统监听器](https://github.com/paulmillr/chokidar)：

```ts
import chokidar from 'chokidar'

chokidar.watch(include).on('change', (event, path) => {
  // 重新读取文件
  const content = await fs.readFile(file, 'utf8')
  // 将新的内容重新传递给生成器
  // 清除 CSS 模块的缓存并触发 HMR 事件
})
```

因此，通过按需生成方式，Windi CSS 获得了比传统的 Tailwind CSS [快 100 倍左右](https://twitter.com/antfu7/status/1361398324587163648) 的性能。

## 痛痒

我现在在我几乎所有的应用中都在使用 Windi CSS，而且效果显著，性能优异，HMR 瞬间完成几乎无法察觉。[自动值推导](https://cn.windicss.org/features/value-auto-infer.html) 和 [属性化模式](https://twitter.com/windi_css/status/1387460661135896577) 更是提升了我的开发体验。到这里，我本该可以睡上一个好觉去想想其他事情了，但是有时候，它还是会瘙你痒痒打扰你的美梦。

我发现最令人讨厌的是，和很多时候我不清楚我得到的结果是什么，以及怎么样做才能让它生效。对我而言，最好最理想的原子化 CSS 应该是直觉性的。一旦学会，它应该非常直观易懂，并且可以推导出其他已知情况。如果你知道 `mt-1` 是上边距的一倍单位，你就会直觉地认为 `mb-2` 是下边距的两倍单位。当它正常工作时，是直觉使然，但当它不起作用时，会令人沮丧和困惑。

例如，我们知道 Tailwind 中的 `border-2` 标识边框宽度为 `2px`，`4` 表示 `4px`，`6` 表示 `6px`，`8` 表示 `8px`，但当你使用 `border-10` **却不起作用**（你甚至需要一些时间来发现这件事！）。你可能会说这是故意而为之，以使得设计系统具有一致性。不如这样，我们来做个小测验，**如果想要让 `border-10` 正常工作，应该如何做？**

在你的全局样式中的某个位置添加这样一个工具类？

```css
.border-10 {
  border-width: 10px;
}
```

快速且直观，最重要的是，它的确解决了你的需求。但是，如果什么都需要我自己手动添加，那我们为什么还需要使用 Tailwind ？

如果你对 Tailwind 了解深入一些，那你可能知道它可以进行额外配置。所以你需要花 5 分钟，检索他们的文档。你将得到[如下方案](https://tailwindcss.com/docs/border-width#border-widths)：

```js
// tailwind.config.js
module.exports = {
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px' // <-- here
    }
  }
}
```

这似乎很合理，我可以把我需要的情况都列出来，回去继续工作了...等一下，我刚刚进行到哪里了？因为这样一个工具的丢失而被打断，除了配置，我们还会需要时间重新找回原本正在进行的工作的上下文。接着，如果我想设置边框颜色，我还需要查询文档，然后如何进行配置。也许有人喜欢这样的工作流程，但这并不适合我，我并不享受被本该直觉性工作的工具打断的我的工作流程。

Windi CSS 对规则相对宽松一些，会尽可能地根据你使用的 class 提供相应的实用工具类。在这种情况下，`border-10` 在 Windi 中可以做到开箱即用。但是，由于 Windi 需要与 Tailwind 兼容，它还必须使用与 Tailwind 完全相同的配置项。尽管数字推断的问题得到了解决，但如果你想添加一些自定义的工具，这将是一场噩梦。下面是一个来自 [Tailwind 文档](https://tailwindcss.com/docs/plugins#escaping-class-names) 的示例：

```ts
// tailwind.config.js
const _ = require('lodash')
const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    rotate: {
      '1/4': '90deg',
      '1/2': '180deg',
      '3/4': '270deg',
    }
  },
  plugins: [
    plugin(({ addUtilities, theme, e }) => {
      const rotateUtilities = _.map(theme('rotate'), (value, key) => {
        return {
          [`.${e(`rotate-${key}`)}`]: {
            transform: `rotate(${value})`
          }
        }
      })

      addUtilities(rotateUtilities)
    })
  ]
}
```

将生成如下代码：

```css
.rotate-1\/4 {
  transform: rotate(90deg);
}
.rotate-1\/2 {
  transform: rotate(180deg);
}
.rotate-3\/4 {
  transform: rotate(270deg);
}
```

生成 CSS 的代码甚至比结果还要长。并且难以阅读和维护，同时，它破坏了按需应变的能力。

Tailwind 的 API 和插件系统沿用了旧的思维方式进行设计，并不能适应新的按需方式。其核心工具是在生成器中锻造出来的，而且其定制化功能相当有限。因此，我开始思考，如果我们可以放弃这些历史包袱，并以随需应变思想重新设计它，我们可以得到什么？

## 向你介绍 UnoCSS

[**UnoCSS**](https://github.com/antfu/unocss) - 具有高性能且极具灵活性的即时原子化 CSS 引擎。

该项目诞生于我在国庆期间的做的一些随机实验。从使用者的角度出发去探索灵活性和直观性的最佳平衡，加上按需生成的思想，这些实验的最终结果在不少方面甚至超出了我的预期。接下来让我为你逐一介绍：

### 引擎

UnoCSS 是一个**引擎**，而非一款**框架**，因为它**并未提供核心工具类**，所有功能可以通过预设和内联配置提供。

我们设想 UnoCSS 能够通过预设模拟大多数已有原子化 CSS 框架的功能。也有可能会被用作创建一些新的原子化 CSS 框架的引擎。例如：

```ts
import UnocssPlugin from '@unocss/vite'

// 以下预设目前还不存在，
// 欢迎大家踊跃贡献！
import PresetTachyons from '@unocss/preset-tachyons'
import PresetBootstrap from '@unocss/preset-bootstrap'
import PresetTailwind from '@unocss/preset-tailwind'
import PresetWindi from '@unocss/preset-windi'
import PresetAntfu from '@antfu/oh-my-cool-unocss-preset'

export default {
  plugins: [
    UnocssPlugin({
      presets: [
        // PresetTachyons,
        PresetBootstrap,
        // PresetTailwind,
        // PresetWindi,
        // PresetAntfu

        // 选择其中一个...或多个！
      ]
    })
  ]
}
```

让我们来看看如何使它们成为可能：

### 直观且完全可定制

UnoCSS 的主要目标是直观性和可定制性。它可以让你在数十秒内，定义你自己的 CSS 工具。

###### 静态规则

原子化 CSS 可能数量相当庞大。因此，规则定义直接了当对于阅读和维护非常重要。如需为 UnoCSS 创建一个自定义规则，你可以这样写：

```ts
rules: [
  ['m-1', { margin: '0.25rem' }]
]
```

当在用户代码库中检测到 `m-1` 时，就会生成如下 CSS：

```css
.m-1 { margin: 0.25rem; }
```

###### 动态规则

想要使其动态化，可以将匹配器修改为正则表达式，将主体改为一个函数：

```ts
rules: [
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
  [/^p-(\d+)$/, match => ({ padding: `${match[1] / 4}rem` })],
]
```

其中，回调函数的第一个参数为匹配结果，所以你可以对它进行解构以获得正则表达式的匹配组。

例如，当你使用：

```html
<div class="m-100">
  <button class="m-3">
    <icon class="p-5" />
    My Button
  </button>
</div>
```

就会生成相应的 CSS：

```css
.m-100 { margin: 25rem; }
.m-3 { margin: 0.75rem; }
.p-5 { padding: 1.25rem; }
```

这样就行了。而现在，你只需要使用相同的模式添加更多的实用工具类，你就拥有了属于自己的原子化 CSS！

### 可变修饰

[可变修饰 (Variants)](https://cn.windicss.org/utilities/variants.html#variants) 在 UnoCSS 中也是简单且强大的。这里有几个示例：

```ts
variants: [
  // 支持所有规则的 `hover:`
  {
    match: s => s.startsWith('hover:') ? s.slice(6) : null,
    selector: s => `${s}:hover`,
  },
  // 支持 `!` 前缀，使规则优先级更高
  {
    match: s => s.startsWith('!') ? s.slice(1) : null,
    rewrite: (entries) => {
      // 在所有 CSS 值中添加 ` !important`
      entries.forEach(e => e[1] += ' !important')
      return entries
    },
  }
],
```

你可以参考 [文档](https://github.com/antfu/unocss#custom-variants) 了解更多细节。

### 预设

你可以将自己的自定义规则和可变修饰打包成预设，与他人分享，或是使用 UnoCSS 作为引擎创建你自己的原子化 CSS 框架！

同时，我们在发布时也提供了 [一些预设](https://github.com/antfu/unocss#presets) 供你快速上手。

值得一提的是，默认的 [`@unocss/preset-uno`](https://github.com/antfu/unocss/tree/main/packages/preset-uno) 预设（**实验阶段**）是一系列流行的原子化框架的 **通用超集**，包括了 Tailwind CSS，Windi CSS，Bootstrap，Tachyons 等。

例如，`ml-3`（Tailwind），`ms-2`（Bootstrap），`ma4`（Tachyons），`mt-10px`（Windi CSS）均会生效。

```css
.ma4 { margin: 1rem; }
.ml-3 { margin-left: 0.75rem; }
.ms-2 { margin-inline-start: 0.5rem; }
.mt-10px { margin-top: 10px; }
```

[了解更多关于默认预设的信息](https://github.com/antfu/unocss/tree/main/packages/preset-uno)。

### 灵活性

截止目前为止，我们都在向你展示如何使用 UnoCSS 来模仿 Tailwind 和其他原子化框架的行为，即便 UnoCSS 让这件事变得十分容易，但仅此一点可能也不会在最终使用者的方面产生太大影响。

一起来见识下 UnoCSS 真正的威力：

###### 属性化模式

[属性化模式 (Attributify Mode)](https://windicss.org/posts/v30.html#attributify-mode) 是 Windi CSS 最受欢迎的特性之一。它能帮助你通过使用属性更好地组织和分组你的实用工具类。

它会把你的冗长的 Tailwind 代码（难以阅读与编辑）：

```html
<button class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600">
  Button
</button>
```

变成：

```html
<button 
  bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  border="2 rounded blue-200"
>
  Button
</button>
```

在更好的按类型进行组织的同时，也节省了重复输入相同前缀的时间。

在 UnoCSS 中，我们也实现了属性化模式，只使用 [**一个可变修饰**](https://github.com/antfu/unocss/blob/main/packages/preset-attributify/src/variant.ts) 和 [**一个提取器**](https://github.com/antfu/unocss/blob/main/packages/preset-attributify/src/extractor.ts)，总共 **代码行数不超过 100**！更重要的是，它直接适用于你自定义的任何规则！

除了 Windi CSS 的属性化模式，仅需改动几行代码，我们还实现了无值的属性的支持：

```html
<div class="m-2 rounded text-teal-400" />
```

现在变为：

```html
<div m-2 rounded text-teal-400 />
```

整个属性化模式是通过 [`@unocss/preset-attributify`](https://github.com/antfu/unocss/blob/main/packages/preset-attributify) 预设提供的，详细的使用方法请参考其文档。

###### 纯 CSS 图标

如果你读过我之前的文章 [Journey with Icons Continues](/posts/journey-with-icons-continues)，你一定知道我对图标非常热衷，并且在积极研究图标的各种解决方案。这次，凭借 UnoCSS 的灵活性，我们甚至可以拥有纯 CSS 的图标。你没看错，**它是纯 CSS 的图标，不需要任何 JavaScript**！让我们来看看它长什么样子：

```html
<!-- A basic anchor icon from Phosphor icons -->
<div class="i-ph-anchor-simple-thin" />
<!-- An orange alarm from Material Design Icons -->
<div class="i-mdi-alarm text-orange-400 hover:text-teal-400" />
<!-- A large Vue logo -->
<div class="i-logos-vue text-3xl" />
<!-- Sun in light mode, Moon in dark mode, from Carbon -->
<button class="i-carbon-sun dark:i-carbon-moon" />
<!-- Twemoji of laugh, turns to tear on hovering -->
<div class="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" />
```

<div flex gap-2 text-4xl p-2 mt4>
  <!-- A basic anchor icon from Phosphor icons -->
  <div class="i-ph-anchor-simple-thin" />
  <!-- An orange alarm from Material Design Icons -->
  <div class="i-mdi-alarm text-orange-400 hover:text-teal-400" />
  <!-- A large Vue logo -->
  <div class="i-logos-vue transform transition-800 hover:rotate-180" />
  <!-- Sun in light mode, Moon in dark mode, from Carbon -->
  <button class="i-carbon-sun dark:i-carbon-moon" @click="toggleDark()"/>
  <!-- Twemoji of laugh, turns to tear on hovering -->
  <div class="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" /> 
  <div text-base my-auto flex><div i-carbon-arrow-left my-auto mr-1 /> 悬停在它上面</div>
</div>

<script setup>
import { isDark } from '~/logics'

function toggleDark() {
  isDark.value = !isDark.value
}
</script>

与可变修饰结合，你甚至可以根据悬停状态或颜色模式来切换图标。得益于 [Iconify](https://iconify.design/) 项目，你可以从一百余个热门图标集合（Material Design Icons， Ant Design Icons 等等）中获得 **超过一万个图标** 供你按需使用。

同样的，这个功能的实现代码并未超过 100 行。具体请参考 [`@unocss/preset-icons`](https://github.com/antfu/unocss/blob/main/packages/preset-icons) 预设的实现了解其中的魔法。

希望这些预设可以让你对 UnoCSS 的灵活性有一个大致的了解。它还处于一个非常早期的阶段，有很多可能性等待我们去探索。

### CSS 作用域

在使用 Tailwind / Windi 时，我遇到的另一个问题就是 [样式预检 (Preflight)](https://tailwindcss.com/docs/preflight)。预检功能重置了原生元素，并为 CSS 变量提供了一些兜底方案，在开发一个只使用 Tailwind/Windi 的新应用时，效果很棒。但当你想让它们与其他 UI 框架一起工作，或者使用 Tailwind 编写一些共享组件时，预检往往会引入许多冲突，破坏你现有的 UI。

因此，UnoCSS 采取了另一个霸气的操作，**不支持预检**。相反，它将 CSS 重置的控制权完全留给了用户 (或 UnoCSS 上层框架)，让他们使用适合自己的方案 - Normalize.css，Reset.css 或者 UI 框架自带的CSS 重置等。

这也使得 UnoCSS 在 CSS 作用域上有了更多可能性。例如，我们在 Vite 插件上有一个实验性的 `scoped-vue` 模式，可以为每个组件生成作用域样式，你可以安全地使用原子化 CSS 作为组件库，而无需担心与用户的 CSS 发生冲突。比如：

```html
<template>
  <div class="m-2 rounded"><slot></div>
<template>

<!-- 以下内容将被注入 bundler 中 -->
<style scoped>
.m-2{margin:0.5rem;}
.rounded{border-radius:0.25rem;}
</style>
```

我们还在尝试更多的可能性，比如支持 Web Component，MPA 情况下的 CSS 代码分割，以及模块级别的 CSS 作用域等。

## 性能

考虑到 UnoCSS 带来的灵活性和想象力，坦率地说，我认为性能可能不是那么重要的事情。出于好奇，我写了一个 [简单的 benchmark](https://github.com/antfu/unocss/tree/main/bench) 来比较性能。结果令人惊讶：

```yaml
10/21/2021, 2:17:45 PM
1656 utilities | x50 runs

none                            8.75 ms /    0.00 ms
unocss       v0.0.0            13.72 ms /    4.97 ms (x1.00)
windicss     v3.1.9           980.41 ms /  971.66 ms (x195.36)
tailwindcss  v3.0.0-alpha.1  1258.54 ms / 1249.79 ms (x251.28)
```

从结果来看，UnoCSS 可以比 **Tailwind 的 JIT 引擎快 200 倍**！说实话，在按需生成的情况下，Windi 和 Tailwind JIT 都已经算是超快了，UnoCSS 的性能提升感知度可能没有那么高。然而，几乎为零的开销意味着你可以将 UnoCSS 整合到你现有的项目中，作为一个增量解决方案与其他框架一同协作，而不需要担心性能损耗。

在开发时，UnoCSS 做了很多性能上的优化。如果你感兴趣，可以参考：

### 跳过解析，不使用 AST

从内部实现上看，Tailwind 依赖于 PostCSS 的 AST 进行修改，而 Windi 则是编写了一个自定义解析器和 AST。考虑到在开发过程中，这些工具 CSS 的并不经常变化，UnoCSS 通过非常高效的字符串拼接来直接生成对应的 CSS 而非引入整个编译过程。同时，UnoCSS 对类名和生成的 CSS 字符串进行了缓存，当再次遇到相同的实用工具类时，它可以绕过整个匹配和生成的过程。

### 单次迭代

正如前文所述，Windi CSS 和 Tailwind JIT 都依赖于对文件系统的预扫描，并使用文件系统监听器来实现 HMR。文件 I/O 不可避免地会引入开销，而你的构建工具实际上需要再次加载它们。那么我们为什么不直接利用已经被工具读取过的内容呢？

除了独立的生成器核心以外，UnoCSS 有意只提供了 Vite 插件（以后可能考虑其他的集成），这使得它能够专注于与 Vite 的最佳集成。

在 Vite 中，`transform` 的钩子将与所有的文件及其内容一起被迭代。因此，我们可以写一个插件来收集它们，比如：

```ts
export default {
  plugins: [
    {
      name: 'unocss',
      transform(code, id) {
        // 过滤掉无需扫描的文件
        if (!filter(id))
          return

        // 扫描代码（同时也可以处理开发中的无效内容）
        scan(code, id)

        // 我们只需要内容，所以不需要对代码进行转换
        return null
      },
      resolveId(id) {
        return id === VIRTUAL_CSS_ID ? id : null
      },
      async load(id) {
        // 生成的 css 会作为一个虚拟模块供后续使用
        if (id === VIRTUAL_CSS_ID)
          return { code: await generate() }

      }
    }
  ]
}
```

由于 Vite 也会处理 HMR，并在文件变化时再次执行 `transform` 钩子，这使得 UnoCSS 可以在一次加载中就完成所有的工作，没有重复的文件 I/O 和文件系统监听器。此外，通过这种方式，扫描会依赖于模块图而非文件 glob。这意味着只有构建在你应用程序中的模块才会影响生成的 CSS，而并非你文件夹下的任何文件。

我们还做了一些小技巧来提高性能。我可能会在以后再写一篇关于它们的文章，但在此之前，你可以通过阅读代码来弄清它们 :)

## 现在能用吗？

简而言之：可以，但有注意事项。

UnoCSS 仍处于实验阶段，但由于其精简的设计，生成的结果已经非常可靠了。需要注意的一点是，API 还没有最终定案，虽然我们会遵循 semver 的进行版本发布，但是还请为破坏性改动做好准备。

注意：它并非被设计成 Windi CSS 或 Tailwind 的替代品（考虑等待 Windi CSS v4）。我们不建议将现有项目完全迁移到 UnoCSS。你可以在新的项目中试用它，或者将它作为你现有 CSS 框架的补充（例如，禁用默认预设，只使用纯 CSS 图标的预设，或者自定义你的规则）。

顺便说一句，目前 [你正在阅读的网站](https://github.com/antfu/antfu.me) 就构建于 UnoCSS 之上，供你参考 :P。

同时，欢迎分享你正在制作的预设或帮助我们贡献默认的预设。期待看到你能够蹦出什么新想法！

## 结束语

非常感谢你的阅读！如果你对它感兴趣，请记得查看 [`antfu/unocss`](https://github.com/antfu/unocss) 仓库以了解更多细节，也可以通过 [**在线 Playground**](https://unocss.antfu.me/) 进行尝试。

欢迎评论或转发 [此推文](https://twitter.com/antfu7/status/1452802545118711812)，让我知道你的想法！🙌
