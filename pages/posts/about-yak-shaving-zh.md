---
title: 关于 Yak Shaving
date: 2021-05-19T16:00:00.000+00:00
lang: zh
duration: 10min
---

[[toc]]

> [English Version](/posts/about-yak-shaving)
>
> [知乎链接](https://zhuanlan.zhihu.com/p/373699761)


最近偶尔逛逛知乎，看到不少提问关于如何开始做开源，亦或是如何把开源项目做得成功。我算是也是有过类似的疑惑很长一段时间，就想着，也许我可以来分享一些我在这个方面一些粗浅的看法。

先是关于我，我是 Vue, Vite, wenyan-lang, WindiCSS, Intlify 的团队成员，也是 VueUse, Slidev, Type Challenges, i18n Ally 的作者，在个人的账号下也有一些零零碎碎的开源小工具，具体可以查看我的 [项目列表](https://antfu.me/projects)。从认真开始做开源到现在差不多两年多的时间，这些贡献虽然说不上多么了不起，但是却能够让我通过赞助，[全职进行开源的开发和维护](https://twitter.com/antfu7/status/1362676666221268995)。

也许很多人会和你说，一个项目的成功靠的是机遇，营销，Branding，或是文档，生态系统，技术创新，代码质量等等。以上这些固然重要，但对我而言，最重要是开始做一个项目的动机和把它做好的动力，而获得这个能力的最好途径，便是 Yak Shaving。

## Yak Shaving

[Yak Shaving](https://americanexpress.io/yak-shaving) 的字面意思是为剪牦牛毛，而引申出来的意思是，当你在进行一个工作时，发现另一个工作还没有完成，你便先去解决那个工作，在进行那个工作时，你又发现另一个工作… 如此往复，让你偏离了原本本该完成的工作，最终却也什么都没有完成。一个实际的例子：

> You want to bake an apple pie, so you head to the kitchen.<br>
> In the hallway, you notice some paint chipping on the wall.<br>
> So you walk to the hardware store for some paint.<br>
> On the way, you pass a bakery and stop in for a cupcake.<br>
> While eating the cupcake, you feel a pain in your mouth. It’s that cavity that you’ve been putting off.<br>
> You pick up your phone to call the dentist to make an appointment, but you see a notification from your friend Cher, who’s having a party.<br>
> You don’t want to show up empty-handed, so you stop for a bottle of wine…<br>

> 你想烤一个苹果派，所以你去了厨房。<br>
> 在走廊里，你注意到墙上有一些油漆剥落。<br>
> 于是你走去五金店去买一些油漆。<br>
> 在路上，你经过一家面包店，停下来吃了一个小蛋糕。<br>
> 在吃蛋糕时，你感到嘴里很痛。这是你一直在拖延的蛀牙。<br>
> 当你拿起手机想给预约牙医时，你看到了你朋友 Cher 正在举行一个聚会的通知。<br>
> 你不想空手去参加聚会，所以你停下来买了一瓶酒...

更贴近开发者的例子可能就是：你今天打算写篇博客，觉得现有的工具都不太行，花了一个月自己写了个静态网站生成器，最后生成器也没写完，写博客的事情却也忘了。

我猜大家多多少少都有过类似的经历。Yak Shaving 通常在指一些相对负面的东西，强调做事不专心或是目标不明确等等。而我却觉得，这反而是促成很多事情的重要动力来源。当一个人需要一个工具的当下，他最有动力去解决它把它实现出来。而我，不巧就是一个痴迷 Yak Shaving 的人。

也许，我和你分享一些我的故事能让你更好的体会我想要表达的意思：

## 我开始做开源的故事

大四那年，和一群同学去菲律宾毕业旅行。因为换汇的各种问题，一顿操作下来，台币、美金、菲律宾皮索以及每次不同的汇率，让公账的记录和结算变得非常复杂。毕业旅行回来之后，我们便萌生了做一款 App 解决这个问题的想法。

而希望让 App 能够有足够大的受众面，多语言国际化便是一个不得不考虑的问题。恰好学校有很多外语的科系，便想着利用在学校的资源，可以让同学也参与进来帮忙翻译多语种。可是让学外语的同学手撸 JSON 显然有些不现实，得找一些稍微轻松一点的方案。当时找到了 [`think2011/vscode-vue-i18n`](https://github.com/think2011/vscode-vue-i18n) 这个项目，看起来很不错，但是缺少一些我们需要的功能，联系了作者并获得了 Fork 的同意，于是便有了 [i18n Ally](https://github.com/lokalise/i18n-ally)。

App 开发的后期，正逢 Vue 3 的 Composition API RFC，新的 API 看起来解决了我们开发中的许多痛点，本着实验的精神，我们就装了 Vue 2 的插件开始试用。使用的过程中，发现我们很常会用到一些通用的函数，借由 [`react-use`](https://github.com/streamich/react-use) 的思想，我就顺便把它们抽离了出来做成了 [VueUse](https://github.com/vueuse/vueuse).

鉴于当时 Vue 3 仍在 Alpha，并且在未来很长一段时间里社区需要从 Vue 2 逐步迁移到 Vue 3。在做 VueUse 的过程中，便有意的将它作为 Vue 2 和 Vue 3 通用的工具以便大家无缝进行迁移，起初的解决方案是同版本发两个针对 Vue 2 和 3 的包在不同的 npm tag 下。随着 Vue 3 的逐步成熟，越来越多的库希望走同样的方式以减少同时维护两份代码库的成本。想着，也许我可以从 VueUse 中找到一个通用的方案，这样大家都可以因此受益，也就有了 [`vue-demi`](https://github.com/vueuse/vue-demi)，也让 VueUse 可以实现一个版本同时支持双版本。

因为 VueUse 对于 Vue 2 的支持依赖于 [`@vue/composition-api`](https://github.com/vuejs/composition-api) 这个库，当时这个库和最新的 Vue 3 的改动不一致，导致 VueUse 的开发受到的一些阻碍。向仓库提了 PR 却很久没人回应，想着也许我能帮一些忙，在仓库里发了 [一个 Issue](https://github.com/vuejs/composition-api/issues/343) 说我愿意参与维护这个项目。而这也成为了我加入 Vue 团队的契机。

到最后，我们的 App 最终没有成功，但是我却收获许多我在一路上解决问题做出的各种项目以及参与开源的宝贵经验。i18n Ally 从最初的 vue-i18n 专用到现在支持超过 20 个主流框架，VS Code 下载量超过 6 万。VueUse 从最开始一个简单的工具集，到现在成为一个拥有 10 个成员，8 个生态库的 GitHub Organization。

这样的故事我大概可以说上一天，几乎每个项目的背后都有这样一个试图去解决某个问题的动机。流水账了这么多，我想要说的是，利用得当，Yak Shaving 可以成为一个很好的驱动进步的引擎。

而对于如何把 Yak Shaving 变成一件好事，以下是几点我的方法：

## Shave the Good Yak

### 发现问题

我大学四年每天都在想着可以做一个有趣、大家都需要的开源项目，过上全职开源那种自由的生活。而事实是，我花了四年空想，也没有实现最开始定的毕业前 100 Stars 的目标，却在毕业的暑假两个月里，拿到了我从来没有想过的 1K Stars。区别在于，四年里我在想的是如何做出别人想要的东西，而后来我在解决的是**自己遇到的实际的问题**。如上面所说，当你需要一个工具的时候，你最有动力把它做出来，同时作为用户，也最了解痛点和需求在哪里，而当你遇到这个问题的时候，说不定其他人也遇到了类似的问题。

### 解决问题

开始尝试解决一个问题的最基本条件就是寻找现有的解决方案，如果这个问题已经被很好的解决了，也都满足你的需求，直接用就好了。重复造轮子也许是个不错的学习方式，但是我觉得，既然轮子已经有了，总得有人思考思考如何造辆车对吧。

当你发现这个问题并没有什么解决方案，或者是现有的方案你的觉得不太行，刚好你又有个不错的点子，那么恭喜你，你找到了一只不错的 Yak。

### 点到为止

利用 Yak Shaving 最重要的一点莫过于**点到为止** -- 不要抱有太大的期待，如果想法被验证了可行，做到够用即可；如果想法不可行，也不必气馁，丢掉便是了，也许哪天想明白了也可以再捡回来。不必画多么宏大的蓝图和计划，也不必设什么多少 Stars 多少用户的目标 -- 你是做给自己用的，能解决自己的问题就好。重要的是，不要在一个想法上花费过多的时间，及时回去做你本该做的事情。

### 完善项目

作为自己产品的第一用户，你会在使用它的过程中发现许多需要改善的地方，时不时去修改一下，完善一些。有空的话可以加个 README，描述一下你遇到的问题的做这个项目的动机，也许可以顺便帮助到一些遇到一样问题的人。

最后，当你自己对这个项目的使用让你觉得这是个还算不错的想法，而你也完成了本来该完成的工作，不妨花些时间，写个文档，完善一下功能，宣传一下。能被大家认可当然最好，如果没有，也可以当作一次练习，至少你解决了自己的问题。如果反响还不错，便会有人开始提 Issue 发 PR，功能更加齐全的同时，你也会慢慢了解到项目可以发展的方向。而这些改动和加强，最终也说不定能更好的解决你最开始遇到的问题。

### 发现更多问题

发现更多问题的方法很简单，多看多尝试。解决和完善问题的过程中，很大可能你会发现新的可以解决的问题，亦或是来自社区的 Issue 也可以很好的帮助你找到更多的灵感。Anyway，恭喜进入正循环！

## Wrapping Up

希望这样的一个看法可以或多或少能帮助你在解决自己的问题，或是做一个好的开源产品上，提供一些参考。

同时推荐一些厉害的 Yak Shaving 大师，也许他们的项目和经历也能给你带来一些灵感。

- [Sindre Sorhus](https://github.com/sindresorhus) - 活跃维护 1100+ 个 npm 包，Webpack 和 Babel 都依赖了他 100+ 个包
- [TJ Holowaychuk](https://github.com/tj) - koa, mocha, express 等项目作者
- [Luke Edwards](https://github.com/lukeed) - polka, uvu, klona 等项目作者
- [Egoist](https://github.com/egoist) - poi, cac, saber 等项目作者
- [Hiroki Osame](https://github.com/privatenumber) - esbuild-loader, vue-2-3 等项目作者

Cheers, and happy hacking!

[本文谢绝转载，谢谢]
