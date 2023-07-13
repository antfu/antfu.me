---
title: Match Chinese Characters
date: 2021-02-25T16:00:00Z
lang: en
duration: 2min
type: note
---

When you need to detect if a string contains Chinese characters, you would commonly think about doing it will RegExp, or grab a ready-to-use package on npm.

If you Google it, you are likely end up with [this solution](https://stackoverflow.com/a/21113538):

```ts
/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]/
```

It works, but a bit dirty. Fortunately, I found [a much simpler solution](https://stackoverflow.com/a/61151122) today:

```ts
/\p{Script=Han}/u
```

```ts
!!'你好'.match(/\p{Script=Han}/u) // true
```

It's called [Unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) and already available in [Chrome 64, Firefox 79, Safari 11.1 and Node.js 10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#browser_compatibility).

[All available scripts here](https://www.regular-expressions.info/unicode.html).
