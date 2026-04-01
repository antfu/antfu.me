---
title: Webpack 编译流程中涉及到的钩子模拟实现
date: 2022-11-14T14:47:01
lang: zh-CN
type: daily
duration: 12min
description: 深入理解 Webpack 的 tapable 钩子机制，通过代码模拟实现 SyncHook、SyncBailHook、SyncWaterfallHook 等常用同步钩子
---

[[toc]]

## tapable同步钩子简单实现

### SyncHook

同步钩子，顺序执行注册的钩子

```js
class SyncHook {
  constructor(args) {
    this._args = args
    this._taps = []
  }

  tap(type, fn) {
    this._taps.push(fn)
  }

  call(...args) {
    const newArgs = Array.from(args).slice(0, this._args.length)
    this._taps.forEach((fn) => {
      fn(...newArgs)
    })
  }
}

module.exports = SyncHook
```

### SyncBailHook

类似于 SyncHook，执行过程中注册的回调返回非 undefined 时就停止不再执行

```js
class SyncBailHook {
  constructor(args) {
    this._args = args
    this._taps = []
  }

  tap(type, fn) {
    this._taps.push(fn)
  }

  call(...args) {
    const newArgs = Array.from(args).slice(0, this._args.length)
    for (let i = 0; i < this._taps.length; i++) {
      const result = this._taps[i](...newArgs)
      if (result !== undefined) {
        break
      }
    }
  }
}

module.exports = SyncBailHook
```

### SyncLoopHook

类似 SyncBailHook，在执行过程中回调返回非 undefined 时继续再次执行当前的回调

```js
class SyncLoopHook {
  constructor(args) {
    this._args = args
    this._taps = []
  }

  tap(type, fn) {
    this._taps.push(fn)
  }

  call(...args) {
    const newArgs = Array.from(args).slice(0, this._args.length)
    let result = null
    const length = this._taps.length
    let i = 0
    let _loop = false
    do {
      _loop = false
      i = 0
      do {
        result = this._taps[i](...newArgs)
        if (result !== undefined) {
          _loop = true
        }
        else {
          i++
        }
      } while (i < length && !_loop)
    } while (_loop)
  }
}

module.exports = SyncLoopHook
```

### SyncWaterfallHook

接受至少一个参数，上一个注册的回调返回值会作为下一个注册的回调的参数

```js
class SyncWaterfallHook {
  constructor(args) {
    this._args = args
    this._taps = []
  }

  tap(type, fn) {
    this._taps.push(fn)
  }

  call(...args) {
    if (args.length < 1) {
      return
    }
    const newArgs = Array.from(args).slice(0, this._args.length)
    let result = null
    let post = newArgs[0]
    this._taps.forEach((fn) => {
      result = fn(post, ...newArgs.slice(1))
      post = result || post
    })
  }
}

module.exports = SyncWaterfallHook
```
