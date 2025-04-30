---
title: Async, Sync, in Between
date: 2025-03-03
lang: en
description: The coloring problem in modern programming, and a proposal of a new approach
duration: 18min
---

## The Coloring Problem

In modern programming, the function coloring problem isn't new. Based on how functions execute: <code important-text-blue>synchronous</code> (blocking) and <code important-text-rose>asynchronous</code> (non-blocking), we often classify them into two "colors" for better distinction. The problem arises because you generally cannot mix and match these colors freely.

For instance, in JavaScript:

- An <span text-rose>async</span> function can call both <span text-blue>sync</span> and other <span text-rose>async</span> functions.
- A <span text-blue>sync</span> function, however, cannot directly call an <span text-rose>async</span> function without changing its own color to async.

This restriction forces developers to propagate the "color" throughout their codebase. If a function deep in your logic needs to become async, it forces every caller up the chain to also become async, leading to a cascading effect (or "async inflection"). This makes refactoring harder, increases complexity, and sometimes leads to awkward workarounds like blocking async calls with await inside sync contexts, or vice versa.

<figure>
  <QuansyncGraph1 />
  <figcaption text-center>
If `loadFile()` needs to be async, then all its callers upstream need to change to async too.
  </figcaption>
</figure>

We often discuss the async inflection problem, where a common solution is to make everything async since async functions can call both sync and async functions, while the reverse is not true. However, the coloring problem actually goes both ways, which seems to be less frequently discussed:

While an async function requires all the **callers** to be async, a sync function also requires all the **dependencies** to be sync.

<figure>
  <QuansyncGraph2 />
  <figcaption text-center>
If `parse()` needs to be sync, then all its dependencies down the road need to be sync too.
  </figcaption>
</figure>

At its core, it's the same problem with different perspectives. It depends on which part of the code you're focusing on and how difficult it is to change its "color." If the function you're working on **must be async**, the burden shifts to the callers. Conversely, if it **must be sync**, you'll need all your dependencies to be sync or provide a synchronous entry point.

### Libraries in Practice

