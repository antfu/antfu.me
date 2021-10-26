---
title: Destructuring... with object or array?
description: Prefer object destructure or array? Can we support both?
lang: en
date: 2020-10-21T16:00:00.000Z
duration: 8min
image: '/images/destructuring.png'
---

[[toc]]

> [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) is a JavaScript language feature introduced in ES6 which I would assume you already familiar with it before moving on.

We see it quite useful in many scenarios, for example, value swapping, named arguments, objects shallow merging, array slicing, etc. Today I would like to share some of my immature thoughts on "destructuring" in some web frameworks.

I am a Vue enthusiast for sure and I wrote a lot of my apps using it. And I did write React a while for my previous company ~~reluctantly~~. As the Vue 3.0 came out recently, its exciting Composition API provides quite similar abilities for abstracting. Inspired by [react-use](https://github.com/streamich/react-use), I wrote a composable utility collection library early this year called [VueUse](https://github.com/antfu/vueuse).

Similar to React hooks, Vue's composable functions will take some arguments and returns some data and functions. JavaScript is just like other C-liked programming languages - only one return value is allowed. So a workaround for returning multiple values, we would commonly wrap them with an array or an object, and then destructure the returned arrays/objects. As you can already see, we are having two different philosophies here, using arrays or objects.

## Destructuring Arrays / Tuples

In React hooks, it's a common practice to use array destructuring. For example, built-in functions:

```ts
const [counter, setCounter] = useState(0)
```

Libraries for React hooks would natural pick the similar philosophy, for example [react-use](https://github.com/streamich/react-use):

```ts
const [on, toggle] = useToggle(true)
const [value, setValue, remove] = useLocalStorage('my-key', 'foo')
```

The benefits of array destructuring is quite straightforward - you get the freedom to set the variable names with the clean looking.

## Destructuring Objects

Instead of returning the getter and setter in React's `useState`, in Vue 3, a `ref` is created combining the getter and setter inside the single object. Naming is simpler and destructuring is no longer needed.

```ts
// React
const [counter, setCounter] = useState(0)
console.log(counter)        // get
setCounter(counter + 1)     // set

// Vue 3
const counter = ref(0)
console.log(counter.value)  // get
counter.value++             // set
```

Since we don't need to rename the same thing twice for getter and setter like React does, in [VueUse](https://github.com/antfu/vueuse), I implemented most of the functions with object returns, like:

```ts
const { x, y } = useMouse()
```

Using objects gives users more flexibility like

```ts
// no destructing, clear namespace
const mouse = useMouse()

mouse.x
```

```ts
// use only part of the value
const { y } = useMouse()
```

```ts
// rename things
const { x: mouseX, y: mouseY } = useMouse()
```

While it's been good for different preferences and named attributes can be self-explaining, the renaming could be somehow verbose than array destructuring.

## Support Both

What if we could support them both? Taking the advantages on each side and let users decide which style to be used to better fit their needs.

I did saw one library supports such usage once but I can't recall which. However, this idea buried in mind since then. And now I am going to experiment it out.

My assumption is that it returns an object with both behaviors of `array` and `object`. The path is clear, either to make an `object` like `array` or an `array` like `object`.

### Make an object behaves like an array

The first possible solution comes up to my mind is to make an object behaves like an array, as you probably know, arrays are actually objects with number indexes and some prototypes. So the code would be like:

```ts
const data = {
  foo: 'foo',
  bar: 'bar',
  0: 'foo',
  1: 'bar',
}

let { foo, bar } = data
let [ foo, bar ] = data // ERROR!
```

But when we destructure it as an array, it will throw out this error:

```ts
Uncaught TypeError: data is not iterable
```

Before we working on how to make an object iterable, let's try the other direction first.

### Make an array behaves like an object

Since arrays are objects, we should be able to extend it, like

```ts
const data = ['foo', 'bar']
data.foo = 'foo'
data.bar = 'bar'

let [ foo, bar ] = data
let { foo, bar } = data
```

This works and we can call it a day now! However, if you are a perfectionist, you will find there is an edge case not be well covered. If we use the rest pattern to retrieve the remaining parts, the number indexes will unexpectedly be included in the rest object.

```ts
let { foo, ...rest } = data
```

`rest` will be:

```ts
{
  bar: 'bar',
  0: 'foo',
  1: 'bar'
}
```

### Iterable Object

Let's go back to our first approach to see if we can make an object iterable. And luckily, [`Symbol.iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) is designed for the task! The document shows exactly the usage, doing some modification and we get this:

```ts
const data = {
  foo: 'foo',
  bar: 'bar',
  *[Symbol.iterator]() {
    yield 'foo'
    yield 'bar'
  },
}

let { foo, bar } = data
let [ foo, bar ] = data
```

It works well but the `Symbol.iterator` will still be included in the rest pattern.

```ts
let { foo, ...rest } = data

// rest
{
  bar: 'bar',
  Symbol(Symbol.iterator): ƒ*
}
```

Since we are working on objects, it shouldn't be hard to make some properties not enumerable. By using [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) with `enumerable: false`:

```ts
const data = {
  foo: 'foo',
  bar: 'bar',
}

Object.defineProperty(data, Symbol.iterator, {
  enumerable: false,
  value: function*() {
    yield 'foo'
    yield 'bar'
  },
})
```

Now we are successfully hiding the extra properties!

```ts
let { foo, ...rest } = data

// rest
{
  bar: 'bar'
}
```

## Generator

If you don't like the usage of generators, we can implement it with pure functions, following [this article](https://itnext.io/introduction-to-javascript-iterator-eac78849e0f7#:~:text=An%20iterator%20is%20an%20object,new%20iterator%20for%20each%20call).

```ts
Object.defineProperty(clone, Symbol.iterator, {
  enumerable: false,
  value() {
    let index = 0
    let arr = [foo, bar]
    return {
      next: () => ({
        value: arr[index++],
        done: index > arr.length,
      })
    }
  }
})
```

## TypeScript

To me, it's meaningless if we could not get proper TypeScript support on this. Surprisingly, TypeScript support such usage almost out-of-box. Just simply use the [`&` operator](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#intersection-types) to make insertion of the object and array type. Destructuring will properly infer the types in both usages.

```ts
type Magic = { foo: string, bar: string } & [ string, string ]
```

## Take Away

Finally, I made it a general function to merge arrays and objects intro the isomorphic destructurable. You can just copy the TypeScript snippet below to use it. Thanks for reading through!

> Please note this does NOT support IE11. More details: [Supported browers](https://caniuse.com/?search=Symbol.iterator)

```ts
function createIsomorphicDestructurable<
  T extends Record<string, unknown>,
  A extends readonly any[]
>(obj: T, arr: A): T & A {

  const clone = { ...obj }

  Object.defineProperty(clone, Symbol.iterator, {
    enumerable: false,
    value() {
      let index = 0
      return {
        next: () => ({
          value: arr[index++],
          done: index > arr.length,
        })
      }
    }
  })

  return clone as T & A
}
```

#### Usage

```ts
const foo = { name: 'foo' }
const bar: number = 1024

const obj = createIsomorphicDestructurable(
  { foo, bar } as const,
  [ foo, bar ] as const
)

let { foo, bar } = obj
let [ foo, bar ] = obj
```
