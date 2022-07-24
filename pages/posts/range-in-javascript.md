---
title: Range in JavaScript
date: 2021-09-13T16:00:00Z
lang: en
duration: 1min
---

Credit to [GitHub Copilot](https://copilot.github.com/).

I didn't know you could provide a map function to `Array.from` as a second argument until today.

```js
Array.from({ length: 10 }, (_, i) => i)
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```
