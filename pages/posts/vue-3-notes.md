---
title: Vue 3 Migration Notes
date: 2020-07-01
lang: en
---

> Note: This is my personal notes/tips for migrating to Vue 3 and will be updated overtime. Please refer to [the official docs](https://v3.vuejs.org) for the complete changelog.

Sorted by the importance of my personal sense.

### 💫 use `markRaw` for vendor objects

The new reactivity system proxied the object passed to the Vue context. For vendor objects or class instances, you need to wrap it with `markRaw` in order to disable the reactivity injection.

```ts
// works in Vue 2
this.codemirror = CodeMirror.fromTextArea(el)

// in Vue 3 you need to use markRaw()
// otherwise the CodeMirror won't work as expected
this.codemirror = markRaw(CodeMirror.fromTextArea(el))
```

I think this is a pretty tricky one. You won't see any warn or error on initialization, but the internal state of the vendor object might be messed up. You might face errors that comes from the libraries while couldn't find out why (the example above took me one hour of debugging to find out).


### 💫 `.sync` → `v-model:`

`.sync` modifier is unified by `v-model:`

```html
<!-- Vue 2 -->
<Component name.sync="name"/>

<!-- Vue 3 -->
<Component v-model:name="name"/>
```

`v-model` on native element would be `value/input` while on custom components, it changed to `modelValue` and `update:modelValue`


### 💫 `shims-vue.d.ts`

> Update: now you can use [`@vuedx/typescript-plugin-vue`](https://github.com/znck/vue-developer-experience/tree/master/packages/typescript-plugin-vue) for better type inference with SFC (no need for `shims-vue.d.ts` then) 

Changed to this:

```ts
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
```
