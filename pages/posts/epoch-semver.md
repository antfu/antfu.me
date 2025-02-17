---
title: Epoch Semantic Versioning
date: 2025-01-07T12:00:00.000+00:00
lang: en
duration: 8min
description: Proposal for an extended Semantic Versioning called Epoch SemVer to provide more granular versioning information to users.
---

If you've been following my work in open source, you might have noticed that I have a tendency to stick with zero-major versioning, like `v0.x.x`. For instance, as of writing this post, the latest version of UnoCSS is [`v0.65.3`](https://github.com/unocss/unocss/releases/tag/v0.65.3), Slidev is [`v0.50.0`](https://github.com/slidevjs/slidev/releases/tag/v0.50.0), and `unplugin-vue-components` is [`v0.28.0`](https://github.com/unplugin/unplugin-vue-components/releases/tag/v0.28.0). Other projects, such as React Native is on [`v0.76.5`](https://github.com/facebook/react-native/releases/tag/v0.76.5), and sharp is on [`v0.33.5`](https://github.com/lovell/sharp/releases/tag/v0.33.5), also follow this pattern.

People often assume that a zero-major version indicates that the software is not ready for production. However, all of the projects mentioned here are quite stable and production-ready, used by millions of projects.

**Why?** - I bet that's your question reading this.

## Versioning

Version numbers act as snapshots of our codebase, helping us communicate changes effectively. For instance, we can say "it works in v1.3.2, but not in v1.3.3, there might be a regression." This makes it easier for maintainers to locate bugs by comparing the differences between these versions. A version is essentially a marker, a seal of the codebase at a specific point in time.

However, code is complex, and every change involves trade-offs. Describing how a change affects the code can be tricky even with natural language. A version number alone can't capture all the nuances of a release. That's why we have changelogs, release notes, and commit messages to provide more context.

I see versioning as a way to communicate changes to users — a **contract** between the library maintainers and the users to ensure compatibility and stability during upgrades. As a user, you can't always tell what's changed between `v2.3.4` and `v2.3.5` without checking the changelog. But by looking at the numbers, you can infer that it's a patch release meant to fix bugs, which **should** be safe to upgrade. This ability to understand changes just by looking at the version number is possible because both the library maintainer and the users agree on the versioning scheme.

Since versioning is only a contract, and could be interpreted differently to each specific project, you shouldn't blindly trust it. It serves as an indication to help you decide when to take a closer look at the changelog and be cautious about upgrading. But it's not a guarantee that everything will work as expected, as every change might introduce behavior changes, whether it's intended or not.

## Semantic Versioning

