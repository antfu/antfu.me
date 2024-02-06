---
title: TwoSlash with Shiki
date: 2023-12-12T16:00:00Z
lang: en
duration: 2min
type: note
---

Here is an example of using [TwoSlash](https://twoslash.netlify.app/) with [Shiki](https://github.com/shikijs/shiki):

```ts twoslash
// @errors: 2540
console.log((1 + 2 + 3 + 4).toFixed(2))
//                            ^|

interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
//  ^?
}

todo.title = 'Hello'
```

Try hovering on each token to see the type information. Shiki runs [`oniguruma`](https://github.com/microsoft/vscode-oniguruma) to give syntax highlighting, and TwoSlash runs `typescript` to give type information. Both are quite heavy libraries, but this is done **ahead of time on building**, it means that what you see here is completely static pure HTML and CSS!

The Shiki integration allows you to provide [custom renderer](https://shiki.style/packages/twoslash#renderers) of how the HTML been generated based on AST. This allows us to have dual themes support, and also the syntax highlighting for the type information.

Check [`@shikijs/twoslash`](https://shiki.style/packages/twoslash) and [commit for the integration on antfu.me](https://github.com/antfu/antfu.me/commit/d2dfb25139e9f2d42f4135998ad2052179237641#diff-6a3b01ba97829c9566ef2d8dc466ffcffb4bdac08706d3d6319e42e0aa6890dd), for more information :)

<details>
<summary>The input code</summary>

````md
```ts twoslash
// @errors: 2540
console.log((1 + 2 + 3 + 4).toFixed(2))
//                            ^|

interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
//  ^?
}

todo.title = 'Hello'
```
````

</details>
