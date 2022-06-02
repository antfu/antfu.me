---
title: 「请提供最小重现」
date: 2022-05-30T16:00:00Z
lang: zh
duration: 9min
description: 关于最小重现之于开源的思考
---

[[toc]]

> [English Version](/posts/why-reproductions-are-required)

如果你曾经浏览过我的仓库中的 Issue 列表或提过 Issue，你可能有时会看到我留下以下评论随即关闭了这个 Issue。

<figure>
<img src="/images/issue-close-without-repro-light.png" img-light rounded-lg>
<img src="/images/issue-close-without-repro-dark.png" img-dark rounded-lg>
<figcaption>由于缺乏足够的信息，我们暂时关闭了该 Issue。请提供 <a href="https://stackoverflow.com/help/minimal-reproducible-example" target="_blank">最小重现</a> 以重新开启 Issue。谢谢。</figcaption>
</figure>

如果这则评论曾让你感到任何的不愉悦，我在这里先说声抱歉。在这篇文章中，我将尝试解释这背后的理由。

## 开源软件以现状提供

首先，让我们就开源软件（Open Source Software）的概念达成一致。如果你看一下 MIT 许可证，你会发现它包含以下声明：

> The software is provided **"AS IS"**, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.

> 本软件**以现状**提供，不负任何明示或默示之担保责任，包括但不限于就适售性以及特定目的的适用性为默示性担保。

"以现状" 意味着作者将代码现在的状态交给你，但不负责修复或改进你现在或将来的任何问题。由于它们是免费且开源的，无论你是否使用它，作者或维护者都不会得到任何好处。开源软件中并没有所谓的客户服务。理论上，你作为一个使用者，应该由你自己对所使用的代码负责。

这的确听起来很吓人。但幸运的是，在真实世界中，事情并没有那么糟糕。在许多开源项目中，使用者和维护者之间建立起了信任。使用者通过 Issue 报告软件可能存在的问题，或通过讨论与 PR 分享解决方案来为项目做出贡献。维护者花费他们的时间花在 Review、决策、发版等工作上。使用者和维护者的工作都是**纯自愿**的，为了同一个愿望 -- 让软件变得更好，使所有人受益。

## 软件的维护需要大量的精力

软件一旦诞生，就永远不会完成。维护工作对于保持项目的 "生命力" 起着至关重要的作用，例如及时获得 bug 和安全漏洞的修复以及保持长期的可持续发展。像处理 Issue、Code Review、参与讨论与决策等，都需要维护者付出大量的精力。而在开源项目中，用户与维护者的比例通常是不平衡的。许多热门的项目背后可能只有一两个维护者。随着项目的发展和用户的增加，维护项目所需的任务量可能很容易超出个人的能力。

<figure>
<img src="/images/github-inbox-light.png" img-light rounded-lg>
<img src="/images/github-inbox-dark.png" img-dark rounded-lg>
<figcaption>我的 GitHub 通知收件箱</figcaption>
</figure>

## 为什么需要重现

一个好的 [最小重现](https://stackoverflow.com/help/minimal-reproducible-example) 可以极大地帮助维护者确定根本原因，并迅速地进行修复。想象一下，如果没有最小重现，仅凭 Issue 的描述或者一张截图，维护者甚至可能都不知道这个问题是否是由项目本身引起，或是其他因素造成的。为了确定这一点，维护者可能需要花额外的时间自己尝试建立一个重现，或者深入使用者所提供的大型项目中（即非最小重现）。这个过程可能会花费几个小时，但如果最后问题还是无法重现，或者发现根本不是项目本身的问题呢？如果有数百个这样的问题需要处理呢？

在我看来，**要求最小重现是在要求使用者与维护者所花费的努力的公平**。如果每个人都能在提 Issue 之前可以花一些时间创建一个最小重现，合集下来就能为维护者节省数百个小时（这甚至可以帮助使用者自己找到解决方案/错误，以至于不再需要提 Issue）。一个经过充分调查和解释的 Issue 也会让维护者更愿意花时间和精力处理。

## 结语

作为一个维护者，我很感谢所有的 Issue 和 PR。而且我想，在我们因为缺少重现而关闭的 Issue 中确实可能仍有真正需要被修复的 bug。但为了不被通知所淹没，维护者通常需要设定处理任务的优先级。将 Issue 的数量保持在可控范围内是保持项目长期健康发展的方法之一。

我相信开源是关于共同建设，而不是仅仅依靠维护者的努力。希望我们能一起打造一个更好、更健康的社区。谢谢你的阅读 :)