For example, the widely used library [`find-up`](https://github.com/sindresorhus/find-up) provides two main APIs, <code important-text-rose>findUp</code> and <code important-text-blue>findUpSync</code>, to avoid dependents being trapped by the coloring problem. If you look into the code, you'll find that the package essentially [duplicates the logic twice](https://github.com/sindresorhus/find-up/blob/b733bb70d3aa21b22fa011be8089110d467c317f/index.js#L51) to provide the two APIs. Going down, you see its dependency [`locate-path`](https://github.com/sindresorhus/locate-path) also [duplicates the <code important-text-rose>locatePath</code> and <code important-text-blue>locatePathSync</code> logic](https://github.com/sindresorhus/locate-path/blob/355a681456d79a8506de11120d56b6e34a0389b5/index.js#L49).

Say you want to build another library that uses `findUp`, like `readNearestPkg`, you would also have to write the logic twice, using <code important-text-rose>findUp</code> and <code important-text-blue>findUpSync</code> separately, to support both async and sync usage.

In these cases, even if our main logic does not come with its own "colors," the whole dependency pipeline is forced to branch into two colors due to an optional async operation down the road (e.g., <code important-text-rose>fs.promises.stat</code> and <code important-text-blue>fs.statSync</code>).

<figure>
  <QuansyncGraph3 />
  <figcaption text-center>
Basically, we would maintain two branches of code to support both sync and async, with only a few sync utils that can be shared.
  </figcaption>
</figure>

### Async Plugins

Another case demonstrating the coloring problem is a plugin system with async hooks. For example, imagine we are building a Markdown-to-HTML compiler with plugin support. Say the parser and compiler logic are synchronous; we could expose a sync API like:

```ts
export function markdownToHtml(markdown) {
  const ast = parse(markdown)
  // ...
  return render(ast)
}
```

To make our library extensible, we might allow plugins to register hooks at multiple stages thoughout the process, for example:

```ts
export interface Plugin {
  preprocess: (markdown: string) => string
  transform: (ast: AST) => AST
  postprocess: (html: string) => string
}

export function markdownToHtml(markdown, plugins) {
  for (const plugin of plugins) {
    markdown = plugin.preprocess(markdown) // [!code hl]
  }
  let ast = parse(markdown)
  for (const plugin of plugins) {
    ast = plugin.transform(ast) // [!code hl]
  }
  let html = render(ast)
  for (const plugin of plugins) {
    html = plugin.postprocess(html) // [!code hl]
  }
  return html
}
```

Great, now we have a plugin system. However, having `markdownToHtml` as a synchronous function essentially limits all plugin hooks to be synchronous as well. This limitation can be quite restrictive. For instance, consider a plugin for syntax highlighting. In many cases, the best results for syntax highlighting might require asynchronous operations, such as fetching additional resources or performing complex computations that are better suited for non-blocking execution.

To accommodate such scenarios, we need to allow <span text-rose>async hooks</span> in our plugin system. This means that our main function, `markdownToHtml`, as the caller of the plugin hooks must also be async. We could implement it like this:

```ts
// [!code word:Promise]
// [!code word:async]
// [!code word:await]
export interface Plugin {
  preprocess: (markdown: string) => string | Promise<string>
  transform: (ast: AST) => AST | Promise<AST>
  postprocess: (html: string) => string | Promise<string>
}

export async function markdownToHtml(markdown, plugins) { // [!code hl]
  for (const plugin of plugins) {
    markdown = await plugin.preprocess(markdown) // [!code hl]
  }
  let ast = parse(markdown)
  for (const plugin of plugins) {
    ast = await plugin.transform(ast) // [!code hl]
  }
  let html = render(ast)
  for (const plugin of plugins) {
    html = await plugin.postprocess(html) // [!code hl]
  }
  return html
}
```

While this maximized the flexibility of the plugin system, this approach also **forces** all users to handle the process <span text-rose>asynchronously</span>, even in the cases where all plugins are synchronous. This is the cost of accommodating the possibility that some operations "<b important-text-purple>might be asynchronous</b>". To manage this, we often end up duplicating the logic to offer both sync and async APIs, and restrict async plugins to the async version only.

Such duplications lead to increased maintenance efforts, potential inconsistencies, and larger bundle sizes, which are not ideal for maintainers or users.

Is there a better way to handle this?

## Introducing Quansync

What if we could make our logic decoupled from the coloring problem and let the caller decide the color?

Trying to make the situation a bit better, {@sxzz} and I took inspiration from [`gensync`](https://github.com/loganfsmyth/gensync) by {@loganfsmyth} and made a package called [<code important-text-purple>quansync</code>](https://github.com/antfu-collective/quansync). Taking it even further, we are dreaming of leveraging this to create a paradigm shift in the way we write libraries in the JavaScript ecosystem.

The name <code important-text-purple>Quansync</code> is borrowed from [Quantum Mechanics](https://en.wikipedia.org/wiki/Quantum_mechanics), where particles can exist in multiple states simultaneously, known as _superposition_, and only settle into a single state when observed <span op50>(try hovering over the atom below)</span>.

<AsyncSyncQuantum />

You can think of <code important-text-purple>quansync</code> as a new type of function that can be used as both <code important-text-blue>sync</code> and <code important-text-rose>async</code> depending on the context. In many cases, our logic can escape the async inflection problem, especially when designing shared logic with optional async hooks.

<figure>
  <QuansyncGraph4 />
  <figcaption text-center>
Try hovering over either the async or sync side.<br>
Quansync functions are in purple, which can adapt to either sync or async.
  </figcaption>
</figure>

### Usage Examples

Quansync provides a single API with two overloads.

#### Wrapper API

Wrapper allows you to create a quansync function by providing a sync and an async implementation. For example:

```ts
import fs from 'find-up'
import { quansync } from 'quansync'

export const readFile = quansync({
  sync: filepath => fs.readFileSync(filepath),
  async: filepath => fs.promises.readFile(filepath),
})
```

```ts
const content1 = readFile.sync('package.json')
const content2 = await readFile.async('package.json')

// The quansync function itself can behave like a normal async function
const content3 = await readFile('package.json')
```

#### Generator API

Generator is where the magic happens. It allows you to create a `quansync` function by using other `quansync` functions. For example:

```ts
import { quansync } from 'quansync'

export const readFile = quansync({
  sync: filepath => fs.readFileSync(filepath),
  async: filepath => fs.promises.readFile(filepath),
})

// Create a quansync with `function*` and `yield*`
// [!code word:function*:1]
export const readJSON = quansync(function* (filepath) {
  // Call the quansync function directly
  // and use `yield*` to get the result.
  // Upon usage, it will auto select the implementation
  // [!code word:yield*:1]
  const content = yield* readFile(filepath)
  return JSON.parse(content)
})
```

```ts
// fs.readFileSync will be used under the hood
const pkg1 = readJSON.sync('package.json')
// fs.promises.readFile will be used under the hood
const pkg2 = await readJSON.async('package.json')
```

### Build-time Macros

If the `function*` and `yield*` syntax scares you a bit, {@sxzz} also made a build-time macro [`unplugin-quansync`](https://github.com/quansync-dev/unplugin-quansync) allowing you to write normal `async`/`await` syntax, and it will be transformed to the corresponding `yield*` syntax at build time.

```ts
// [!code word:quansync/macro]
import { quansync } from 'quansync/macro'

// Use async/await syntax
// They will be transformed to `function*` and `yield*` at build time
export const readJSON = quansync(async (filepath) => {
  const content = await readFile(filepath)
  return JSON.parse(content)
})

// Expose the classical sync API
export const readJSONSync = readJSON.sync
```

Thanks to [`unplugin`](https://github.com/unjs/unplugin), it can work in almost any build tool, like compiling with `unbuild` or testing with `vitest`. Please refer to [the docs](https://github.com/quansync-dev/unplugin-quansync) for more detailed setup.

## How does it Work?

[Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) in JavaScript are a powerful yet often underutilized feature. To define a generator function, you use the `function*` syntax (note that arrow functions do not support generators). Inside a generator function, you can use the `yield` keyword to pause execution and return a value. This effectively splits your logic into multiple "chunks," allowing the caller to control when to execute the next chunk.

By leveraging this behavior, we can pause execution at each `yield` point. In an asynchronous context, we can wait for the async operation to complete before resuming execution. In a synchronous context, the next chunk runs immediately. This approach offloads the coloring problem to the caller, allowing them to decide whether the function should run synchronously or asynchronously.

In fact, during the early days of JavaScript, before the `async` and `await` keywords were widely adopted, Babel used generators and `yield` to polyfill async behavior. While this technique isn't new, we believe it has significant potential to improve how we handle the coloring problem, especially in library design.

## When not to Use?

Frankly, I wish most of time you don't even need to think about it. High-level tools should support async entry points for most cases, where choice `sync` and `async` is not a problem. However, there are still many cases where in the context, it's required to be colored. In such cases, `quansync` could be a good fit for progressive and gradual adoption.

Promise in JavaScript naturally a [microtask](https://javascript.info/event-loop) that delays a tick. `yield` also introduce certain overhead ([around `~120ns` on M1 Max](https://github.com/quansync-dev/quansync#benchmark)). In performance-sensitive scenarios, you might also want to avoid using either `async`or `quansync`.

## Coloring Problem Revisited

While `quansync` doesn't completely solve the coloring problem, it provides a new perspective that simplifies managing synchronous and asynchronous code. Quansync introduces a new <span text-purple>"purple"</span> color, blending the red and blue. Quansync functions still face the coloring problem, as wrapping a function to support both sync and async requires it to be a quansync function (or generator). However, the key advantage is that a quansync function can be ["collapsed"](https://en.wikipedia.org/wiki/Wave_function_collapse) to either sync or async as needed. This allows your "colorless" logic to avoid the red and blue color inflection caused by some operations that might have a color.

## Conclusion

This is a new approach to tackling the coloring problem we are still exploring. We will slowly roll out `quansync` in our libraries and see how it improves our experience and the ecosystem. We are also
looking for feedback and contributions, so feel free to join us in the [Discord](https://chat.antfu.me) or [GitHub Discussions](https://github.com/quansync-dev/quansync/discussions) to share your thoughts.

- <GitHubLink repo="quansync-dev/quansync" />
- <GitHubLink repo="quansync-dev/unplugin-quansync" />
