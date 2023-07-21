---
title: Sliding Enter Animation
date: 2023-05-07
lang: en
duration: 6min
description: Adding an elegant sliding enter animation to your blog.
---

<script setup lag="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

As you might notice, I recently added a sliding enter effect to almost all the pages in my blog. And I quite like it. If you missed it, <a @click="router.go(0)">refresh the page</a> to see it in action.

This effect is inspired by [paco.me](https://paco.me/) - the portfolio of [Paco Coursey](https://twitter.com/pacocoursey), one of my favorite developer-designers.

In this blog post, let's break it down and implement one our own.

## Breakdown

If you go inspecting the source code of [paco.me](https://paco.me/), you will find that it's implemented with CSS animation, and it's quite concise:

```css
@keyframes enter {
  0% {
    opacity: 0;
    transform: translateY(10px)
  }

  to {
    opacity: 1;
    transform: none
  }
}

[data-animate] {
  --stagger: 0;
  --delay: 120ms;
  --start: 0ms;
}

@media (prefers-reduced-motion:no-preference) {
  [data-animate] {
    animation: enter .6s both;
    animation-delay: calc(var(--stagger) * var(--delay) + var(--start));
  }
}

[data-animation-controller=false] [data-animate] {
  animation: none;
}
```

And in the HTML usage, we have:

```html
<p style="--stagger:1" data-animate>Block 1</p>
<p style="--stagger:2" data-animate>Block 2</p>
```

It defines a keyframe animation `enter` that slides the element up by 10px and fades, creating the gentle "floating" effect. The key point is the `animation-delay` property - assigning a different delay to each element/block, making them have the effect of enter one by one. Then, some CSS variables are used to make the the delay sequence easier to control.

## Applying to Contents

Now with it, we should be able to add nice sliding enter animation to our layout and homepage, etc. Even though it can be a bit verbose to add style to each element, it gives you full control of what and when those animations take place.

However, when it comes to content like a Markdown page, it will not be that pleasant to wrap each paragraph with a `<p>` tag and add the `data-animate` attribute. So I begin to wonder if there is an easier way to apply to all my posts.

I started messing up with the [CSS Counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters), an interesting way allowing you to store some numeric variables inside of CSS.

So it should be something like this, where you can add `slide-enter-content` class wrapping the generated content of a Markdown page:

```css
.slide-enter-content {
  counter-reset: enter-count;
}

.slide-enter-content > p {
  --stagger: 0;
  --delay: 150ms;
  --start: 0ms;
  animation: slide-enter 1s both 1;
  animation-delay: calc(var(--start) + var(--stagger) * var(--delay));
}

.slide-enter-content > p {
  counter-increment: enter-count;
  --stagger: counter(enter-count);
}
```

It all seems to make sense, but it actually **doesn't work**. The reason is that the `counter()` function returns a string instead of a number and currently there is no way to convert it to a number, in which the `calc()` function will fail to compute. There are some [discussions & proposals](https://github.com/w3c/csswg-drafts/issues/1026) about this, but it seems not going to happen very soon.

So as a workaround, which also been posted in the previous link, we can use the `nth-child()` selector to achieve the same effect, manually:

```css
.slide-enter-content > * {
  --stagger: 0;
  --delay: 150ms;
  --start: 0ms;
  animation: slide-enter 1s both 1;
  animation-delay: calc(var(--start) + var(--stagger) * var(--delay));
}

.slide-enter-content > *:nth-child(1) { --stagger: 1; }
.slide-enter-content > *:nth-child(2) { --stagger: 2; }
.slide-enter-content > *:nth-child(3) { --stagger: 3; }
.slide-enter-content > *:nth-child(4) { --stagger: 4; }
.slide-enter-content > *:nth-child(5) { --stagger: 5; }
.slide-enter-content > *:nth-child(6) { --stagger: 6; }
.slide-enter-content > *:nth-child(7) { --stagger: 7; }
.slide-enter-content > *:nth-child(8) { --stagger: 8; }
.slide-enter-content > *:nth-child(9) { --stagger: 9; }
.slide-enter-content > *:nth-child(10) { --stagger: 10; }
.slide-enter-content > *:nth-child(11) { --stagger: 11; }
.slide-enter-content > *:nth-child(12) { --stagger: 12; }
.slide-enter-content > *:nth-child(13) { --stagger: 13; }
.slide-enter-content > *:nth-child(14) { --stagger: 14; }
.slide-enter-content > *:nth-child(15) { --stagger: 15; }
.slide-enter-content > *:nth-child(16) { --stagger: 16; }
.slide-enter-content > *:nth-child(17) { --stagger: 17; }
.slide-enter-content > *:nth-child(18) { --stagger: 18; }
.slide-enter-content > *:nth-child(19) { --stagger: 19; }
.slide-enter-content > *:nth-child(20) { --stagger: 20; }
```

The limitation is clear, that the animation only applies to a finite number of elements. You could add more CSS rules to support more, but in practice, I think 20 elements are already quite enough as we don't usually have that many paragraphs fit in one screen.

So that's it, I have applied this effect to most of the pages as well as the blog posts. Let me know what do you think! And you can find the source code [here](https://github.com/antfu/antfu.me/blob/b9f54c9421ae94e37d4cd598c20e02c4f3ed8db4/src/styles/main.css#L87).
