---
title: 为什么我不使用 Prettier
date: 2022-10-01T00:00:00Z
lang: zh
duration: 12min
description: 我不在我的项目中使用 Prettier 的理由。
---

[[toc]]

> 感谢 [AqingCyan](https://github.com/AqingCyan) 对本文进行翻译，英文原文: [English Version](/posts/why-not-prettier)。

我已经多次开始写这篇文章，但一直无法完成并发表它。我找不到合适的方式来表达我对 Prettier 的看法。但这一次，我想我应该尽力去表达清楚，以供将来作参考。

首先，我并不反对使用 Prettier。实际上，**我还挺喜欢它的**。

## 我喜欢 Prettier

[Prettier](https://prettier.io/) 是一个优秀的工具，它为我节省了很多时间。我很感激维护者和贡献者的努力使之成为可能，并为社区中整洁代码的样貌奠定了良好的风格基础。我不得不承认这篇文章多少有点标题党，我其实经常使用 Prettier 来制作交互式文档与 playground，例如 [VueUse](https://github.com/vueuse/vueuse/blob/c7dd1a48471d0a8b4f2b5a567baa12c24504eaee/scripts/utils.ts#L36-L46) 和 [UnoCSS](https://github.com/unocss/unocss/blob/7c332f235aff2045addb60c2668331a3ccfd1359/packages/inspector/client/composables/usePrettify.ts)。我喜欢它对大部分编程语言提供开箱即用的支持。我可以用不到5分钟的时间来集成 Prettier ，以生成漂亮的代码。

## 那为什么不用呢？

如果你曾经接触过我的开源项目，你或许会发现我很少使用 Prettier 来格式化源代码。在这篇文章中，我会尝试给出为什么我要这么做的理由：

### 它是固执己见的

Prettier 形容它自己是 ["一个固执己见的代码格式化工具"](https://github.com/prettier/prettier)。

**固执己见** (Opinionated) 意味着它并非是设计给所有人的。Prettier 做了很多硬性的风格决策来提供最小配置接口。这使得它非常易于使用（这很棒！）并且代码在跨项目之间能保持一致风格。然而，另一方面这也意味着你失去了对代码风格进行细粒度调整的能力。

虽然我喜欢 Prettier 提供的大部分决策，但当你遇到一些你不想要的决策又没有任何解决方法时，就还挺烦的。

### 代码换行带来困扰

最让我感到头疼的是基于代码长度的自动换行或合并行的功能。 Prettier 有一个名为 [`printWidth`](https://prettier.io/docs/en/options.html#print-width) 的概念，它限制每行适应固定的宽度（在默认设置里是80个字符）。通常情况下，让代码适合屏幕宽度，并避免水平滚动是一件很合理事情。

但是，我感觉到它经常损害了代码和 git diff 的可读性。

[@patak_dev](https://twitter.com/patak_dev) 最近在 PR 审查中举出了一个例子：

<Tweet>
<p lang="en" dir="ltr">Formatters are awesome, especially when doing PR reviews. They also introduce issues though, for example when an addition triggers a line break. The diff isn&#39;t showing what changed here. It would be great if diff viewers would be Prettier-aware, counting line breaks as spacing. <a href="https://t.co/ZuApmctllU">pic.twitter.com/ZuApmctllU</a></p>&mdash; patak (@patak_dev) <a href="https://twitter.com/patak_dev/status/1575784199767859200?ref_src=twsrc%5Etfw">September 30, 2022</a>
</Tweet>

> 格式化工具很棒，尤其是在 PR 审查时。但是它们也会带来一些问题，例如当添加内容时会触发换行。这里的 diff 并没有显示出改变了什么。如果 diff 查看器能够意识到 Prettier，将换行符视为间距，那就太棒了。

有些时候，当你在 JavaScript 中修改字符串内容时，可能会使该行字符数超过了 `printWidth` 设置的值，那么 Prettier 就会强制将其换行。它破坏了行与行之间展示出的差异并且使得代码难以审查。想象在另外一次 pull request 中，我们可能会将字符串缩短一点，然后 Prettier 又会强制将其合并回一行。来来回回之间，它造成了很多不必要的麻烦。

下图展示了另一个示例：

<a href="https://prettier.io/playground/#N4Igxg9gdgLgprEAuc0DOMAEBXNcBOamAvJgNoA6UmmwOe+AkgCZKYCMANPQVAIYBbOGwogAggBsAZgEs4mAMJ98QiTJh9RmAL6cqNOrgIs2AJm5H8-ISJABxGf0wAlCGgAWfKFt37aPJlZMAGYLBmthTFEAZXdsAHNMADk+ACNsHz1qf0sTTAAWMN5BSNFnPncBL0wAMXw+Bky-QwY8gFYiqxLbABU3d3kAGQBPbFSEJuyW4yCANk6I22iCeJkIZJkJCCllSYBdAG4qEE4QCAAHGDWoNGRQZXwIAHcABWUEW5Q+CSe+YdvTql6mAANZwGDREqDRxwZA7CR4QHAsEQ858MCOeLIGD4bBwU5wATjZjMODMQZeeLYPjxOA1CAqPgwK5QLFfbAwCAnEDuGACCQAdXc6jgaDRYDgyxu6hkADd1MNkOA0ACQI4GDAXvV4lU4d9ESAAFZoAAe0UxEjgAEVsBB4HqEfiQGjCAQlak0nAJNzzvhHDABTJmDB3Mh8uZnY88AL6uclb7RQRZbDTgBHW3wLUXT4gBoAWigcDJZO5+Dg6ZkZa1NN1SHhBrwAhk2NxTrQFutGdhdf1To0qUDwdDSAjOL4m0xCggAlrIFFbW5Rh6aU+9adsrxjCgpNg0TAfsuYm30Rgw0tDrw2m0QA" target="_blank">
<img src="/images/prettier-print-width.png" scale-110 block m="b--5!" />
</a>

<sup><em>`printWidth` 的值 42 是为了演示而设置的，但该情况会发生在任何 `printWidth` 下</em></sup>

左边是输入的代码，右边是 Prettier 格式化后的输出。不需要我特别指出，想必你应该有了"哪个看起来更漂亮"的答案。在我看来，Prettier 的规则太过严格了。事实上，它使代码更难以阅读和修改，违背了格式化代码的最初目标 - 使代码更具可读性。

真正的痛点是这种格式化行为不是可选的。 **你不能彻底禁用它**([#3468](https://github.com/prettier/prettier/issues/3468))。给 `printWidth` 设置一个大的值只能暂缓这种情况并且还会影响到你未曾打开过的别的文件。你唯一能做的就是使用 `// prettier-ignore`，但对我来说，这种 "全有或全无" 的选择失去了最初使用 Prettier 的意义。

### ESLint 之乱

Prettier 作为代码格式化程序，只关心代码风格而完全不关心逻辑。因此，我们常常能看到使用了 Prettier 的项目也使用 ESLint 来检查逻辑。但如果你曾经配置过它们的话，您可能会注意到它们之间有一些功能重叠 - ESLint 也可以 lint 代码风格。通常的做法是使用 [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) 来在 ESLint 中使用禁用这些重叠规则（以及[一些其他解决方案](https://prettier.io/docs/en/integrating-with-linters.html)）。

但是，这种方法也给我带来了很多麻烦：

<Tweet conversation="none">
<p lang="en" dir="ltr">My points here:<br><br>1. Prettier Only is cool - It&#39;s out-of-box.<br>2. If you need to use ESLint, it can do the formatting as good as Prettier - and more configurable</p>&mdash; Anthony Fu (@antfu7) <a href="https://twitter.com/antfu7/status/1279149211523538944?ref_src=twsrc%5Etfw">July 3, 2020</a>
</Tweet>

<Tweet conversation="none">
<p lang="en" dir="ltr">3. Prettier + ESLint still needs a lot of configs - It doesn&#39;t make your life easier.<br>4. You can have full control in ESLint but not in Prettier, mixing them together feels weird.<br>5. I don&#39;t think parsing two times can be faster (maybe I am wrong)</p>&mdash; Anthony Fu (@antfu7) <a href="https://twitter.com/antfu7/status/1279149212974776320?ref_src=twsrc%5Etfw">July 3, 2020</a>
</Tweet>

> 我的观点如下：
> 1. 只单纯使用 Prettier 十分合理 - 开箱即用是个很棒的功能
> 2. 如果你需要使用 ESLint，它也可以像 Prettier 一样格式化代码 - 而且更加可配置
> 3. Prettier + ESLint 仍然需要大量的配置 - 它并没有让你的生活变得更简单
> 4. 你可以在 ESLint 中完全控制代码风格，但在 Prettier 中却无法做到，这两者混合在一起感觉很奇怪
> 5. 我不认为 Parse 两次代码会更快

[ESLint 的自动修复](https://developer.ibm.com/articles/auto-fix-and-format-your-javascript-with-eslint/) 也可以像 Prettier 一样进行格式化 - 还有更自由的选择。

## 替代方案

在我的工作流中，ESLint 对确保代码质量来说不可或缺。如果 ESLint 已经能够进行代码格式化，那么对我来说最好的解决方案就是一次性都由它处理。

我花了一些时间配置我的 ESLint 并将其设置为预设配置：

<GitHubLink repo="antfu/eslint-config" name="@antfu/eslint-config" />

从结果来看，使用 ESLint 其实也可以非常简单：

```bash
npm i -D @antfu/eslint-config
```
```json
// .eslintrc
{
  "extends": "@antfu"
}
```

这样就可以了。配合 IDE 扩展，还可以在保存时触发自动修复。它的工作方式与 Prettier 类似，但当你要换行的时候尊重你的选择，并提供了许多 lint 的最佳实践。哦！当然，这是基于我自己的需求的另一种 “固执己见的” 配置，但或许它可以成为一份很好的参考，方便你创建属于你自己的配置。

## 结语

这篇文章只是试图解释我的个人经历和观点。当然，你可以持有不同的看法并且完全不需要同意我的看法。我并没有要责备 Prettier 的意思。不同的工具有不同的目标和侧重点，没有好坏之分。我们只是在讨论关于在合适的情况下如何使用合适的工具。在不需要很多定制化的时候，我仍然会是一个快乐的 Prettier 用户。但在管理我个人的开源项目源码时，我会选择只使用 ESLint。

希望这能够清楚地表达我的想法，也许希望能给你一些启发。干杯!
