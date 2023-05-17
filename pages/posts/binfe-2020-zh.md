---
title: import { reactive } from 'vue' - 滨江前端沙龙 2020
date: 2020-09-26T16:00:00.000+00:00
lang: zh
type: talk+blog
duration: 25min
---

> 这是我在2020滨江前端沙龙分享的文稿
>
> This is the transcript of my talk at BinFE 2020
>
> Slides: [中文 ver.](https://antfu.me/talks/2020-09-26) | [English ver.](https://antfu.me/talks/2020-09-26/en)

Hello 大家好，非常感谢丁香园这次的邀请，也非常荣幸能够参与这次的分享。我是第一次做这样的分享，不足之处还请多多指教。

我这次分享的主题是 `import { reactive } from 'vue'`，和大家简单聊一聊 Vue 3 的响应式和组合式，以及他们的一些应用。

我叫 Anthony Fu，是 Vue 的 Core Team 的一员，我在 Vue 主要负责 @vue/composition-api 这个项目的维护。这是一个面向 Vue 2 的插件，它在 Vue 2 中增加了 Vue 3 的 Composition API 的支持。我最近也加入了 Vite 负责一些 Code Review 的工作。可以在下面这些平台找到我。

- GitHub [@antfu](https://github.com/antfu)
- Twitter [@antfu7](https://twitter.com/antfu7)
- Blog [antfu.me](https://antfu.me)

### 介绍

我这次分享的主要会和大家简单介绍一下响应式与组合式 API，然后通过一个例子的形式介绍组合式 API 所带来的优势。再来，我会以一个工具库作者的角度跟大家聊一聊如何做到 Vue 2 与 Vue 3 双版本同时兼容的同构。最后，我会去再介绍一下响应式 API 的一些延伸应用。

庆祝 Vue 3.0 One Piece 在上个礼拜正式发布！

大家知道，在 Vue 3.0 中我们使用 TypeScript 进行了一次从零的重写。利用这次重写的机会，我们对整个 Repo 的结构进行了一些解构，把 Vue 拆分成了这几个独立的库。在这一次的分享中我会主要会面向比较底层的响应式（`@vue/reactivity`）和组合式（`@vue/runtime-core`）这两个模块进行讨论。

### 响应式 Reactivity API

那么什么是响应式呢？提到这个就得祭出这张非常经典的 GIF。在一个 Excel 表格里面，我们会以公示的形式去定义一个一个单元格应该去做怎么样的一个运算。那么大家可以看到，在我设置好了 `A3` 这个格子的公式之后，我去更新 `A1` 的数值时， `A3` 就会自动更新，而我不需要再去做任何的操作。这就是响应是能够给我们带来的一个非常好的帮助，依赖的自动收集跟更新。

在 Vue 3 里面，我们对整个响应式系统做了一个重新的设计，同时暴露出了这几个新的API，`ref` `reactive` `computed` `effect`。我们把原本 Vue 2 `Object.defineProperty` 的实现改成了使用 `Proxy` 的实现方式。而 Proxy 可以给我们提供对属性更新监控的更大的灵活性。

```ts
function reactive(target) {
  return new Proxy(target, {
    get(target, prop, receiver) {
      track(target, prop)
      return Reflect.get(...arguments) // get original data
    },
    set(target, key, value, receiver) {
      trigger(target, key)
      return Reflect.set(...arguments)
    }
  })
}

const obj = reactive({
  hello: 'world'
})

console.log(obj.hello) // `track()` get called
obj.hello = 'vue' // `trigger()` get called
```

我们可以通过 `get` 和 `set` 这两个 handler 去追踪每一个属性的访问和修改，在这个例子中我们在 `get` 里注入了 `track` 这个函数，在 `set` 里注入了`trigger` 这个函数。那么在对 `reactive` 这个对象的 `hello` 属性进行访问的时候 `track` 就会被执行，在对 `obj.hello` 进行赋值的时候，`trigger` 就会被执行。通过 `track` 和 `trigger` 我们就可以进行一些响应式的追踪。

#### Effect

`effect` 是在 Vue 3 里面新引入的一个API，它的作用就是去结合 `track` 和 `trigger` 这两个功能，`track` 的作用是追踪调用他的函数，`trigger` 是去触发绑定的依赖更新。

```ts
const targetMap = new WeakMap()

export function track(target, key) {
  if (tacking && activeEffect)
    targetMap.get(target).key(key).push(activeEffect)
}

export function trigger(target, key) {
  targetMap.get(target).key(key).forEach(effect => effect())
}

export function effect(fn) {
  const effect = function () { fn() }
  enableTracking()
  activeEffect = effect
  fn()
  resetTracking()
  activeEffect = undefined
}
```

在 `effect` 里面我们会接受一个函数作为参数，在执行这个函数之前的我们会开启 tracking，然后把当前的函数设置在一个全局变量 `activeEffect`，然后再去执行这个函数。那么在这个函数的调用时间里面我们有任何的 reactive 的调用就会触发 `track` 这个函数。`track` 的主要功能就是说我们把当前的 `activeEffect` 绑定到所触发它的这个属性调用上。然后在数据更新的时候，我们再去找到这个依赖上面所绑定的所有 `effect` 把他们一一调用。这样就完成了一个最基本的响应式的功能。

#### `computed` & `watch`

在 Vue 3.0 里面，`computed` 和 `watch` 都是基于 `effect` 的包装，我们这边可以看到一个简单的 `computed` 的实现

```ts
function computed(getter) {
  let value
  let dirty = true

  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true // deps changed
    }
  })

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

`computed` 接受一个 getter 函数，这个函数我们把它直接传给 `effect`，`effect`会在先执行一次进行依赖收集，在收集完了之后，如果里面其中的依赖发生了变动，他就会触发这个 `scheduler` 将 `dirty` 设置为 `true`。在最后我们在对 `computed` 进行求值的时候，如果 `dirty` 为 `true`，我们就会重新进行一次运算得到新的 `value` 后再把 `value` 传出去。在第二次调用时，如果里面的依赖没有更新，我们就可以直接用上一次计算的结果，这件可以避免掉多余重复的计算。这里有一些 [延伸阅读](https://antfu.me/posts/watch-with-reactivity/)，大家如果有兴趣去了解一些比较深入的原理的话也可以去看一看。

### 组合式 Composition API

那么聊完了响应式，我们再来看看什么是组合式。

组合式其实是基于响应式延伸出来的一套和 Vue 生命周期绑定的一套工具。它提供了 Vue 生命周期的钩子像是 `onMounted` `onUpdate` 和 `onUnmounted` 等等。还有个非常重要的功能就是说在 Vue 的 `setup()` 里面，所建立的类似 `computed` 或者 `watch` 的 `effect` 会在组件销毁的时候自动跟随这个组件一并销毁。那么组合是最重要的作用就是它可以提供可复用的逻辑，我们可以把很多的逻辑拆分出来，做成一个一个的工具。然后可以跨组件的进行复用或甚至是把它做成一个第三方库，跨应用地进行复用。这个我们会在之后进行详细的介绍。

响应式是跟组合式的区别，就是他们是有两个不同的包提供的，在整个 Vue 应用的角度来看的话
，这些 API 都会从 `vue` 这个包里面统一导出的。但是如果我们会我们想要使用其中的一部分的话，那么可以看到 `ref` `reactive` `computed` `effect` 是在 `@vue/reactivity` 这个包里导出的，然后像是 `watch` `setup` 和一些生命周期是在 `@vue/runtime-core` 这个包里导出的。可以注意到一点也是非常有趣的一点，就是 `@vue/reactivity` 这个包其实是可以作为一个独立的包使用的，也就是说我可以不依赖于 Vue，我可以基于这个自己做一个框架，甚至我可以在 Node.js，在没有 UI 的环境下去进行使用。这个也会在我们后面的PPT里面去做一个比较详细的介绍。

### Case Study

那我们来看一个简单的使用场景的一个例子，这里有一个需求，我们现在想给我们的网页实现一个 Dark Mode 这个功能。我希望整个页面在默认的情况下会随着我系统的系统的偏好改变。然后我可能希望一个用户有一个手动可以修改的功能，比如说我有一个按钮一个直接改变 Dark Mode。
然后又希望这个这个功能是一个可持久化的，我可以保存下用户的偏好，在网页刷新后还可以还可以继续存留用户的上一次的修改。最后可能会希望说在两个模式切换的时候去执行一些代码，比如说通知用户或者是通知组件进行一些操作之类的。

#### 基础实现

那我们看一下我们怎么去实现这样一个功能。我们假设说 Dark Mode 已经在CSS层面上都做好了，也就是说我把 `dark` class 加上的时候，整个页面就会变成黑暗模式。那么我再提供一个按钮去给用户做切换。这个就是我们提供的模板的部分

```html
<template>
  <div :class='{dark}'>
    <button @click='toggleDark'>Toggle</button>
  </div>
</template>
```

我们再来看代码的部分要怎么实现

那么在 Options API 里面，非常的简单，我们可以这样实现：

```html
<script>
export default {
  data() {
    return {
      dark: false
    }
  },
  methods: {
    toggleDark() {
      this.dark = !this.dark
    }
  }
}
</script>
```

那在 Composition API 里面，我们可以把 `dark` 变成 `ref`。这个 `dark` 会直接从`setup()` 里面传出去，那我们同时可以在 return 里面传一个叫做 `toggleDark` 的函数，然后我们也是一样对 `dark` 进行取反。这样我们就实现了一个简单的开关的功能。

#### 系统偏好

再来的话，我们希望去增加用户系统偏好的更新。我们可以通过一个浏览器提供的 API `window.matchMedia`。然后再利用一个 CSS 的 Query `(prefers-color-scheme: dark)`，我们就可以知道是用户的系统的颜色偏好。然后我们会我们可以对这个 `matchMedia` 调用 `addEvenetListener` 进行监听，那么在用户系统改变的时候，我们可以随之一起改变。

那么为了实现这样一个功能的话，在 Options API 里面我们需要在需要将 `media` 暴露在 Vue 实例上，然后在 `created` 中进行事件的绑定，同时在 `destroyed` 的时候再把这个事件监听注销。

```html
<script>
// Options API
export default {
  data() {
    return {
      dark: false,
      media: window.matchMedia('(prefers-color-scheme: dark)')
    }
  },
  methods: {
    toggleDark() {
      this.dark = !this.dark
    },
    update() {
      this.dark = this.media.matches
    }
  },
  created() {
    this.media.addEventListener('change', this.update)
    this.update()
  },
  destroyed() {
    this.media.removeEventListener('change', this.update)
  }
}
</script>
```

那么再来看看 Composition API 要怎么实现。我们直接定义这个 `media`,

然后因为在 Composition API 中，`setup()` 相当于 Options API 的 `created`，我们直接可以把 `addEventListener` 的直接写在 `setup()` 里面，对应的我们再通过一个生命周期的钩子 `OnUnmounted` 注销事件监听。

```html
<script>
// Composition API
import { onUnmounted, ref } from 'vue'

export default {
  setup() {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const dark = ref(media.matches)

    const update = () => dark.value = media.matches
    
    media.addEventListener('change', update)

    onUnmounted(() => {
      media.removeEventListener('change', update)
    })

    return {
      dark,
      toggleDark() {
        dark.value = !dark.value
      }
    }
  }
}
</script>
```

#### 用户设置持久化

再来我们需要让用户的设置可以持久化，我们就需要把用户的设置存在 `localStorage` 里。设置修改的时候存入 `localStorage`，每次页面加载的时候再读出来。边代码大家看一看就可以了，主要想让大家看到的一点就是在 Options API 里面，我们给现有的一个组件增加功能的时候，我们会在不同的地方插入代码。比如说在 `data` 里面声明状态，在 `methods` 加几个函数。我们插入非常零碎的几个片段去实现一个功能，当这个组件的代码变得非常的长的时候我们很容易去丢失掉单一功能的上下文。

那么在 Composition API 里，我们可以我们可以很好的把代码给组织在一起。像是这样的一个功能，就只需要在一个 Block 里面加入这些代码，我们可以很清楚的上有上下文，也可以有 TypeScript 进行检查。

以我们刚刚实现的 Dark Mode 为例，其实相对并不是一个非常复杂的功能，而我们已经写了这么多行的代码。如果在再这个组件继续的扩展的时候，会导致代码的整个结构变得非常的复杂，其实就是一个不是非常好的 Smell。这也是我们希望避免的一件事情。

那么我们会可能会希望我们可以把逻辑拿出来复用，或者是我们希望 Dark Mode 的这个功能，可以在另外的一个组件去做调用，或者是我就希望让整个代码看起来比较的干净。在 Options API 里面，我们是可以做到这一点，但是现有的几个方案都并不是非常的理想 (Mixin, Renderless Component, Vuex, etc.)

Mixin 问题是会有命名空间的冲突。像是我们刚刚的例子，我们会有一个 `updated` 的函数，那么如果我们在 Mixin 中使用 `updated` 这个函数，然后用户端在使用的时候如果没有注意到，他也自己写了一个 `updated` 函数，这就会导致函数覆盖，会出现一些不希望的情况，但是又很难去 debug。

Renderless Component 可以一定程度上解决命名空间的问题，但是他只能在模板里面使用，组合性也有很多的局限。

Vuex 的话要做到这些就会变得更加复杂，你需要去定义 Mutations 也需要去定义 Actions。然后再绑定一些浏览器的事件。

但是 Composition API 的话就变得非常的简单粗暴，我只需要把 `setup()` 的代码复制粘贴出去，然后用一个函数把它包装起来。那么在这里，我就只需要去调一个 use 就可以了。而且我们可以继续在这里面写更多的逻辑，同时也不会导致找不到对应的上下文。

#### 进一步复用

我们甚至可以进行进一步的复用。以刚刚的代码为例，我们可以把这个 `useDark` 里面的这个 `matchMedia` 和用户设置的部分把他单独拉出来，变成两个独立的独立的函数。那么这些函数它就可以单独去专注在解决他单一问题上。以 `useDark` 的层面就只需要去在意，我在什么时候需要使用系统的设置和什么时候需要使用用户的设置。这里还有一个有趣的点，就是在这些组合工具里面他都可以使用生命周期的钩子，它就可以做到自动更新和自动注销。或者是说在数据改变的时候自动进行保存。

那么做到这一点的情况下，在使用的时候就可以没有什么负担。我只需要去在意他每一个 ref 对应什么样的功能，更新了之后它就可以帮我做到它应该做到的事情。这样对一个非常庞大的项目来说，可以更好的提高代码的复用度也可以提高代码的可读性跟可维护性。

```ts
export function useDark() {
  const system = usePreferDark()
  const setting = useLocalStorage('setting-dark', 'auto')

  const dark = computed({
    get() {
      return setting.value === 'auto'
        ? system.value
        : setting.value === 'dark'
    },
    set(v) {
      if (v === system.value)
        setting.value = 'auto'
      else
        setting.value = v ? 'dark' : 'light'
    },
  })

  return dark
}

export function usePreferDark() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const dark = ref(media.matches)

  const update = () => dark.value = media.matches

  media.addEventListener('change', update)
  onUnmounted(() => {
    media.removeEventListener('change', update)
  })

  return dark
}

export function useLocalStorage(key, defaultValue) {
  const data = ref(localStorage.getItem(key) ?? defaultValue)

  watch(data, () => localStorage.setItem(key, data.value))

  return data
}
```

#### 逻辑的组件

所以我觉得对于这些可以被复用的这些函数来说，它更像是一个逻辑的组件。我们平常讲组件的时候，一般来说都是指UI组件。UI 组件我们可以把它抽象成这样一个情况，就是说 UI 组件接受一个 Props，也就是从他的父组件传进来的一些参数，然后会根据它的 State 去更新对应的UI，再以通过事件的形式去通知父组件。

那么换到逻辑组件来说，其实就是一个函数，函数可以接受一些参数。这些参数可以是普通参数，也可以是响应式的。然后在这些在这些函数里面，我们可以进行一些生命周期的绑定，可以去做一些对监听事件的销毁。最后我再回传出一些响应式的数据，这些数据可以是 `ref` 也可以是 `reactive`。同时这些响应的数据会根据其中内部的状态进行一些更新，可以达到类似事件通知的效果。其实右边这张图是给 UI 组件的一张图，但是我觉得他也同样适用于逻辑组件。

也就是说，我可以复用底层的 `useLocalStorage` `useQuery` 去实现一个更高层的逻辑组件。让每一层组件都专注于在做自己的事情上就好了。

#### 现有逻辑组件库

现有的 Vue 3 已经可以使用的有两个主要的逻辑的组件库，[`VueUse`](https://github.com/antfu/vueuse) 和 [`vue-composable`](https://github.com/pikax/vue-composable)。有点像 React 中的 `react-use` 或者 `ahooks` 这一类的工具。VueUse 提供了更加细粒度的 Web API 以及工具分装。`vue-composable` 是由另外一个 Core Team Member [@pikax](https://github.com/pikax) 做的，它提供了更多常用的逻辑封装。例如 `useI18n`, `useValidation` 等等。这些功能直接实现在了这个工具里面，而不需要再去安装另外依赖于别的库的。

### 组合式 API 生态

然后和大家简单讲一下组合式 API 的生态支持。在 DevTools 6.0.0-beta.2 的更新了之后，加入了 Vue 3 的支持，同时加入一个新的功能是 Timeline 这个自定义的事件的打点，他可以去监听整个应用里面发生的各种各样的事件，然后把它做成一个个的点，让你可以去以时间的维度知道发生了什么。

然后在 `vue-composable` 里面提供了一个非常有趣的 API 叫做 `useDevtoolsInspector`，你可以传一些响应式的数据，当这些数据更新的时候去打点在 Timeline。你就可以更好的知道你的这些响应式的数据什么时候被什么时候被更新了以及更新成了什么。

```ts
import { useDevtoolsInspector } from 'vue-composable'

const counter = ref(0)

useDevtoolsInspector({ counter })
```

然后再来一个就是 SFC 的单文件组件的一些更新。我们给 `script` 标签加了一个 `setup` 的 flag。那么通过 `<script setup>`，我就可以把原本的这个 `defineComponent` 的形式的变成了 ES Module 的形式。本来可能本来会需要说我们再说说我们在声明了很多的 `ref` 之后，我们需要在最后把他们的名字全部都记下来最后一起返回出去。这时候，如果我们这个中间的逻辑非常的长的时候，就会很容易忘记某一些东西而没有暴露在组件的实例上，他们就没有办法在模板上使用。

那么有了这个 `<script setup>` 之后，我们就可以在任意的地方去把我们声明出来的数据直接 `export` 出去，他就会直接暴露在这个组件的实例上。同时我们可以通过这个 API 导出直接 export 另外一个组件达到子组件的注册。也为可以在一些 module 里面放一些全局的状态，多个组件 export 一个 store 的时候，我们就可以做到一个天然的状态共享。

### Vue 2 & 3 同构

我们以一个工具库的维护者来说，我们要怎么去做到 Vue 2 & 3 的代码的同构。在 Vue 2 里面，其实是没有提供 Composition API 的。而我们是通过一个另外的这个插件去做到这件事的。那么这样就会造成一个问题，我们引入的同样的 API，但是在不同的版本会从不同的入口引入。就会造成你的代码没有办法直接搬过去做一个同时兼容两个版本的状态。

解决方案就是我们可能需要维护两个版本，通过发布不同的 npm 包实现实现不同的版本，再让用户安装的时候去指定他要安装哪个版本。或者是说我们可能可以只维护一份代码，但是我们写一个发布的脚本，在打包的时候去替换掉我们刚刚讲的这个 API。那我们可以在针对 Vue 3 的时候直接从 `vue` 里面引入这些API，在针对 Vue 2 的时候从 `@vue/composition-api`。但是这样的问题虽然你让你更加轻松的只维护一份代码，但是你还是同时要发布两份版本，因为这两个版本的代码是还是没有办法兼容的。

为了解决这个问题，我做了一个工具叫做 [`vue-demi`](https://github.com/antfu/vue-demi)，它是一个为工具库服务的工具。如果使用 `vue-demi` 的话你只需要重构代码从 `vue-demi` 里面引入所有和 Vue 有关的 API，像是 `ref` 和 `reactive`。`vue-demi` 会使用 `postintall` 去检测当前的 Vue 版本，然后根据用户安装的版本去重新定向到对应的 `vue` 或者 `@vue/composition-api` 的包。那么这样的话我们就实现了同一个包 npm 包可以同时 Vue 2 和 3 两个版本。

如果需要进行一些单元测试的话，大家可以去看看 @pikax 的这个关于 [单元测试同时兼容两个版本的文章](https://dev.to/pikax/how-to-test-your-library-for-vue-2-and-vue-next-42ao)。

### Vue Reactivity 

我们聊一聊 `@vue/reactivity` 这个灵活的响应式的系统。这个包有一个非常大的卖点就是它是和 UI 或者说这个响应式系统是和 Vue 的组件模型结构的。那么这是尤大前段时间发的一篇推，它主要讲了就是说我们的响应式系统可以在不同的环境也在不同的框架上复用。也就是说你可以自己根据这个 Reactivity 写一套自己的框架，或者甚至你可以把它拿来用在 Node.js 或者是用在别的地方。

那么是由他在推特上发的两个例子，一个是 `vue` + `htm`，`htm` 是一个在客户端渲染的 JSX 的方案。那么这样的一个例子，我们直接可以非常简单地使用 Vue 的响应式系统去绑定到这个 `htm` 这个包上，然后我们就可以实现一个在纯客户端上不需要打包工具的一个 Vue + JSX 的支持。

另外一个例子是 `@vue/reactivity` + `lit-html`, `lit-html` 是一个 HTML 的模板引擎。我们只用到了最轻量的 `@vue/reactivity` 也是达到类似的纯客户端的效果。那么这个东西后来尤大在前几天的时候，把它做成了一个叫做 [`@vue/lit`](https://github.com/yyx990803/vue-lit) 一个工具，大家也可以有兴趣的话可以去试一下。

#### Reactivue

然后再来就是我之前做的一个 Proof of Concept，叫做 [ReactiVue](https://github.com/antfu/reactivue)。在 React 中使用 Vue 的 Composition API。可以看到右边的这个例子，ReactiVue 是一个以 React Hooks 形式实现的，`useSetup` 提供一个和 Vue 等价的 `setup()` 函数。最后 return 的响应式数据会再传出来给 React 组件，当响应式数据更新时会触发 React 组件的重新渲染。ReactiVue 只依赖于 `@vue/reactivity`，同时又包装了 React 的生命周期，让他们以 Vue 的形式暴露出来。这样就可以去复用 Vue 的组件库，我们这边做了测试的有 VueUse 和 [pinia](https://github.com/posva/pinia)，通过包的重命名就可以直接导出使用。

```ts
import React from 'React'
import { useSetup, ref, computed } from 'reactivue'

function MyCounter(props) {
  const { counter, doubled, inc } = useSetup(
    (props) => {
      const counter = ref(props.value)
      const doubled = computed(() => counter.value * 2)
      const inc = () => counter.value += 1

      return { counter, doubled, inc }
    },
    props
  )

  return (
    <div>
      <div>{counter} x 2 = {doubled}</div>
      <button onClick={inc}>Increase</button>
    </div>
  )
}

ReactDOM.render(<MyCounter value={10}>, el)
```

#### @vue-reactivity

[`@vue-reactivity`](https://github.com/vue-reactivity) 是一个我对于 `@vue/reactivity` 一些可能性的探索。我希望它会个一系列的工具包。我们现在有的两个已经发布了的工具。其中一个是 [`@vue-reactivity/watch`](https://github.com/vue-reactivity/watch)，在 Vue 中 `watch` 是实现在 `@vue/runtime-core` 里的，因为 `watch` 和 Vue 的组件模型有一些生命周期上的强绑定。那么我们在这里把 Vue 的 `watch` 提取出来做了一些简化之后，你就可以直接在 `@vue/reactivity` 使用 `watch`。

```ts
import { computed, reactive, ref } from '@vue/reactivity'
import { watch, watchEffect } from '@vue-reactivity/watch'

const count = ref(1)

const stopWatch = watch(
  count,
  (newValue) => {
    console.log(`Count: ${newValue}`)
  }
)

count.value += 1
// Count: 2

stopWatch()
```

另外一个是 [`@vue-reactivity/scope`](https://github.com/vue-reactivity/scope)，作用是做 `effect` 的自动收集。我们可以使用 `effectScope`，在这个里面声明的所有的 `effect` 都会被自动收集，我们就可以直接通过一个 `stop()` 函数去清除掉所有的这些 `effects`。这其实类似于类似于组件的 `setup()` 函数，是它的内部实现没有暴露出来，所以我们实现了这样的一个功能。关于这个我提了一个 RFC，希望我们可以把这个功能加入到 `@vue/reactivity` 本身上，然后可以提供给更多的库去做使用。

```ts
import {
  computed,
  effectScope,
  ref,
  watch,
} from '@vue-reactivity/scope'

const counter = ref(0)

const stop = effectScope(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(double.value))

  watchEffect(() => console.log('Count: ', double.value))
})

// to dispose all effects
stop()
```

然后再来一些实验性的想法，一个是 `/lifecycle`，希望可以有一个生命周期钩子的实现可以去复用，更容易让我们在 Vue 响应式的基础上做出自己的框架。另外一个有趣的就是这个 filesystem, 一个响应式的文件系统。这边有一个简单的例子，我们可以从 `@vue-reactivity/fs` 里面去引入一个叫做 `useJSON` 的一个钩子, 我们给他传一个 `data.json` 作为文件路径。它会去读取这个文件后解析成 JSON 对象暴露在 `data` 上，我们可以监听`data` 就可以知道数据的改变，那么同时也可以通过这样的API，去修改 `data` 的值，然后可以把数据写回对应的 JSON 文件。

```ts
import { effect } from '@vue/reactivity'
import { useJSON } from '@vue-reactivity/fs'

const data = useJSON('data.json')

// log on file changes
effect(() => {
  console.log(data.value)
})

// write back to file
data.value = { foo: 'bar' }
data.value.hello = 'world'
```

这些就是我现在正在做的一些探索，我觉得 Vue 的响应式系统非常的有趣，也相信未来还会有更多的的可能性和应用场景，希望可以和大家一起进行进一步的探索，找到一些有趣的使用方式和最佳实践。

我的分享就到这里，如果有任何问题欢迎通过 hi@antfu.me 给我发送邮件。谢谢大家.
