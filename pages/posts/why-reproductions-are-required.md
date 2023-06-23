---
title: Why Reproductions are Required
date: 2022-05-30T16:00:00Z
lang: en
duration: 9min
description: My thoughts on why reproductions are important in open source.
---

[[toc]]

> [中文 Chinese Version](/posts/why-reproductions-are-required-zh)

If you have ever browsed the issue lists in my repos or created one, you might sometimes see I reply with the following comment and then close the issue:

<figure>
<img src="/images/issue-close-without-repro-light.png" img-light rounded-lg>
<img src="/images/issue-close-without-repro-dark.png" img-dark rounded-lg>
<figcaption>We temporarily close this due to the lack of enough information. Please provide a <a href="https://stackoverflow.com/help/minimal-reproducible-example" target="_blank">minimal reproduction</a> to reopen the issue. Thanks.</figcaption>
</figure>

I'd first say sorry if it ever makes you feel unpleasant. In this post, let me try to explain the reason behind it.

## Open Source Software is served "as-is"

First of all, let's reach a consensus about Open Source Software(OSS). If you look into the MIT License, one of the most popular licenses, you will see it contains the following statement:

> The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.

"As is" stands that you are free to use the code, fork it, or modify it as you want with the **current state**. Meaning the authors are not responsible to fix or improve anything you might have now or in the future. Since it's free and open source, the authors or maintainers gain nothing regardless if you use it or not. There is no such thing as 24-7 customer service. Theoretically, you as a user of open source code, should be responsible to the code you use.

Yeah, that sounds scary. But luckily, things are not that bad in real practice. In many open source projects, we build trust between users and maintainers. Users contribute to projects by reporting issues they faced, or sharing solutions via discussions and pull requests. Maintainers spend their time reviewing, making decisions, managing releases, and doing distributions. Both users and maintainers work **voluntarily** toward the same wish - to make the software better, for everyone.

## Maintainance takes effort, a lot

Software once written, is never finished. Maintainance plays a crucial role to keep a project "alive", getting bug or security fixes on time, and being sustainable in the long run. Things like triaging issues, reviewing PRs, and discussions could take a lot of effort from maintainers. While in open source projects, the ratios of user-to-maintainer are commonly unbalanced. Many popular projects might only have one or two maintainers behind the scene. As a project grows and gains more users, the number of tasks required to maintain the project may easily go beyond one’s capacity.

<figure>
<img src="/images/github-inbox-light.png" img-light rounded-lg>
<img src="/images/github-inbox-dark.png" img-dark rounded-lg>
<figcaption>My inbox of GitHub notifications</figcaption>
</figure>

## Why Reproduction

A good [minimal reproduction](https://stackoverflow.com/help/minimal-reproducible-example) of a potential issue could greatly help maintainers to identify the root cause and land the fix quickly. Without a minimal reproduction, merely from the issue description or a screenshot, maintainers won't even know whether it's a real issue of the project or it's caused by some other factors. To identify that, maintainers might need to spend extra time to find a reproduction themselves, or dive into the giant project people shared as a "non-minimal reproduction". Hours might be spent, but what if it turns out a non-issue or unreproducible? What if there are hundreds of such issues you need to deal with?

In my opinion, **asking for minimal reproduction is asking for equity of the effort spent**. If everyone could take some time to create a minimal reproduction before opening issues, it would save maintainers hundreds of hours (or even help themselves to find user-land solutions/mistakes, then they don't even need to create the issue). A well-investigated and well-explained issue would also make maintainers more willing to spend their time and effort in return.

> Here I'd like to coin a term "**presumption of bug-free**". Similiar to [presumption of innocence](https://en.wikipedia.org/wiki/Presumption_of_innocence) in law, issues should be consider innocent until proven "guilty" with a minimal reproduction. Issue creators should be responsible to provide enough information to prove the issue is not caused by other factors.

## How to Create a Minimal Reproduction

### Failing Test Cases

If you are a developer and familiar with the testing process. **The best reproductions are pull requests that add failing test cases**. This approach doesn't just highlight the problem, but also clearly depicts the expected behavior. Leveraging the Continuous Integration (CI) system, it also allows verifying the fix upon landing and provides a safeguard against future regressions.

To proceed with this method, initiate by cloning the project's source code and setting up the development environment. Then, create a new branch and navigate to the test folder to introduce a failing test case that mirrors the discrepancy you've observed. Upon successfully making the new test fail -- indicating the bug -- commit the changes, then establish a pull request detailing the issue in its description.

Here are some real world examples:

- [vuejs/language-tools #2113](https://github.com/vuejs/language-tools/pull/2113)
  1. [PR created by adding failing test](https://github.com/vuejs/language-tools/pull/2113/commits/eba91fdc0e35389f495ecb7fe144e301e5ccbd58)
  2. [The maintainer later pushed a fix to make the test pass](https://github.com/vuejs/language-tools/pull/2113/commits/6b712b22b442184ce6a6abe3052db7d5a3cb5ac4)
  3. PR gets merged, and the tests get improved to cover more cases
- [unjs/magicast #62](https://github.com/unjs/magicast/pull/62)
  1. [PR created by adding failing test](https://github.com/unjs/magicast/pull/62/commits/7d3bb7c7955ce2eb697014700771e94795682f89)
  2. [The maintainer later pushed a fix to make the test pass](https://github.com/unjs/magicast/pull/62/commits/6a27de93b73861eb0750873105fd8c5d51f8912c)
  3. PR gets merged with the improved test case

Please note that this method may not always applicable. If the bug is not been able to be reproduced with a test case, you can try to create a repository reproductions instead, as described below.

### Reproducible Projects or Playgrounds

> This section is ported from [*Please include a repro*](https://gist.github.com/Rich-Harris/88c5fc2ac6dc941b22e7996af05d70ff) by [Rich Harris](https://github.com/Rich-Harris). Also recommand watching [a more detailed explanation by Rich Harris](https://youtu.be/dB_YjuAMH3o?t=1376).

In some cases, there will be a project-specific way to demonstrate problems – for example, [Rollup](http://rollupjs.org), [Svelte](https://svelte.technology/repl) and [Vue](https://sfc.vuejs.org/) all have dedicated REPLs. Use them!

Often, it's not possible to illustrate the problem with a REPL. Here's what you do:

1. Create a sample repo on GitHub or Stackblitz (or wherever)
2. Demonstrate the problem, and nothing but the problem. Whittle it down to the *bare minimum* of code that reliably demonstrates the issue. Get rid of any dependencies that aren't *directly* related to the problem.
3. Install all your dependencies to `package.json`. If the maintainer can't clone the repo and do `npm install && npm run build` (or similar – see point 4) to see the problem, because the maintainer needs some globally installed CLI tool or whatever, that would make it harder to get to the bottom of the issue.
4. Include instructions in the repo, along with a description of the expected and actual behaviour. Obviously the issue should include information about the bug as well, but it's really helpful if `README.md` includes that information, plus a link back to the issue. If there are any instructions beyond `npm install && npm run build`, they should go here.

## Wrapping Up

As a maintainer, I appreciate all the issues and pull requests opened. And I believe it's true that some of the issues we closed without reproduction might still have real bugs that need to be fixed. But to not be overwhelmed by the notifications, maintainers need to set the priorities for handling the tasks. Keeping the number of issues in a manageable manner is one of the ways to keep the project healthy in the long run.

I believe open source is about building great stuff together, not solely on maintainers' shoulders. Wish we could make a better and healthier community together. Thanks for reading :)
