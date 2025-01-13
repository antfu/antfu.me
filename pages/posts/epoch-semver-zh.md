---
title: Epoch SemVer 版本控制规范
date: 2025-01-07T12:00:00.000+00:00
lang: zh
duration: 8min
description: 提出一个扩展的语义化版本控制规范 Epoch SemVer，为用户提供更细粒度的版本信息。
---

> [English Version](/posts/epoch-semver)

如果你一直关注我的开源工作，你可能注意到我倾向于使用 0 作为主版本号，比如 `v0.x.x`。例如，在写这篇文章时，UnoCSS 的最新版本是 [`v0.65.3`](https://github.com/unocss/unocss/releases/tag/v0.65.3)， Slidev 是 [`v0.50.0`](https://github.com/slidevjs/slidev/releases/tag/v0.50.0)， 而 `unplugin-vue-components` 是 [`v0.28.0`](https://github.com/unplugin/unplugin-vue-components/releases/tag/v0.28.0)。其他项目， 如 React Native 现在是 [`v0.76.5`](https://github.com/facebook/react-native/releases/tag/v0.76.5)， sharp 是 [`v0.33.5`](https://github.com/lovell/sharp/releases/tag/v0.33.5)， 也遵循这种模式。

人们经通常认为 0 作为主版本号表示软件还没有完善且无适合用于生产环境。然而， 以上提到的所有项目都相当稳定， 且被数百万个项目使用。

**为什么?** - 我猜现在你有这样的疑问。

## 版本号定义

版本号是代码库的快照，帮助我们有效理解软件的变化。例如，我们可以这样说："某个功能在 v1.3.2 中能够运行，但在 v1.3.3 中不行，可能会在后续支持。"这使得维护者更容易通过比较这些版本之间的差异来定位错误。一个版本本质上是一个标记，一个代码库在特定时间点的印记。

然而，代码是复杂的，每个改动都涉及权衡。即使用自然语言来描述一个代码改动就很困难了。仅凭版本号是无法描述发布中的所有细微差别。这就是为什么我们需要更新日志、发布说明和提交信息来提供更多上下文。

我将版本控制视为与用户沟通变更的一种方式 - 一份库维护者和用户之间的**约定**，以确保升级过程中的兼容性和稳定性。作为用户，如果不查看更新日志，你无法仅通过版本号知道 `v2.3.4` 和 `v2.3.5` 之间具体发生了什么变化。但通过查看这些数字，你可以推断这是一个修复bug的补丁版本，**应该**可以安全升级。之所以能够仅通过查看版本号就理解变更，是因为库维护者和用户都认同这种版本控制方案。

由于版本控制只是一种约定，且每个项目可能有不同的解释，你不应该盲目相信它。它可以作为一个依据，帮助你决定何时需要仔细查看更新日志并谨慎升级。但它并不能保证一切都会如预期运行，因为每个改动都可能带来有意或无意的行为变化。

## 语义化版本控制

在 JavaScript 生态系统中，特别是发布在 npm 上的包，我们遵循一个称为[语义化版本控制](https://semver.org/)(简称 SemVer)的约定。SemVer 版本号由三部分组成:`MAJOR.MINOR.PATCH`。规则很简单:

- <span font-bold font-mono text-amber>MAJOR</span>: 当进行不兼容的 API 更改时递增。
- <span font-bold font-mono text-lime>MINOR</span>: 当以向后兼容的方式添加功能时递增。
- <span font-bold font-mono text-blue>PATCH</span>: 当进行向后兼容的错误修复时递增。

我们使用的包管理器，如 `npm`、`pnpm` 和 `yarn`，都假定 npm 上的每个包都遵循 SemVer。当你将一个包指定依赖版本范围时，比如 `^1.2.3`，表示你接受升级到相同主版本号的任何版本(`1.x.x`)。在这个情况下，包管理器会根据你的项目具体情况自动确定最合适的版本。

这种约定在技术上是有效的。比如你指定某个包的版本是 `v1.2.3`， 当它发布了一个新的主版本 `v2.0.0`，你的包管理器不会安装它。这可以防止意外的破坏性变更影响你的项目，直到你手动更新版本范围。

然而，人们潜意识会有尺度来感知数字。我们往往会将 `v2.0` 到 `v3.0` 视为一个巨大的、破坏性的变化，而 `v125.0` 到 `v126.0` 看起来则要微不足道得多，尽管在 SemVer 中它们都表示不兼容的 API 变更。这种认知可能会使维护者在进行小的破坏性更改时犹豫是否要增加主版本号，导致在单个主版本发布中积累了许多破坏性更改，使用户升级变得更加困难。相反，对于类似 `v125.0` 这样的版本，由于升级到 `v126.0` 看起来变化很小，很难传达主要变更的重要性。

> {@TkDodo|Dominik Dorfmeister} 做过[一个关于 API 设计的精彩演讲](https://tkdodo.eu/blog/react-query-api-design-lessons-learned)，其中提到了一个有趣的不等式来描述这一点: ["破坏性变更 !== 营销事件"](https://tkdodo.eu/blog/react-query-api-design-lessons-learned?page=30)

## 渐进式

我坚信渐进式原则。相比一次性跨越到显著更高的版本，渐进式允许用户按照自己的节奏逐步采纳变更。它提供了暂停和评估的机会，使理解每个变更的影响变得更容易。

<figure text-center>
  <img src="/images/epoch-semver-progressive-1.png" alt="渐进式如阶梯" border="~ base rounded-xl">
  <figcaption>渐进式如阶梯 - 截取自我的演讲 <a italic font-serif href="/talks#the-progressive-path" target="_blank">渐进之路</a></figcaption>
</figure>

我认为我们应该将同样的原则应用于版本控制。与其将主版本视为一次大规模改造，不如将其分解成更小、更易管理的更新。例如，与其从 `v1.x` 发布包含 10 个破坏性变更的 `v2.0.0`，我们可以将这些变更分散到几个较小的主版本发布中。这样，我们可能会发布带有 2 个破坏性变更的 `v2.0`，然后是带有 1 个破坏性变更的 `v3.0`，依此类推。这种方法使用户更容易逐步采纳变更，并降低一次性引入过多变更而让用户不知所措的风险。

<figure text-center>
  <img src="/images/epoch-semver-progressive-2.png" alt="破坏性变更的渐进式" border="~ base rounded-xl">
  <figcaption>破坏性变更的渐进式 - 截取自我的演讲 <a italic font-serif href="/talks#the-progressive-path" target="_blank">渐进之路</a></figcaption>
</figure>

## 零主版本控制

我之所以坚持使用 `v0.x.x`，是因为我对版本控制有自己特殊的理解。我倾向于尽早引入必要的和小的破坏性变更，使升级更容易，而不会引起像 `v2` 到 `v3` 这样的主版本跳跃通常带来的恐慌。有些变更可能在"技术上"是破坏性的，但实际上并不影响 99.9% 的用户。(破坏性变更是相对的。即使是修复 bug 也可能对那些依赖先前行为的用户造成破坏，但这是另一个讨论话题 :P)。

SemVer 中有一个特殊规则，规定**当主版本号为 `0` 时，每个次版本号的增加都被视为破坏性的**。我某种程度上在**谬用**这个规则来绕过 SemVer 的限制。使用零主版本时，我实际上放弃了第一个数字，并将 `MINOR` 和 `PATCH` 合并为一个数字(感谢 [David Blass](https://x.com/ssalbdivad/status/1876614090623431116) 指出这一点):

<div py4>
  <code important="text-xl text-gray"><span line-through>ZERO</span>.<span font-bold text-amber>MAJOR</span>.{<span font-bold text-lime>MINOR</span> + <span font-bold text-blue>PATCH</span>}</code>
</div>

> 当然，零主版本控制并不是实现渐进式的唯一解决方案。我们可以看到像 [Node.js](https://nodejs.org/en)、[Vite](https://vite.dev/)、[Vitest](https://vitest.dev/) 这样的工具都在以固定间隔发布主版本，每个发布都包含最小的、易于采纳的破坏性变更。这需要大量的努力和额外的关注。向他们致敬！

我不得不承认，坚持**零主版本控制并不是最佳实践**。虽然我的目标是通过更细粒度的版本控制来改善沟通，但使用零主版本控制实际上限制了有效传达变更的能力。事实上，由于我的特殊坚持，我一直在浪费版本控制方案中的一个有价值的部分。

因此，在这里，我提议做出改变。

## Epoch 语义化版本控制

[在理想情况下，我希望 SemVer 有 4 个数字: `EPOCH.MAJOR.MINOR.PATCH`](https://x.com/antfu7/status/1679184417930059777)。`EPOCH` 版本用于那些重大公告，而 `MAJOR` 则用于可能不那么重要的技术性不兼容 API 变更。这样，我们就能有更细粒度的方式来传达变更。类似地，我们也有[提出 `HUMAN.MAJOR.MINOR` 的 romver 版本控制](https://github.com/romversioning/romver)。但是，当然现在让整个生态系统采用新的版本控制方案为时已晚。

如果我们不能改变 SemVer，也许我们至少可以扩展它。我提出一个新的版本控制方案，称为**🗿 Epoch语义化版本控制**，简称Epoch SemVer。它建立在 `MAJOR.MINOR.PATCH` 的结构之上，将第一个数字扩展为 `EPOCH` 和 `MAJOR` 的组合。为了区分它们，我们使用第三位数字来表示 `EPOCH`，这使得 `MAJOR` 的范围从 0 到 99。这样，它完全遵循 SemVer 的规则**而不需要任何现有工具改变，但为用户提供更细粒度的信息**。

> "Epoch" 这个名字的灵感来自 [Debian 的版本控制方案](https://manpages.debian.org/stretch/dpkg-dev/deb-version.5.en.html)。

在Epoch SemVer 中，版本号格式如下:

<div py4>
  <code important="text-xl text-gray">{<span font-bold text-violet>EPOCH</span> * 100 + <span font-bold text-amber>MAJOR</span>}.<span font-bold text-lime>MINOR</span>.<span font-bold text-blue>PATCH</span></code>
</div>

- <span font-bold font-mono text-violet>EPOCH</span>: 当你进行重大或突破性变更时递增。
- <span font-bold font-mono text-amber>MAJOR</span>: 当你进行小的不兼容 API 变更时递增。
- <span font-bold font-mono text-lime>MINOR</span>: 当你以向后兼容的方式添加功能时递增。
- <span font-bold font-mono text-blue>PATCH</span>: 当你进行向后兼容的错误修复时递增。

例如，UnoCSS 将从 `v0.65.3` 过渡到 `v65.3.0`(在 `EPOCH` 为 `0` 的情况下)。遵循 SemVer，补丁版本将变为 `v65.3.1`，功能版本将是 `v65.4.0`。如果我们引入一些影响边缘情况的小的不兼容变更，我们可以将其升级到 `v66.0.0` 来提醒用户潜在的影响。如果对核心进行重大改造，我们可以直接跳到 `v100.0.0` 来标志一个新时代并发布重大公告。我建议为每个非零的 `EPOCH` 分配一个代号，使其更容易记忆和引用。这种方法为维护者提供了更多灵活性，以有效地向用户传达变更的规模。

> 我们不应该经常需要增加 `EPOCH`。而且它主要对高层次的、面向最终用户的库或框架有用。对于低层次的库，它们可能永远不需要增加 `EPOCH`(`ZERO-EPOCH` 本质上与 SemVer 相同)。

当然，我并不是建议每个人都应该采用这种方式。这只是一个绕过现有系统的想法，而且只适用于有这种需求的包。让它在实践中能够更灵活。

## 展望未来

我计划在我的项目中采用 Epoch 语义化版本控制，包括 UnoCSS、Slidev 和我维护的所有插件，并最终放弃稳定包的零主版本控制。我希望这种新的版本控制方法能够帮助更有效地传达变更，并在升级时为用户提供更好的上下文。

我很想听听你对这个想法的看法和反馈。欢迎使用下方的链接分享你的评论！