In the JavaScript ecosystem, especially for packages published on npm, we follow a convention known as [Semantic Versioning](https://semver.org/), or SemVer for short. A SemVer version number consists of three parts: `MAJOR.MINOR.PATCH`. The rules are straightforward:

- <span font-bold font-mono text-amber>MAJOR</span>: Increment when you make incompatible API changes.
- <span font-bold font-mono text-lime>MINOR</span>: Increment when you add functionality in a backwards-compatible manner.
- <span font-bold font-mono text-blue>PATCH</span>: Increment when you make backwards-compatible bug fixes.

Package managers we use, like `npm`, `pnpm`, and `yarn`, all operate under the assumption that every package on npm adheres to SemVer. When you or a package specifies a dependency with a version range, such as `^1.2.3`, it indicates that you are comfortable with upgrading to any version that shares the same major version (`1.x.x`). In these scenarios, package managers will automatically determine the best version to install based on what is most suitable for your specific project.

This convention works well technically. If a package releases a new major version `v2.0.0`, your package manager won't install it if your specified range is `^1.2.3`. This prevents unexpected breaking changes from affecting your project until you manually update the version range.

However, humans perceive numbers on a logarithmic scale. We tend to see `v2.0` to `v3.0` as a huge, groundbreaking change, while `v125.0` to `v126.0` seems a lot more trivial, even though both indicate incompatible API changes in SemVer. This perception can make maintainers hesitant to bump the major version for minor breaking changes, leading to the accumulation of many breaking changes in a single major release, making upgrades harder for users. Conversely, with something like `v125.0`, it becomes difficult to convey the significance of a major change, as the jump to `v126.0` appears minor.

> {@TkDodo|Dominik Dorfmeister} had [a great talk about API Design](https://tkdodo.eu/blog/react-query-api-design-lessons-learned), which mentions an interesting inequality that descripting this: ["Breaking Changes !== Marketing Event"](https://tkdodo.eu/blog/react-query-api-design-lessons-learned?page=30)

## Progressive

I am a strong believer in the principle of progressiveness. Rather than making a giant leap to a significantly higher stage all at once, progressiveness allows users to adopt changes gradually at their own pace. It provides opportunities to pause and assess, making it easier to understand the impact of each change.

<figure text-center>
  <img src="/images/epoch-semver-progressive-1.png" alt="Progressive as Stairs" border="~ base rounded-xl">
  <figcaption>Progressive as Stairs - a screenshot of my talk <a italic font-serif href="/talks#the-progressive-path" target="_blank">The Progressive Path</a></figcaption>
</figure>

I believe we should apply the same principle to versioning. Instead of treating a major version as a massive overhaul, we can break it down into smaller, more manageable updates. For example, rather than releasing `v2.0.0` with 10 breaking changes from `v1.x`, we could distribute these changes across several smaller major releases. This way, we might release `v2.0` with 2 breaking changes, followed by `v3.0` with 1 breaking change, and so on. This approach makes it easier for users to adopt changes gradually and reduces the risk of overwhelming them with too many changes at once.

<figure text-center>
  <img src="/images/epoch-semver-progressive-2.png" alt="Progressive on Breaking Changes" border="~ base rounded-xl">
  <figcaption>Progressive on Breaking Changes - a screenshot of my talk <a italic font-serif href="/talks#the-progressive-path" target="_blank">The Progressive Path</a></figcaption>
</figure>

## Leading Zero Major Versioning

The reason I've stuck with `v0.x.x` is my own unconventional approach to versioning. I prefer to introduce necessary and minor breaking changes early on, making upgrades easier, without causing alarm that typically comes with major version jumps like `v2` to `v3`. Some changes might be "technically" breaking but don't impact 99.9% of users in practice. (Breaking changes are relative. Even a bug fix can be breaking for those relying on the previous behavior, but that's another topic for discussion :P).

There's a special rule in SemVer that states **when the leading major version is `0`, every minor version bump is considered breaking**. I am kind of **abusing** that rule to workaround the limitation of SemVer. With zero-major versioning, we are effectively abandoning the first number, and merge `MINOR` and `PATCH` into a single number (thanks to [David Blass](https://x.com/ssalbdivad) for pointing [this](https://x.com/ssalbdivad/status/1876614090623431116) out):

<div py4>
  <code important="text-xl text-gray"><span line-through>ZERO</span>.<span font-bold text-amber>MAJOR</span>.{<span font-bold text-lime>MINOR</span> + <span font-bold text-blue>PATCH</span>}</code>
</div>

> Of course, zero-major versioning is not the only solution to be progressive. We can see that tools like [Node.js](https://nodejs.org/en), [Vite](https://vite.dev/), [Vitest](https://vitest.dev/) are rolling out major versions in consistent intervals, with a minimal set of breaking changes in each release that are easy to adopt. It would require a lot of effort and extra attentions. Kudos to them!

I have to admit that sticking to **zero-major versioning isn't the best practice.** While I aimed for more granular versioning to improve communication, using zero-major versioning has actually limited the ability to convey changes effectively. In reality, I've been wasting a valuable part of the versioning scheme due to my peculiar insistence.

Thus, here, I am proposing to change.

## Epoch Semantic Versioning

[In an ideal world, I would wish SemVer to have 4 numbers: `EPOCH.MAJOR.MINOR.PATCH`](https://x.com/antfu7/status/1679184417930059777). The `EPOCH` version is for those big announcements, while `MAJOR` is for technical incompatible API changes that might not be significant. This way, we can have a more granular way to communicate changes. Similarly, we also have [Romantic Versioning that propose `HUMAN.MAJOR.MINOR`](https://github.com/romversioning/romver). The creator of SemVer, [Tom Preston-Werner](https://tom.preston-werner.com/) also [mentioned similar concerns and solutions in this blog post](https://tom.preston-werner.com/2022/05/23/major-version-numbers-are-not-sacred). (thanks to [Sébastien Lorber](https://x.com/sebastienlorber) for pointing [this](https://x.com/sebastienlorber/status/1879127128530460856) out).

But, of course, it's too late for the entire ecosystem to adopt a new versioning scheme.

If we can't change SemVer, maybe we can at least extend it. I am proposing a new versioning scheme called **🗿 Epoch Semantic Versioning**, or Epoch SemVer for short. It's built on top of the structure of `MAJOR.MINOR.PATCH`, extend the first number to be the combination of `EPOCH` and `MAJOR`. To put a difference between them, we use a fourth digit to represent `EPOCH`, which gives `MAJOR` a range from 0 to 999. This way, it follows the exact same rules as SemVer **without requiring any existing tools to change, but provides more granular information to users**.

> The name "Epoch" is inspired by [Debian's versioning scheme](https://manpages.debian.org/stretch/dpkg-dev/deb-version.5.en.html).

The format is as follows:

<div py4>
  <code important="text-xl text-gray">{<span font-bold text-violet>EPOCH</span> * 1000 + <span font-bold text-amber>MAJOR</span>}.<span font-bold text-lime>MINOR</span>.<span font-bold text-blue>PATCH</span></code>
</div>

- <span font-bold font-mono text-violet>EPOCH</span>: Increment when you make significant or groundbreaking changes.
- <span font-bold font-mono text-amber>MAJOR</span>: Increment when you make minor incompatible API changes.
- <span font-bold font-mono text-lime>MINOR</span>: Increment when you add functionality in a backwards-compatible manner.
- <span font-bold font-mono text-blue>PATCH</span>: Increment when you make backwards-compatible bug fixes.

> I previously proposed to have the EPOCH multiplier to be `100`, but according to the community feedback, it seems that `1000` is a more popular choices as it give more room for the `MAJOR` version and a bit more distinguision between the numbers. The multiplier is not a strict rule, feel free to adjust it based on your needs.

For example, UnoCSS would transition from `v0.65.3` to `v65.3.0` (in the case `EPOCH` is `0`). Following SemVer, a patch release would become `v65.3.1`, and a feature release would be `v65.4.0`. If we introduced some minor incompatible changes affecting an edge case, we could bump it to `v66.0.0` to alert users of potential impacts. In the event of a significant overhaul to the core, we could jump directly to `v1000.0.0` to signal a new era and make a big announcement. I'd suggest assigning a code name to each non-zero `EPOCH` to make it more memorable and easier to refer to. This approach provides maintainers with more flexibility to communicate the scale of changes to users effectively.

> [!TIP]
> We shouldn't need to bump `EPOCH` often. It's mostly useful for high-level, end-user-facing libraries or frameworks. For low-level libraries, they might **never** need to bump `EPOCH` at all (`ZERO-EPOCH` is essentially the same as SemVer).

Of course, I'm not suggesting that everyone should adopt this approach. It's simply an idea to work around the existing system, and only for those packages with this need. It will be interesting to see how it performs in practice.

## Moving Forward

I plan to adopt Epoch Semantic Versioning in my projects, including UnoCSS, Slidev, and all the plugins I maintain, and ultimately abandon zero-major versioning for stable packages. I hope this new versioning approach will help communicate changes more effectively and provide users with better context when upgrading.

I'd love to hear your thoughts and feedback on this idea. Feel free to share your comments using the links below!
