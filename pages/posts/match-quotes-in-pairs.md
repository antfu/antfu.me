---
title: Match Quotes in Pairs
date: 2021-02-28T16:00:00Z
lang: en
duration: 5min
type: note
---

In JavaScript, single quotes('') and double quotes("") are interchangeable. With ES6, we now even have backticks(``) for template literals. When you want to write a quick script to find all the strings without introducing a heavy parser, you may think about using RegExp. For example, you can have:

```ts
/['"`](.*?)['"`]/gm
```

It works for most of the case, but not for mixed quotes:

```ts
'const a = "Hi, I\'m Anthony"'.match(/['"`](.*)['"`]/m)[1] // "Hi, I"
```

You have to make sure the starting quote and ending quote are the same type. Initially I thought it was impossible to do it in RegExp, or we have to do like this:

```ts
/'(.*?)'|"(.*?)"|`(.*?)`/gm
```

That's definitely a bad idea as it makes you duplicated your notations. Until I found this solution:

```ts
/(['"`])(.*?)\1/gm
```

`\1` is a [Backreferences](https://www.regular-expressions.info/backref.html) to your first group, similarly you can have `\2` for the second group 2 and `\3` for the third, you got the idea. This is exactly what I need! Take it a bit further, to exclude the backslash escaping, now we can have a much reliable RegExp for extracting quoted texts from any code.

```ts
/(["'`])((?:\\\1|(?:(?!\1)|\n|\r).)*?)\1/mg
```

You can find it running in action on my [`vite-plugin-windicss`](https://github.com/windicss/vite-plugin-windicss/blob/571c1d9d9bcbf699038614e6f9fab0ddc62b959b/packages/plugin-utils/src/regexes.ts#L1).
