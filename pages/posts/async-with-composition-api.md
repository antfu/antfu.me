---
title: Async with Composition API
description: Notes about the caveat when using async functions in Vue Composition API.
date: 2021-07-16T08:00:00.000+00:00
lang: en
duration: 17min
---

There is a major caveat when working with asynchronous functions in Vue Composition API, that I believe many of you have ever come across. I have acknowledged it for a while from somewhere, but every time I want to have a detailed reference and share to others, I can't find it's documented anywhere. So, I am thinking about writing one, with a detailed explanation while sorting out the possible solutions for you.

- [The Problem](#the-problem)
- [The Mechanism](#the-mechanism)
- [The Limitation](#the-limitation)
- [The Solutions](#the-solutions)

## The Problem

When using asynchronous `setup()`, **you have to use effects and lifecycle hooks before the first `await` statement.** ([details](https://github.com/vuejs/rfcs/discussions/234))

For example:

```ts
import { ref, watch, onMounted, onUnmounted } from 'vue'

export default defineAsyncComponent({
  async setup() {
    const counter = ref(0)

    watch(counter, () => console.log(counter.value))

    // OK!
    onMounted(() => console.log('Mounted'))

    // the await statement
    await someAsyncFunction() // <-----------

    // does NOT work!
    onUnmounted(() => console.log('Unmounted'))

    // still works, but does not auto-dispose 
    // after the component is destroyed (memory leak!)
    watch(counter, () => console.log(counter.value * 2))
  }
})
```

After the `await` statement, 

the following functions will be **limited** (no auto-dispose):

- `watch` / `watchEffect`
- `computed`
- `effect`

the following functions will **not work**:

- `onMounted` / `onUnmounted` / `onXXX`
- `provide` / `inject`
- `getCurrentInstance`
- ...

## The Mechanism

Let's take the `onMounted` API as an example. As we know, `onMounted` is a hook that registers a listener when the current component gets mounted. Notice that `onMounted` (along with other composition APIs) are **global**, for what I mean "global" is that it can be imported and called anywhere - there is **no local context** bound to it.

```ts
// local: `onMounted` is a method of `component` that bound to it
component.onMounted(/* ... */)

// global: `onMounted` can be called without context
onMounted(/* ... */)
```

So, how does `onMounted` know what component is being mounted?

Vue takes an interesting approach to solve this. It uses an internal variable to record the current component instance. There is a simplified code:

When Vue mounts a component, it stores the instance in a global variable. When hooks been called inside the setup function, it will use the global variable to get the current component instance.

```js
let currentInstance = null

// (pseudo code)
export function mountComponent(component) {
  const instance = createComponent(component)

  // hold the previous instance
  const prev = currentInstance

  // set the instance to global
  currentInstance = instance

  // hooks called inside the `setup()` will have
  // the `currentInstance` as the context
  component.setup() 

  // restore the previous instance
  currentInstance = prev 
}
```

A simplified `onMounted` implementation would be like:

```js
// (pseudo code)
export function onMounted(fn) {
  if (!currentInstance) {
    warn(`"onMounted" can't be called outside of component setup()`)
    return
  }

  // bound listener to the current instance
  currentInstance.onMounted(fn)
}
```

With this approach, as long as the `onMounted` is called inside the component `setup()`, it will be able to get the instance of the current component.

## The Limitation

So far so good, but what's wrong with asynchronous functions?

The implementation would work based on the fact that JavaScript is **single-threaded**. Single thread makes sure the following statements will be executed right next to each other, which in other words, there is no one could accidentally modify the `currentInstance` at the same time (a.k.a. it's [atomic](https://stackoverflow.com/questions/52196678/what-are-atomic-operations-for-newbies)).

```ts
currentInstance = instance
component.setup() 
currentInstance = prev 
```

The situation changes when the `setup()` is asynchronous. Whenever you `await` a promise, you can think the engine paused the works here and went to do another task. If we `await` the function, during the time period, multiple components creation will change the global variable unpredictably and end up with a mess.

```ts
currentInstance = instance
await component.setup() // atomic lost
currentInstance = prev 
```

If we don't use `await` to check the instance, calling the `setup()` function will make it finish the tasks before the first `await` statement, and the rest will be executed whenever the `await` statement is resolved.

<div class="grid grid-cols-2 gap-2 lt-sm:grid-cols-1">

```ts
async function setup() {
  console.log(1)
  await someAsyncFunction()
  console.log(2)
}

console.log(3)
setup()
console.log(4)
```

```ts
// output:
3
1
4
(awaiting)
2
```

</div>

This means, there is no way for Vue to know when will the asynchronous part been called from the outside, so there is also no way to bound the instance to the context.

## The Solutions

This is actually a limitation of JavaScript itself, unless we have some new proposal to open the gate on the language level, we have to live with it.

But to work around it, I have collected a few solutions for you to choose from based on your needs.

### Remember the Caveat and Avoid It

This is, of course, an obvious "solution". You can try to move your effect and hooks before the first `await` statement and carefully remember not to have them after that again.

Luckily, if you are using ESLint, you can have the [`vue/no-watch-after-await`](https://eslint.vuejs.org/rules/no-watch-after-await.html) and [`vue/no-lifecycle-after-await`](https://eslint.vuejs.org/rules/no-lifecycle-after-await.html) rules from [`eslint-plugin-vue`](https://eslint.vuejs.org/) enabled so it could warn you whenever you made some mistakes (they are enabled by default within the plugin presets).

### Wrap the Async Function as "Reactive Sync"

In some situations, your logic might be relying on the data that fetched asynchronously. In this way, you could consider using the [trick I have shared on VueDay 2021](/posts/composable-vue-vueday-2021#async-to-sync) to **turn your async function into a sync reactive state**.

```ts
const data = await fetch('https://api.github.com/').then(r => r.json())

const user = data.user
```

```ts
const data = ref(null)

fetch('https://api.github.com/')
  .then(r => r.json())
  .then(res => data.value = res)

const user = computed(() => data?.user)
```

This approach make the "connections" between your logic to resolve first, and then reactive updates when the asynchronous function get resolved and filled with data.

There is also some more general utilities for it from [VueUse](https://vueuse.org/):

#### [`useAsyncState`](https://vueuse.org/useAsyncState)

```ts
import { useAsyncState } from '@vueuse/core'

const { state, ready } = useAsyncState(async () => {
  const { data } = await axios.get('https://api.github.com/')
  return { data }
})

const user = computed(() => state?.user)
```

#### [`useFetch`](https://vueuse.org/useFetch)

```ts
import { useFetch } from '@vueuse/core'

const { data, isFetching, error } = useFetch('https://api.github.com/')

const user = computed(() => data?.user)
```

### Explicitly Bound the Instance

Lifecycle hooks actually accept a second argument for setting the instance explicitly.

```ts
export default defineAsyncComponent({
  async setup() {
    // get and hold the instance before `await`
    const instance = getCurrentInstance()

    await someAsyncFunction() // <-----------

    onUnmounted(
      () => console.log('Unmounted'),
      instance // <--- pass the instance to it
    )
  }
})
```

However, the downside is that this solution **does not work** with `watch` / `watchEffect` / `computed` / `provide` / `inject` as they does not accept the instance argument.

To get the effects work, you could use the [`effectScope` API](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) in the upcoming Vue 3.2.

```ts
import { effectScope } from 'vue'

export default defineAsyncComponent({
  async setup() {
    // create the scope before `await`, so it will be bond to the instance
    const scope = effectScope()

    const data = await someAsyncFunction() // <-----------

    scope.run(() => {
      /* Use `computed`, `watch`, etc. ... */
    })

    // the lifecycle hooks will not be available here,
    // you will need to combine it with the previous snippet
    // to have both lifecycle hooks and effects works.
  }
})
```

### Compile-time Magic!

In the recent [`<script setup>` proposal](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) update, a new [compile-time magic](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#top-level-await) is introduced.

The way it works is to inject a script after each `await` statement for restoring the current instance state.

```html
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

```js
import { withAsyncContext } from 'vue'

export default {
  async setup() {
    let __temp, __restore

    const post =
      (([__temp, __restore] = withAsyncContext(() =>
        fetch(`/api/post/1`).then((r) => r.json())
      )),
      (__temp = await __temp),
      __restore(),
      __temp)

    // current instance context preserved
    // e.g. onMounted() will still work.

    return { post }
  }
}
```

With it, the async functions will **just work** when using with `<script setup>`. The only shame is it does not work outside of `<script setup>`.
