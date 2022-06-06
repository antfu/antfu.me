---
title: Watch with @vue/reactivity
description: A brief intro of how it works and a guide to implementing the (missing) `watch` on your own.
date: 2020-09-18
lang: en
duration: 12min
---

[[toc]]

[As you probably know](https://twitter.com/antfu7/status/1298667080804233221), the things I excited most in Vue 3 are the [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) and the [reactivity system](https://v3.vuejs.org/guide/reactivity.html). With the Composition API we can reuse logics and states across components or even apps. What's better? The underhood reactivity system is decoupled from Vue, which means you can use it almost everywhere, even without UI.

Here are some proof of concepts for using the reactivity system outside of Vue:

- [`@vue/lit`](https://github.com/yyx990803/vue-lit) is a minimal framework wrote by Evan combining [`@vue/reactivity`](https://github.com/vuejs/core/tree/main/packages/reactivity) and [`lit-html`](https://lit-html.polymer-project.org/). It can run directly in browsers, with the almost identical experience as Vue Composition API.

- [`ReactiVue`](https://github.com/antfu/reactivue) ports Vue Composition API to React. It also provides React's lifecycles in the Vue style.

Furthermore, you can even use Vue's libraries in them. Tested with [`VueUse`](https://github.com/antfu/vueuse) and [`pinia`](https://github.com/posva/pinia) in [`ReactiVue`](https://github.com/antfu/reactivue), and they just work. You can find [more details and examples here](https://github.com/antfu/reactivue#using-vues-libraries).

I am also experimenting more possibility of Vue reactivity in other scenarios, for example [reactive file system](https://twitter.com/antfu7/status/1305313110903779330?s=20), in a project called `tive`. It's currently a WIP private repo, but keep tuned, I get more to come 😉!

## Understanding `@vue/reactivity`

"reactive objects" returned by `ref()` or `reactive()` are actually [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Those proxies will trigger some actions to track the changes on properties accessing or writing.

For a simplified example, 

```ts
const reactive = (target) => new Proxy(target, {
  get(target, prop, receiver) {
    track(target, prop)
    return Reflect.get(...arguments) // get the original data
  },
  set(target, key, value, receiver) {
    trigger(target, key)
    return Reflect.set(...arguments) // set the original data
  }
})

const obj = reactive({
  hello: 'world'
})

console.log(obj.hello) // `track()` get called
obj.hello = 'vue' // `trigger()` get called
```

So in this way, vue can be notified when those properties get accessed or when they be modified.

> For more detailed explanations, check out the [official docs](https://v3.vuejs.org/guide/reactivity.html#what-is-reactivity)

### Computed

Since we are able to know those events, we can start diving into the `computed` which is where the "reactive" magic start shining.

`computed` is like a getter that auto collects the reactive dependencies source and auto re-evaluate when they get changed.

For example,

```ts
const counter = ref(1)
const multiplier = ref(2)

const result = computed(() => counter.value * multiplier.value)

console.log(result.value) // 2
counter.value += 1
console.log(result.value) // 4
```

To know how the `computed` work, we need to dig into the lower level API `effect` first.

## Effect

`effect` is a new API introduced in Vue 3. Underneath, it's the engine powers the "reactivity" in `computed` and `watch`. For the most of the time, you don't need to directly use it. But knowing it well helps you understand the reactivity system much easier.

`effect` takes the first argument as the `getter` and a second argument for the options. The `getter` is the function that collect its deps on each run via their `track()` hooks. The field `scheduler` in options provides a way to invoke a custom function when the deps change.

So basically, you can write a simple `computed` on your own like:

```ts
const computed = (getter) => {
  let value
  let dirty = true
  
  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true // deps changed
    }
  })
  
  // return should be a `Ref` in real world, simplified here
  return {
    get value() {
      if (dirty) {
        value = runner() // re-evaluate
        dirty = false
      }
      return value
    }
  }
}
```

If you really interested in how it works in Vue, check out [the source code here](https://github.com/vuejs/core/blob/main/packages/reactivity/src/computed.ts)

## Build yourself a `watch`

We have done the most important APIs in `@vue/reactivity` now, which is `ref` `reactive` `effect` `computed`.

Oh wait, we are missing the `watch` here!

```js
import { watch } from '@vue/reactivity' // does NOT exist!
```

If you take a look at Vue 3's source code, you will find that `watch` is actually [implemented in `@vue/runtime-core`](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiWatch.ts), along with the Vue's component model and lifecycles. The main reason for this is that `watch` is deep bound with the component's lifecycles (auto dispose, invalidate, etc.). But it shouldn't be the thing to keep you from using it outside of Vue.

Let's implement the `watch` our own!

### The Basic

Let's take a look at Vue's watch interface first

```ts
const count = ref(0)

watch(
  () => count.value,
  (newValue) => {
    console.log(`count changed to: ${newValue}!`)
  }
)

count.value = 2
// count changed to: 2!
```

With the knowledge of `effect`, it's quite straight forward to implement

```ts
const watch = (getter, fn) => {
  const runner = effect(getter, {
    lazy: true,
    scheduler: fn
  }
  
  // a callback function is returned to stop the effect
  return () => stop(runner)
}
```

Watch is lazy by default in Vue, you can add the third options to give control to the users.

### Watch for Ref

You may also notice that the Vue's `watch` also allows passing the ref directly to it.

```ts
watch(
  count,
  () => { /* onChanged */ }
)
```

For that, just wrap it into a getter will do

```ts
const watch = (source, fn) => {
  const getter = isRef(source)
    ? () => source.value
    : source

  const runner = effect(getter, {
    lazy: true,
    scheduler: fn
  }

  return () => stop(runner)
}
```

### Watch Deeply

One other great feature about `watch` is that it allows you to watch on deep changes.

```ts
const state = reactive({
  info: {
    name: 'Anthony',
  }
})

watch(state, () => { console.log('changed!') }, { deep: true })

state.info.name = 'Anthony Fu'
// changed!
```

To implement this feature, you need to collect the `track()` events on every nested property. We can achieve that with a `traverse` function.

```ts
function traverse(value, seen = new Set()) {
  if (!isObject(value) || seen.has(value))
    return value

  seen.add(value) // prevent circular reference 
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++)
      traverse(value[i], seen)
  }
  else {
    for (const key of Object.keys(value))
      traverse(value[key], seen)
  }
  return value
}

const watch = (source, fn, { deep, lazy = true }) => {
  let getter = isRef(source)
    ? () => source.value
    : isReactive(source) 
      ? () => source
      : source
    
  if (deep)
    getter = () => traverse(getter())
    
  const runner = effect(getter, {
    lazy,
    scheduler: fn
  }

  return () => stop(runner)
}
```

Done! The thing left to do is to polish, adding overloads to make it more flexible, add more options to get better control, and handle some edge cases. Then you should get yourself a good start for using a custom `watch`!

## Lifecycles

In Vue, `computed` and `watch` will automatically bind their `effect` runner to the current component instance. When the component get unmounted, the effects bond to it will be auto disposed. More specially, you can read [the source code here](https://github.com/vuejs/core/blob/985bd2bcb5fd8bccd1c15c8c5d89a6919fd73922/packages/runtime-core/src/apiWatch.ts#L294).

Since we don't have an instance, if you want to stop those effects, you have to do them manually. When you have multiple effects in used, to stop them together, you have to manually collect them together. One easier way is to mock similar lifecycles like Vue. This requires some amount of works, I will explain that in another blog post. Please keep tuned.

## Take Away

Thanks for reading! And hope it is helpful for you to understand and better play with the Vue reactivity system. If you want to have the `watch` outside of Vue, I made one for you (much more robust than the examples above for sure).

<pre class="block language-bash">
npm i <a href='https://github.com/antfu/vue-reactivity-watch' target='_blank'>@vue-reactivity/watch</a>
</pre> 

Have fun ;P
