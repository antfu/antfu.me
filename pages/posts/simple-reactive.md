---
title: 简易响应式数据实现
date: 2023-03-27T16:00:00
lang: en
type: daily
duration: 12min
description: 通过 Dep 类和 Object.defineProperty 实现一个简易的响应式数据系统，理解 Vue 等框架中数据响应式的核心原理
---

[[toc]]

```js
let data = { price: 5, quanitity: 2 }
let target, total, salePrice

class Dep {
  constructor() {
    this.subscribers = []
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      console.log('target ', target)
      this.subscribers.push(target)
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub())
  }
}

const deps = new Map()

Object.keys(data).forEach((key) => {
  // let internalValue = data[key]
  // const dep = new Dep()
  // Object.defineProperty(data, key, {
  //   get() {
  //     dep.depend()
  //     return internalValue
  //   },
  //   set (newVal) {
  //     internalValue = newVal
  //     dep.notify()
  //   }
  // })
  deps.set(key, new Dep())
})

const data_without_proxy = data

data = new Proxy(data_without_proxy, {
  get(obj, key) {
    console.log('proxy get...')
    deps.get(key).depend()
    return obj[key]
  },
  set(obj, key, newVal) {
    console.log('proxy set...')
    obj[key] = newVal
    deps.get(key).notify()
    return true
  }
})

function watcher(myFunc) {
  console.log('run watcher...')
  target = myFunc
  target()
  target = null
}

watcher(() => {
  console.log('total watcher...')
  total = data.price * data.quanitity
})

watcher(() => {
  console.log('salePrice watcher...')
  salePrice = data.price * 0.9
})

deps.set('discount', new Dep())
data.discount = 5

watcher(() => {
  console.log('salePrice watcher2...')
  salePrice = data.price - data.discount
})
```
