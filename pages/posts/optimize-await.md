---
title: Optimize Await
date: 2021-07-01T16:00:00Z
lang: en
duration: 8min
type: note
---

`async` / `await` in ES7 is truly a life-saver for the JavaScript world. It allows you to avoid [callback hell](http://callbackhell.com/) in your code and make it more readable. However, a common pitfall is that when you `await` a huge asynchronous task that takes very long time, it blocks the following code and could potentially make your app slow.

For example:

```ts
const app = await createServer()
const middlewareA = await resolveMiddlewareA()
const middlewareB = await resolveMiddlewareB()

app.use(middlewareA)
app.use(middlewareB)
```

We have used three `await` in the example, while the three async function does not actually relying on each other, having them sequentially we are possibility wasted some time of the operations that could be parallelized (IO, Network, etc.)

So we can use [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) to optimize the code:

```ts
const [app, middlewareA, middlewareB] = await Promise.all(
  [
    createServer(),
    resolveMiddlewareA(),
    resolveMiddlewareB(),
  ],
)

app.use(middlewareA)
app.use(middlewareB)
```

In another example, you might relying on the async result, but sometime not that urgent:

```ts
async function createPlugin() {
  const toolkit = await initToolKit()

  return {
    onHookA() {
      toolkit.invokeA()
    },
    onHookB() {
      toolkit.invokeB()
    },
  }
}

const plugin = await createPlugin()
```

Even though you don't need `toolkit` immediately, you are still forced to use `async function` because the `initToolKit` is async. To avoid this, we could make the promise been resolved in the hooks instead

```ts
function createPlugin() {
  const toolkitPromise = initToolKit()

  return {
    async onHookA() {
      const toolkit = await toolkitPromise
      toolkit.invokeA()
    },
    async onHookB() {
      const toolkit = await toolkitPromise
      toolkit.invokeB()
    },
  }
}

// now it's sync!
const plugin = createPlugin()
```

Since a Promise could only [be resolved once](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#description), using multiple `await` for a single Promise instance is [totally fine](https://blog.ashleygrant.com/2020/04/30/resolved-javascript-promises-can-be-used-multiple-times/) - it will return the resolved result immediate if the Promise is allready settled.

To be more generalized, we could have an utility function like:

```ts
export function createSingletonPromise<T>(fn: () => Promise<T>) {
  let _promise: Promise<T> | undefined

  return () => {
    if (!_promise)
      _promise = fn()
    return _promise
  }
}
```

This function is also available in my utilities collection [`@antfu/utils`](https://github.com/antfu/utils)
