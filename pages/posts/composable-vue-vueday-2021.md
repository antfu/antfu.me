---
title: Composable Vue - VueDay 2021
description: Slides & transcript for my talk at VueDay 2021
date: 2021-04-28T16:00:00.000+00:00
lang: en
type: talk
recording: true
duration: 30min
---

[[toc]]

> This is the transcript of my talk **Composable Vue** at [VueDay 2021](https://2021.vueday.it/)
>
> Slides: [PDF](https://antfu.me/talks/2021-04-29) | [SPA](https://talks.antfu.me/2021/composable-vue)
> 
> Recording: [YouTube](https://youtu.be/IMJjP6edHd0)
> 
> Made with <Slidev class="inline"/>  [**Slidev**](https://github.com/slidevjs/slidev) - a slides maker for developers that I am working on recently.


My sharing today is Composable Vue, some pattens and tips that might be able to help you writing better composable logic in Vue.

## [VueUse](https://vueuse.org/)

It all started with me made this project called VueUse, which is a collection of Vue composable utilities. Initially, I was making this to share some of the functions I wrote with Vue Composition API to be used across apps. Till now, it grows much bigger with the community, we are now an organization on GitHub with 9 team members, 8 add-ons packages for different integrations like motions and document head management. We also have more than 100 functions in the core package that work for both Vue 2 and 3. I have really appreciated all the contributors and the awesome community.

<carbon-logo-github class="inline-block"/> <a href="https://github.com/vueuse/vueuse" target="_blank">vueuse/vueuse</a>

In today's talk, I will share with you the patterns and tips that I have learned during developing VueUse and using it to make apps in Composition API.

## Composition API 

Let's have a quick look at the Composition API itself. BTW, please note today's talk will be a little bit advanced, which I would assume you already have a basic knowledge of what the Vue Composition API is. But don't worry if you don't, I believe you will still get some basic images of the methodology and you can also find the slides and transcript on my site after the talk.

### Ref vs Reactive <MarkerCore/>

Well, let's start with Ref and Reactive. I bet many of you have wondered the difference between them and which one should you choose. 

You can think refs as variables and reactives as objects. When you do the assignment, one is assigning "value" while the other one is assigning properties. While the usage of them can really dependents on what you gonna use them, but if we really need to pick one from them, I'd say go with `ref` whenever you can.

With `ref`, you will need to use `.value` to access and assigning values, but this also gives you more explicit awareness of when you are tracking and triggering the reactivity system. 

```ts
import { ref } from 'vue'

let foo = 0
let bar = ref(0)

foo = 1
bar = 1 // ts-error
```

As you can see the example here, I actually got an error by accidentally assigning ref with a value, and here I can change the code to fix it.

```ts
import { reactive } from 'vue'

const foo = { prop: 0 }
const bar = reactive({ prop: 0 })

foo.prop = 1
bar.prop = 1
```

On the other hand, when using `reactive` you actually can't tell the difference between a plain object and a reactive object without looking for the context, which could sometimes make the debugging a little bit harder.

Also note in reactive objects, there are several caveats you need to take care about. Like you can't do object destructure without `toRefs` otherwise they will lose the reactivity. And you will also need to wrap with a function when using with `watch` and so on, where `ref` does not have such limitations.

### Ref Auto Unwrapping <MarkerCore />

When using with `refs`, a big obstacle that people facing is the annoying `.value`. But actually, in many cases, you can omit it and make your code looks cleaner.

```ts
const counter = ref(0)

watch(counter, (count) => {
  console.log(count) // same as `counter.value`
})
```

The `watch` function accepts ref as the watch source directly, and it will return the unwrapped new value of the ref in the callback. So in this case, there is zero `.value` needed.

```html
<template>
  <button @click="counter += 1">
    Counter is {\{ counter }}
  </button>
</template>
```

The other one is the nature of Vue, in the template, all the refs are auto unwrapped, even assignments!

```ts
import { reactive, ref } from 'vue'
const foo = ref('bar')
const data = reactive({ foo, id: 10 })
data.foo // 'bar'
```

And whenever you feel like to better work with objects, you can pass the ref into the reactive object, and when you access the property, reactive will unwrap the ref automatically for you. Changes to the original ref will also reflect to the reactive object!

### `unref` - Oppsite of Ref <MarkerCore />

`unref` is another Composition API I would like to introduce. As the name `unref` sounds, it's kinda the opposite of ref. While the `ref()` function takes a value and turns it into a ref, `unref()` takes a ref and returns its value. 

```ts
function unref<T>(r: Ref<T> | T): T {
  return isRef(r) ? r.value : r
}
```

The interesting part of it is that if you pass a plain value to `unref` it will return the value as-is to you, you can see the implementation is basically this.

```ts
import { ref, unref } from 'vue'

const foo = ref('foo')
unref(foo) // 'foo'

const bar = 'bar'
unref(bar) // 'bar'
```

This is not a big feature, but a good tip to unify your logic which I will show you soon

## Patterns & Tips

That's the tips for using ref and reactive. Here I'd like to share with you some patterns of writing composable functions.

## What's composable Functions

So what's composable functions?

It's actually kind of hard to give a proper definition, but I'd think it's like sets for reusable logic to make your code better organized, and separate the concerns.


```ts
export function useDark(options: UseDarkOptions = {}) {
  const preferredDark = usePreferredDark() // <--
  const store = useStorage('vueuse-dark', 'auto') // <--

  return computed<boolean>({
    get() {
      return store.value === 'auto'
        ? preferredDark.value
        : store.value === 'dark'
    },
    set(v) {
      store.value = v === preferredDark.value
        ? 'auto'
        : v ? 'dark' : 'light'
    },
  })
}
```

Here is an example, the `useDark` function in VueUse is provided as a simple toggle to enable or disable the dark mode for apps. There are actually two variables involved, one is the system's preference and one is users' manual overrides. System preference can be got using media queries, while we would also need to use localStorage to read and store the user's preference of different modes.

<DarkToggleButton/>

As you can see in this code snippet, I have used two other composable functions [`usePreferredDark`](https://vueuse.org/usePreferredDark) and [`useStorage`](https://vueuse.org/useStorage), they will return two refs that reflecting on their states. Detailed things like monitoring the media query changes, the timing to read and write the storage are left to them. And all I need to do is logically composing their relationship into a single ref.

You can see the full code or directly use it in VueUse with the link below.

<VueUseFn name="useDark"/>

### Think as "Connections"

The first methodology I want to share today is to think as "connections". Unlike hooks in React that will run on each updates, the `setup()` function in Vue only runs **once** on component initialization, to construct the relations between your state and logic.

You can think the equations in mathematics, where the left hand side and right hand side are always equal. Here we have `z=x^2+y^2`, while `x` and `y` are independent variables, and `z` is a controlled variables relying on `x` and `y`. Whenever I changed any of them, `z` will be updated accordingly (DEMO). Which is also similar to the formula in spreadsheets.

So in composable functions, we could think arguments are input and the returns as the output. The output should be able to reflect on input changes automatically. A bit complicated? I will walk with you on that later with examples.

### One Thing at a Time

Another aspect is to do one thing at a time - which is the same as how you write any code. No need for me to spend too much time on this, but basically they are listed here.

- Extract duplicated logics into composable functions
- Have meaningful names
- Consistent naming conversions - `useXX` `createXX` `onXX`
- Keep function small and simple
- "Do one thing, and do it well"

Note it's also important to have a consistent naming conversion, like prefixed with `useXX` or `createXX` and so on to make those composable functions distinguishable from other functions.

### Passing Ref as Arguments

Alright, let's start our first pattern today - Passing refs as arguments.

```ts
function add(a: number, b: number) {
  return a + b
}
```

```ts
const a = 1
const b = 2

const c = add(a, b) // 3
```

Here we have a plain add function that sums up the two arguments `a` and `b`. You can also see the example on the right.

```ts
function add(a: Ref<number>, b: Ref<number>) {
  return computed(() => a.value + b.value)
}
```

```ts
const a = ref(1)
const b = ref(2)

const c = add(a, b)
c.value // 3
```

And then we can make this function accepting refs, and return a computed ref with their sum. Then we can pass the refs to it as we normally would with plain values. The difference here is that the returned value is also a ref, but it will always be up-to-date with the ref `a` and `b`.

```ts
function add(
  a: Ref<number> | number,
  b: Ref<number> | number
) {
  return computed(() => unref(a) + unref(b))
}
```

```ts
const a = ref(1)

const c = add(a, 5)
c.value // 6
```

And remember the `unref` function we mentioned before? We can actually make this function more flexible, by accepting both refs and plain values. And use `unref` to get their values. We can also make the addition possible between a ref and a value.

### MaybeRef

```ts
type MaybeRef<T> = Ref<T> | T
```

Here is a simple TypeScript's type helper called `MaybeRef` that we have used a lot in VueUse. It's a union of generic `T` and `Ref<T>`.


```ts
export function useTimeAgo(
  time: Date | number | string | Ref<Date | number | string>,
) {
  return computed(() => someFormating(unref(time)))
}
```

```ts
import type { Ref } from 'vue'
import { computed, unref } from 'vue'

type MaybeRef<T> = Ref<T> | T

export function useTimeAgo(
  time: MaybeRef<Date | number | string>,
) {
  return computed(() => someFormating(unref(time)))
}
```

In this case, we have the function useTimeAgo that accepts a wide range of Date-like types as an argument. Normally if you want to accept refs, you would need to write them again as Ref versions. With this helper, you can make the type shorter and more readable (change code). A cool point it that this works great with `unref`, it can infer the correct type for `MaybeRef`.

### Make it Flexible <MarkerPattern />

Think your functions like LEGO, there should have many different ways of composing them for different needs.

```ts
import { useTitle } from '@vueuse/core'

const title = useTitle()

title.value = 'Hello World'
// now the page's title changed
```

Here we take `useTitle` function from VueUse as an example. Basically when you call it, you will get a special ref that binds to your page's title. Whenever you change the ref's value, the page's title will also be updated. Similarly, when the page's title changed externally, the change will also be reflect to the ref's value.

Looks good, right? But It creates a new ref whenever you call it. To make it more flexible, we can actually bind an existing ref, even computed!

```ts
import { computed, ref } from 'vue'
import { useTitle } from '@vueuse/core'

const name = ref('Hello')
const title = computed(() => {
  return `${name.value} - World`
})

useTitle(title) // Hello - World

name.value = 'Hi' // Hi - World
```

Here you can see, I constructed a computed with a ref, when I change the source ref, the computed get re-evaluated so as the page's title.


### `useTitle` <Marker class="text-blue-400">Case</Marker>

You must be wondering how could this be implemented. Let's take a look at a simplified version of it.

```ts
import { ref, watch } from 'vue'
import type { MaybeRef } from '@vueuse/core'

export function useTitle(
  newTitle: MaybeRef<string | null | undefined>
) {
  const title = ref(newTitle || document.title) // <-- 1

  watch(title, (t) => { // <-- 2
    if (t != null)
      document.title = t
  }, { immediate: true })

  return title
}
```

It's actually only two statements! How?

At the first line, unified the ref from the user, or create a new one. And on the second line, it watches the changes to the ref and sync up with page's title.

Emm, maybe it's a little bit hard to catch on what's happened in the first line, let me explain a bit.

<VueUseFn name="useTitle"/>

### Reuse Refs <MarkerCore />

Here, we utilized an interesting behavior of the ref function.

Similar to `unref` - `ref` also checks whether the passed value is ref or not. If you passed a ref to it, it will it as-is - since it's already a ref, there is no need to make another.


```ts
const foo = ref(1) // Ref<1>
const bar = ref(foo) // Ref<1>

foo === bar // true
```

```ts
function useFoo(foo: Ref<string> | string) {
  // no need!
  const bar = isRef(foo) ? foo : ref(foo)

  // they are the same
  const bar = ref(foo)

  /* ... */
}
```

This could also be extremely useful in composable functions that take `MaybeRef` as argument types.

### `ref` / `undef`

Let's do a quick summary so far. 

- `MaybeRef<T>` works well with `ref` and `unref`.
- Use `ref()` when you want to normalized it as a Ref.
- Use `unref()` when you want to have the value.

```ts
type MaybeRef<T> = Ref<T> | T

function useBala<T>(arg: MaybeRef<T>) {
  const reference = ref(arg) // get the ref
  const value = unref(arg) // get the value
}
```

We can use `MaybeRef` in arguments to make the function flexible, and use `ref()` when you want to normalized it as a Ref and use `unref()` when you want to get the value. Both of them are universal and no conditions needed.

### Object of Refs <MarkerPattern />

Another pattern today is to use objects of refs. When you need to return multiple data entries in a composable function, consider returns an object composed by refs. 

```ts
import { reactive, ref } from 'vue'

function useMouse() {
  return {
    x: ref(0),
    y: ref(0)
  }
}

const { x, y } = useMouse()
const mouse = reactive(useMouse())

mouse.x === x.value // true
```

In this way, users can have the full features of ES6 object destructure. The restructure values are refs, so the reactivity still remains, and users can also rename them, or take only partial of what they want.

On this other hand, it's also flexible enough when users want to use it as a single object, simply wrap it with the reactive function, the refs will get unwrapped as a property automatically.

That said, users can get benefits from both `ref `and `reactive` as need.

### Async to "Sync" <MarkerTips />

Since we are constructing "connections" using Composition API, we can actually make async functions to "sync" by building the connections first before it resolves.

```ts
const data = await fetch('https://api.github.com/').then(r => r.json())

// use data
```

Let's say we want to request some data use the `fetch` API. Normally we need to `await` the request been responded and data been parsed, before we can use the data. With Composition API, we can make the data as a ref of null, then be fulfilled later.

```ts
const { data } = useFetch('https://api.github.com/').json()

const user_url = computed(() => data.value?.user_url)
```

This can make your apps take the time to handle other stuff while waiting for the data to be fetched. The idea is similar to react's stale-while-revalidate, but with much easier implementation.

### `useFetch` <Marker class="text-blue-400">Case</Marker>

The implementation can be simplified down to this, all you have to do is to assign the value to `ref` when the promise got resolved. 

```ts
export function useFetch<R>(url: MaybeRef<string>) {
  const data = shallowRef<T | undefined>()
  const error = shallowRef<Error | undefined>()

  fetch(unref(url))
    .then(r => r.json())
    .then(r => data.value = r)
    .catch(e => error.value = e)

  return {
    data,
    error
  }
}
```

In the real world, we might also need some flags to show the current state of the request, where you can find the full code in VueUse.

<VueUseFn name="useFetch"/>

### Side-effects Self Cleanup <MarkerPattern />

`watch` and `computed` functions in Vue will stop themselves automatically along with the components unmounting. We'd recommend following the same pattern for your custom composable functions.

By calling the `onUnmounted` hooks inside your composable functions, you can schedule the effect clean-up logic.

```ts
import { onUnmounted } from 'vue'

export function useEventListener(target: EventTarget, name: string, fn: any) {
  target.addEventListener(name, fn)

  onUnmounted(() => {
    target.removeEventListener(name, fn) // <--
  })
}
```

For example, it's common to use `addEventListener` to register the handler to DOM events. When you finish the usage, you would also need to remember to unregister it using `removeEventListener`. In this case, we can have a function `useEventListener` that unregister itself along with the component so you don't need to worry about it anymore.

<VueUseFn name="useEventListener"/>

### `effectScope` RFC <Marker class="text-purple-400">Upcoming</Marker>

While side-effects auto clean-up is nice, sometimes you might want to have better controls over when to do that. I drafted an RFC proposing a new API called `effectScope` to collect those effects into a single instance, that you can stop them together at the time you want. This is likely to be implemented and shipped with Vue 3.1. Check out for more details if it get you interested.

```ts
// effect, computed, watch, watchEffect created inside the scope will be collected

const scope = effectScope(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(double.value))

  watchEffect(() => console.log('Count: ', double.value))
})

// dispose all effects in the scope
stop(scope)
```

### Typed Provide / Inject

We have a set of new APIs called `provide` and `inject`. It's basically for sharing some context for the component's children to consume and reuse. They are two separate function, which means TypeScript can't actually infer the types for each context automatically.

But here we have a solution for that. Vue provided a type helper called `InjectionKey` where you can define a symbol that carries the type you want, and then it will hint `provide` and `inject` to have proper autocompletion and type checking.

```ts
// context.ts
import type { InjectionKey } from 'vue'

export interface UserInfo {
  id: number
  name: string
}

export const injectKeyUser: InjectionKey<UserInfo> = Symbol()
```

For example, here I defined an interface `UserInfo` which contains two properties. And I exported a symbol with the `InjectionKey` type.

```ts
// parent.vue
import { provide } from 'vue'
import { injectKeyUser } from './context'

export default {
  setup() {
    provide(injectKeyUser, {
      id: '7', // type error: should be number
      name: 'Anthony'
    })
  }
}
```

In usage, I can use the `provide` function to provide the data with key. Can you see here I get a type error that the id should be a number. So I can catch up the error right away before it goes to production.

```ts
// child.vue
import { inject } from 'vue'
import { injectKeyUser } from './context'

export default {
  setup() {
    const user = inject(injectKeyUser)
    // UserInfo | undefined

    if (user)
      console.log(user.name) // Anthony
  }
}
```

And in the child component, we can use the `inject` function with the key as well. You can see it correctly infers the type `UserInfo` and so as its property.

### Shared State <MarkerPattern />

With the flexibility of Vue's Composition API, sharing state is actually quite simple. 

```ts
// shared.ts
import { reactive } from 'vue'

export const state = reactive({
  foo: 1,
  bar: 'Hello'
})
```

You can declare some ref or reactive state in a js module, and import them to your components. Since they are using the same instance, the state will be just in sync.


```ts
// A.vue
import { state } from './shared.ts'

state.foo += 1
```

```ts
// B.vue
import { state } from './shared.ts'

console.log(state.foo) // 2
```

But please note this is actually not SSR compatible. In SSR your server will create a new app on each request, where this approach will keep the state persistent across multiple rendering. And normally it's not what we would expect.

### Shared State (SSR friendly) <MarkerPattern />

Let's see if we can make a solution for it to work with SSR.

```ts
export const myStateKey: InjectionKey<MyState> = Symbol()

export function createMyState() {
  const state = {
    /* ... */
  }

  return {
    install(app: App) {
      app.provide(myStateKey, state)
    }
  }
}

export function useMyState(): MyState {
  return inject(myStateKey)!
}
```

By using `provide` and `inject`, to share the state one the App context, which means it will be created every time when the server doing the rendering. You can see here I have two function, `createMyState` and `useMyState`. `createMyState` will returns a Vue plugin that provide the state to the App. While `useMyState` is just a wrapper of `inject` using the same key.

```ts
// main.ts
const App = createApp(App)

app.use(createMyState())
```

```ts
// A.vue

// use everywhere in your app
const state = useMyState()
```

In usage, we can create the state in the main entry and pass it to `app.use`. Then you can use the hook `useMyState` everywhere in your components.

If you have ever tried Vue Router v4, it actually uses a similar method to do that like `createRouter` and `useRouter.

### useVModel <MarkerTips />

One last tip I'd like to share is a utility called `useVModel`. 

```ts
export function useVModel(props, name) {
  const emit = getCurrentInstance().emit

  return computed({
    get() {
      return props[name]
    },
    set(v) {
      emit(`update:${name}`, v)
    }
  })
}
```

It's just a simple wrapper to the component model to bind with `props` and `emit`. This is actually a lifesaver to me.

```ts
export default defineComponent({
  setup(props) {
    const value = useVModel(props, 'value')

    return { value }
  }
})
```

We can take a look at the code, you can see we used a writable computed. When accessing the value, we forward the value of props to it, and when writing, we emit out the update event automatically so you can use just like a normal ref.


```html
<template>
  <input v-model="value" />
</template>
```

Even more, we can actually bind into our children elements's `v-model` very easily.

<VueUseFn name="useVModel"/>

## Vue 2 & 3

That's all the tips and patterns I have for today.

As you might think those are for Vue 3 only, but actually they also applies for Vue 2!


### `@vue/composition-api` <Marker class="text-teal-400">Lib</Marker>

In case you didn't know that, if you are still on Vue 2 but want to start using the Composition API, here we offered an official plugin that enables the Composition API for your Vue 2 app. Give it a try if you haven't.

<carbon-logo-github class="inline-block"/> <a href="https://github.com/vuejs/composition-api" target="_blank">vuejs/composition-api</a>

```ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

```ts
import { reactive, ref } from '@vue/composition-api'
```

### Vue 2.7 <Marker class="text-purple-400">Upcoming</Marker>

We also announced [our plan for Vue 2.7](https://github.com/vuejs/rfcs/blob/ie11/active-rfcs/0000-vue3-ie11-support.md#for-those-who-absolutely-need-ie11-support) recently. Vue 2.7 will be the last minor version of Vue 2 with long time support for existing projects and those who still need IE 11 support. We will back-port Vue 3's new features to Vue 2.7 and migrate the `@vue/compositon-api` plugin into it. Stay tuned on that.

- Backport `@vue/composition-api` into Vue 2's core.
- `<script setup>` syntax in Single-File Components.
- Migrate codebase to TypeScript.
- IE11 support.
- LTS.

### Vue Demi <Marker class="text-teal-400">Lib</Marker>

If you are a library author want your libraries to support Vue 2 and 3 with the same codebase. You can try Vue Demi, which eases out the difference between Vue 2 and 3 and auto-detects users' environment.

<carbon-logo-github class="inline-block"/> [vueuse/vue-demi](https://github.com/vueuse/vue-demi)

```ts
// same syntax for both Vue 2 and 3
import { defineComponent, reactive, ref } from 'vue-demi'
```

## Thank you!

That's all for today.

Due to the time limit, it's a shame that I can not share all I have learned with you. As the Vue composition API is still fairly new, I believe there are more patterns and better practices for us to found.

To find more information, do check out the [VueUse org on GitHub](https://github.com/vueuse) and [its awesome ecosystem](https://vueuse.org/add-ons.html), and follow us on Twitter [@vueuse](https://twitter.com/vueuse) to keep up-to-date with news and tips.

Thank you!

<p align="center">
  <a href="https://github.com/sponsors/antfu#sponsors">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'>
  </a>
</p>
