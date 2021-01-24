---
draft: false
title: Type Inferencing in Vue
date: 2020-06-28
hero_image: ''
lang: en
---

As you may or may not know, I am working on preparing to release the v1.0 version for [@vue/composition-api](https://github.com/vuejs/composition-api) recently. One of the current problems is that the type inference does not play well, [#338](https://github.com/vuejs/composition-api/issues/338). So I get a chance to have a deeper look at [vue-next](https://github.com/vuejs/composition-api)'s type implementations. I will tell you what I learned and how the magic works in Vue.

Forget about the `setup()` function and `Composition API` for now, let talk about the options API in Vue 2 that everybody familiar with. In a classical example, we would have `data`, `computed`, `methods` and some other fields like this:

```js
export default {
  data: {
    first_name: "Anthony",
    last_name: "Fu",
  },
  computed: {
    full_name() {
      return this.first_name + " " + this.last_name;
    },
  },
  methods: {
    hi() {
      alert(this.full_name);
    },
  },
};
```

It works well in Javascript and putting all the context into `this` is pretty straight forward and easy to understand. But when you switch to TypeScript for static type checking. `this` will not be the context you expected. How can we make the types work for Vue like the example above?

## Type for `this`

To explicitly assign type to `this`, we can simpily use the `this parameter`:

```ts
interface Context {
  $injected: string
}

function bar(this: Context, a: number) {
  this.$injected // ok
}
```

The limitation of this approach is that we will lose the methods signature when working with a dict of methods:

```ts
type Methods = Record<string, (this: Context, ...args:any[]) => any>

const methods: Methods = {
  bar(a: number) {
    this.$injected // ok
  }
}

methods.bar('foo', 'bar') // no error, the type of arguments becomes `any[]`
```

We would not want to ask users to explicitly type `this` in every methods in order to make the type checking works.
So we will need another approach. 

### [`ThisType<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet)

After digging into the Vue's code, I found an interesting TypeScirpt utility `ThisType<T>`. The official doc says:

> This utility does not return a transformed type. Instead, it serves as a marker for a contextual `this` type.

`ThisType` would affect all the nested functions. With it, we can have:

```ts
type Methods = {
  double: (a: number) => number
  deep: {
    nested: {
      half: (a: number) => number
    }
  }
}

const methods: Methods & ThisType<Methods & Context> = {
  double(a: number) {
    this.$injected // ok
    return a * 2
  },
  deep: {
    nested: {
      half(a: number) {
        this.$injected // ok
        return a / 2
      }
    }
  }
}

methods.double(2) // ok
methods.double('foo') // error
methods.deep.nested.half(4) // ok
```

The typing works well, but it still requires users to define the type interface of Methods first. Can we make it infers itself automatically?

We can do that with function inference:

```ts
type Options<T> = {
  methods?: T 
} & ThisType<T & Context>

function define<T>(options: Options<T>) {
  return options
}

define({
  methods: {
    foo() {
      this.$injected // ok
    },
  },
})
```

> The inference graph would be like
>
> TODO: draw a graph

Cool. There is only one step left, to make context object dynamic inference from `data` and `computed`.


The full working demo would be:

```ts
/* ---- Type ---- */
export type ExtractComputedReturns<T extends any> = {
  [key in keyof T]: T[key] extends (...args: any[]) => infer TReturn
    ? TReturn
    : never
}

type Options<D = {}, C = {}, M = {}> = {
  data: () => D
  computed: C
  methods: M
  mounted: () => void
  // and other options
} 
& ThisType<D & M & ExtractComputedReturns<C>> // merge them together

function define<D, C, M>(options: Options<D, C, M>) {}

/* ---- Usage ---- */
define({
  data() {
    return {
      first_name: "Anthony",
      last_name: "Fu",
    }
  },
  computed: {
    fullname() {
      return this.first_name + " " + this.last_name
    },
  },
  methods: {
    notify(msg: string) {
      alert(msg)
    }
  },
  mounted() {
    this.notify(this.fullname)
  },
})
```
