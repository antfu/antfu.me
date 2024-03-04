---
title: The Magic in Shiki Magic Move
date: 2024-03-04
lang: en
duration: 15min
description: The methodology behind Shiki Magic Move.
---

[[toc]]

<ShikiMagicMoveDemo />

[Magic Move is a feature for transition in Keynote](https://support.apple.com/guide/keynote/add-transitions-tanff5ae749e/mac), or it's called [Morph Transition in PowerPoint](https://support.microsoft.com/en-us/office/use-the-morph-transition-in-powerpoint-8dd1c7b2-b935-44f5-a74c-741d8d9244ea), and it automatically animates the transitions for objects between slides. It is quite impressive, very intuitive and effortless to use, and can be applied to various types of objects. Like you can paste a highlighted code block, or make another in a second slide, Magic Move will do the transition as granular to the tokens level for you.

The only annoying part of this process is that Keynote does not support code highlighting - so you need to highlight the code somewhere and paste them manually **every single time**. This is one of the reasons I made [Slidev](https://sli.dev/) - to have first-class tooling for developers to make presentations easier. While moving to web technologies with Slidev opens up almost infinite possibilities, on the other hand, it also makes some nice cool features in Keynote and PowerPoint harder to achieve (you need to write quite some extra code) - for example, the Magic Move.

Browsers' new [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) makes morphing between elements a lot easier, only that it requires some manual work to assign keys to make the pairs. While it's rather ok to do for a few big elements, doing such manually for every single token in a code block is basically unacceptable.

Roughly a year ago, [Eduardo @posva](https://github.com/posva) and I came up with the idea of using Shiki combined with Vue's [`<TransitionGroup>`](https://vuejs.org/guide/built-ins/transition-group) to achieve a similar effect for code blocks:

<Tweet h-650px>
<p lang="en" dir="ltr">Do you like Magic Move in Keynote for code?<a href="https://twitter.com/antfu7?ref_src=twsrc%5Etfw">@antfu7</a> and I are cooking something 😎 <a href="https://t.co/9JxjCzRA1S">pic.twitter.com/9JxjCzRA1S</a></p>&mdash; Eduardo.𝚟𝚞𝚎 (@posva) <a href="https://twitter.com/posva/status/1619083357756821504?ref_src=twsrc%5Etfw">January 27, 2023</a>
</Tweet>

We managed to make the proof of concept work, as shown in the video. However, due to some hard edge cases, both of us were busy with other things, and we didn't manage to make it a usable library at that time. It has come to our discussions from time to time but we didn't come up with a good solution. Until one day, a few weeks ago while I was preparing my slides, my [~~productive~~ procrastination](https://lmddgtfy.net/?q=Productive%20Procrastination) kicked in and I decided to give it another try to ~~escape from my slides~~.

And luck me, I found a quite nice approach and made it happen:

<Tweet h-670px>
<p lang="en" dir="ltr">The procrastination in preparing talks drove me to bring up the rework of the idea we had last year with <a href="https://twitter.com/posva?ref_src=twsrc%5Etfw">@posva</a> - animate Shiki tokens like Magic Move! 🪄<br><br>Found a much more reliable approach that could finally come out as a library (soon)<a href="https://t.co/b5SgQtTw2s">https://t.co/b5SgQtTw2s</a> <a href="https://t.co/s5LutlYmAK">pic.twitter.com/s5LutlYmAK</a></p>&mdash; Anthony Fu (@antfu7) <a href="https://twitter.com/antfu7/status/1760751386122211371?ref_src=twsrc%5Etfw">February 22, 2024</a>
</Tweet>

Made [a playground](https://shiki-magic-move.netlify.app/) where you can try it out yourself, and you can find the source code at <GitHubLink repo="shikijs/shiki-magic-move" />.

So today here, let's break it down and see how it works.

## How it works

To get started, we could see each word in the code with different colors as a token (they are `<span>` elements in practice). Basically, we can consider them as a set of small objects that we want to animate individually.

To break done the animations of Magic Move, we see we are basically trying to find connections between two sets of objects and animate them from one to another. Different from 1-to-1 transitions, here we expect the code before and after to be different, which means we could categorize the type of transitions into 3 categories:

<ShikiMagicMoveMatch />

In the playground above, we assign a key to each token. `Move` tokens come with pairs, so we assign the same key to make the "connection".

When doing highlighting, [Shiki](https://github.com/shikijs/shiki) turns the input code into an array of tokens. We can run Shiki twice for code before and after to get two collections of tokens. It should be fairly simple to find the `Enter` and `Leave` tokens by running two loops to compare the two collections. However, the challenge is to find good pairs of `Move` tokens. If we only pair them by the content of each token, it would be the case that 1-to-many or many-to-1 might make the pair transition off.

I came up with the idea of using a text diff algorithm to find the chunks of the code that are matched between the two versions. I ended up using Google's [Diff Match Patch](https://github.com/google/diff-match-patch) (I later refactored it into ESM as [`diff-match-patch-es`](https://github.com/antfu/diff-match-patch-es)) to achieve this.
With the diff result, we can now [reliably find the pairs](https://github.com/shikijs/shiki-magic-move/blob/e409aa5cf877a4005cf2b01729f1113beb405d13/src/core.ts#L226-L256) of the `Move` tokens without worrying that tokens might travel to the wrong place.

With this core logic in place, we can generate the correct keys for each token for the connection. This made the rest of the task clear, we just needed to apply different transitions to different types of tokens. We could feed them into any key-based transition library, for example, Vue provides a built-in [`<TransitionGroup>` component](https://vuejs.org/guide/built-ins/transition-group) that does the job perfectly, [live example](https://vuejs.org/examples/#list-transition).

## Transitions

While Vue's `<TransitionGroup>` should get the transition done automatically, it's actually a bit tricky to do in our specific case. The main reason is that the token elements in the code are `<span>` that rely on browsers' layout engine to calculate the position. During the transition, we want to make each token positioned absolutely to avoid messing up the layout. This means we need to record the position of each token with [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) before the transition starts, apply the absolute position to them during transitions, and then restore to the inline layout after the transition ends.

Ran into some limitations of `<TransitionGroup>` and also with the wish to have this a framework-agnostic solution, I ended up writing [a custom renderer](https://github.com/shikijs/shiki-magic-move/blob/5ec48554d87b4f4e2dd2e15f27ef9e51ef00074b/src/renderer.ts#L28) to do that, referencing a lot of the code from `<TransitionGroup>`.

Because we are relying on the browsers' layout engine to calculate the position, we need to get the destination position of each token (the position of the final code) before the transition starts. I found this trick in Vue's code to [force layout reflow](https://github.com/vuejs/core/blob/f66a75ea75c8aece065b61e2126b4c5b2338aa6e/packages/runtime-dom/src/components/TransitionGroup.ts#L77-L78) combined with temporary setting [transition duration to 0](https://github.com/vuejs/core/blob/f66a75ea75c8aece065b61e2126b4c5b2338aa6e/packages/runtime-dom/src/components/TransitionGroup.ts#L186-L187) to get the new position immediately so we could start animating.

Then it comes to do the transitions for different types of tokens:

### Enter Transition

The enter transition is the most straightforward one. Because the token will stay at the destination position after the transition, we don't need to do anything with the positioning. We usually just need to apply the opacity transition to make it appear. Here we add/remove classes for users to apply the transition with CSS.

Pseudo-code below:

```ts
for (const el of enterElements) {
  el.classList.add('transition-enter')
  el.classList.add('transition-enter-from')
}

// Replace the children of the container with
// elements from the new code
container.replaceChildren(...newChildren)
// Force layout reflow
forceReflow()

for (const el of enterElements) {
  el.classList.remove('transition-enter-from')
  el.classList.add('transition-enter-to')
}

// Here the transition starts
// from `.transition-enter-from` to `.transition-enter-to`

for (const el of enterElements) {
  // Transition Finished
  el.addEventListener('transitionend', () => {
    el.classList.remove('transition-enter-to')
  })
}
```

[[actual source code]](https://github.com/shikijs/shiki-magic-move/blob/5ec48554d87b4f4e2dd2e15f27ef9e51ef00074b/src/renderer.ts#L233-L249)

### Leave Transition

Since "Leave" tokens eventually disappear after the transition, we need to keep them in the DOM tree for a while for animations but we don't want them to participate in the layout. We can apply `position: absolute` to them and set the `top` and `left` to the original position to make them stay in place. Then we can apply the opacity transition to make them disappear.

Pseudo-code below:

```ts
for (const el of leaveElements) {
  // Get the position of the token stored before
  const pos = position.get(el)!
  // Set absolute position
  el.style.position = 'absolute'
  el.style.top = `${pos.y}px`
  el.style.left = `${pos.x}px`

  el.classList.add('transition-leave')
  el.classList.add('transition-leave-from')
}

// Replace the children of the container
// Same as the enter transition
container.replaceChildren(...newChildren)
forceReflow()

for (const el of enterElements) {
  el.classList.remove('transition-leave-from')
  el.classList.add('transition-leave-to')
}

for (const el of enterElements) {
  el.addEventListener('transitionend', () => {
    el.classList.remove('transition-leave-to')
  })
}
```

[[actual source code]](https://github.com/shikijs/shiki-magic-move/blob/5ec48554d87b4f4e2dd2e15f27ef9e51ef00074b/src/renderer.ts#L206-L229)

### Move Transition

To animate "Move" tokens requires a bit more work. We use a technique called ["FLIP"](https://aerotwist.com/blog/flip-your-animations/) (First, Last, Invert, Play) to make the transition smooth. We need to record the position of each token before the transition starts, then apply the absolute position to them during the transition, and then restore it to the inline layout after the transition ends.

It's a bit unintuitive to understand at first, but luckily [David Khourshid](https://css-tricks.com/author/davidkpiano/) made a great explanation at [Animating Layouts with the FLIP Technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/), definitely worth reading!

Pseudo-code below:

```ts
for (const el of moveElements) {
  const newPos = el.getBoundingClientRect()
  const oldPos = position.get(el)!
  const dx = oldPos.x - newPos.x
  const dy = oldPos.y - newPos.y

  // Set duration to 0 to get the new position immediately
  el.style.transitionDuration = '0ms'
  el.style.transitionDelay = '0ms'
  // Transform new elements to the old position
  el.style.transform = `translate(${dx}px, ${dy}px)`
}

// Replace the children of the container
container.replaceChildren(...newChildren)
forceReflow()

for (const el of moveElements) {
  // Remove transform overrides,
  // so it will start animating back to the new position
  el.classList.add('transition-move')
  el.style.transform = ''
  el.style.transitionDuration = ''
  el.style.transitionDelay = ''
}

for (const el of moveElements) {
  el.addEventListener('transitionend', () => {
    el.classList.remove('transition-move')
  })
}
```

[[actual source code]](https://github.com/shikijs/shiki-magic-move/blob/5ec48554d87b4f4e2dd2e15f27ef9e51ef00074b/src/renderer.ts#L254-L276)

## Integrations

Shiki Magic Move is open-sourced at <GitHubLink repo="shikijs/shiki-magic-move" />. The core logic is pretty lightweight and framework-agnostic, despite that the library is a bit low-level. Currently, I only have the bandwidth to make a Vue wrapper for it, and I am counting on you to contribute and add more first-class integrations for other frameworks as well as higher-level integrations.

If you are using [Slidev](https://sli.dev/), you can [try it today](https://sli.dev/guide/syntax#shiki-magic-move) to enhance your slides with Magic!

Hope you enjoy it, happy hacking!
