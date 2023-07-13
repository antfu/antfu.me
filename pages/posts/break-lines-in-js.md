---
title: Break Lines in JS
date: 2023-02-10T16:00:00.000+00:00
lang: en
duration: 2min
type: note
---

You probably don't need it usually, but in case you want to break lines programmatically in JavaScript, here is my lazy man's solution:

<!-- eslint-skip -->

```js
// break lines at space with maximum 25 characters per line
text.split(/(.{0,25})(?:\s|$)/g).filter(Boolean)
```

A quick example:

```js
const text = 'A quick brown fox jumps over the lazy dog.'
const lines = text.split(/(.{0,16})(?:\s|$)/g).filter(Boolean)

console.log(lines)
// ['A quick brown', 'fox jumps over', 'the lazy dog.']
```

You probably see a few edge cases already. But come on, it's just one line of code :P
