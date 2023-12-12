---
title: TwoSlash with Shikiji
date: 2023-12-12T16:00:00Z
lang: en
duration: 2min
type: note
---

Here is an example of using [TwoSlash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) with [Shikiji](https://github.com/antfu/shikiji):

```ts twoslash
// @errors: 2540
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
//  ^?
}

todo.title = 'Hello'
```

Try hovering on each token to see the type information. Shiki runs [`oniguruma`](https://github.com/microsoft/vscode-oniguruma) to give syntax highlighting, and TwoSlash runs `typescript` to give type information. Both are kinda "heavy" libraries, but this is don't ahead of time on building, so what you see here is completely static HTML and CSS!

In addition to the original [`shiki-twoslash`](https://github.com/shikijs/twoslash) package, the `Shikiji` allows you to provide [custom renderer](https://github.com/antfu/shikiji/tree/main/packages/shikiji-twoslash#rendererrich) of how the HTML been generated based on AST. This allows us to have dual themes support, and also the syntax highlighting for the type information.

Check [`shikiji-twoslash`](https://github.com/antfu/shikiji/tree/main/packages/shikiji-twoslash) for more information :)

<details>
<summary>The input code</summary>

````md
```ts twoslash
// @errors: 2540
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
// ^?
}

todo.title = 'Hello'
```
````

</details>
