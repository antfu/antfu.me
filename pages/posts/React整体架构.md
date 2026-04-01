---
title: React整体架构
date: 2024-12-01T14:06:04
lang: zh-CN
type: blog
duration: 50min
description: 深入分析 React 从 Stack 架构到 Fiber 架构的演进，理解时间切片、优先级调度、可中断渲染等核心概念的实现原理
---

[[toc]]

> 来源：转自渡一React课程笔记

React v15以及之前的架构称之为 Stack 架构，从 v16 开始，React 重构了整体的架构，新的架构被称之为 Fiber 架构，新的架构相比旧架构有一个最大的特点就是能够实现时间切片。

- 旧架构的问题？
- 新架构的解决思路

## 旧架构的问题

> React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式

有哪些情况会导致我们的 Web 应用无法快速响应？

总结起来，实际上有两大类场景会限制快速响应：

- 当你需要执行大量计算或者设备本身的性能不足的时候，页面就会出现掉帧、卡顿的现象，这个本质上是来自于 CPU 的瓶颈
- 进行 I/O 的时候，需要等待数据返回后再进行后续操作，等待的过程中无法快速响应，这种情况实际上是来自于 I/O 的瓶颈


### CPU 瓶颈

平时我们在浏览网页的时候，这张网页实际上是由浏览器绘制出来的，就像一个画家画画一样

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-23-063619.jpg" alt="draw" style="zoom:21%;" />

平时我们所浏览的网页，里面往往会有一些动起来的东西，比如轮播图、百叶窗之类的，本质其实就是浏览器不停的在进行绘制。

目前，大多数设备的刷新频率为 60 FPS，意味着 1秒钟需要绘制 60 次，1000ms / 60 = 16.66ms，也就是说浏览器每隔 16.66ms 就需要绘制一帧。

浏览器在绘制一帧画面的时候，实际上还有很多的事情要做：

![image-20221227140043781](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-27-060044.png)

上图中的任务被称之为“渲染流水线”，每次执行流水线的时候，大致是需要如上的一些步骤，但是并不是说每一次所有的任务都需要全部执行：

- 当通过 JS 或者 CSS 修改 DOM 元素的几何属性（比如长度、宽度）时，会**触发完整的渲染流水线**，这种情况称之为重排（回流）
- 当修改的属性不涉及几何属性（比如字体、颜色）时，会省略掉流水线中的 Layout、Layer 过程，这种情况称之为重绘
- 当修改“不涉及重排、重绘的属性（比如 transform 属性）”时，会省略流水线中 Layout、Layer、Print 过程，仅执行合成线程的绘制工作，这种情况称之为合成

按照性能高低进行排序的话：合成 > 重绘 > 重排



前面说过，浏览器绘制的频率是 16.66ms 一帧，但是执行 JS 与渲染流水线实际上是在同一个线程上面执行，也就意味着如果 JS 执行的时间过长，不能够及时的渲染下一帧，也就意味着页面掉帧，表现出来的现象就是页面卡顿。



在 Reactv16 之前就存在这个问题，JS 代码执行的时间过长。在 React 中，需要去计算整颗虚拟 DOM 树，虽然说是 JS 层面的计算，相比直接操作 DOM，节省了很多时间，但是每次重新去计算整颗虚拟 DOM 树，会造成每一帧的 JS 代码的执行时间过长，从而导致动画、还有一些实时更新得不到及时的响应，造成卡顿的视觉效果。

假设有如下的 DOM 层次结构：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-23-072638.png" alt="image-20230223152638127" style="zoom:50%;" />

那么转换成虚拟 DOM 对象结构大致如下：

```js
{
  type : "div",
  props : {
    id : "test",
    children : [
      {
        type : "h1",
        props : {
          children : "This is a title"
        }
      }
      {
        type : "p",
        props : {
          children : "This is a paragraph"
        }
      },{
        type : "ul",
        props : {
          children : [{
            type : "li",
            props : {
              children : "apple"
            }
          },{
            type : "li",
            props : {
              children : "banana"
            }
          },{
            type : "li",
            props : {
              children : "pear"
            }
          }]
        }
      }
    ]
  }
}
```

在 React v16 版本之前，进行两颗虚拟 DOM 树的对比的时候，需要涉及到遍历上面的结构，这个时候只能使用递归，而且这种递归是不能够打断的，一条路走到黑，从而造成了 JS 执行时间过长。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-27-070133.png" alt="image-20221227150133112" style="zoom: 30%;" />

这样的架构模式，官方就称之为 Stack 架构模式，因为采用的是递归，会不停的开启新的函数栈。

### I/O瓶颈

对于前端开发来讲，最主要的 I/O 瓶颈就是网络延迟。

网络延迟是一种客观存在的现象，那么如何减少这种现象对用户的影响呢？React 团队给出的答案是：将人机交互的研究成果整合到 UI 中。

用户对卡顿的感知是不一样的，输入框哪怕只有轻微的延迟，用户也会认为很卡，假设是加载一个列表，哪怕 loading 好几秒，用户也不会觉得卡顿。

对于 React 来讲，所有的操作都是来自于自变量的变化导致的重新渲染，我们只需要针对不同的操作赋予不同的优先级即可。

具体来说，主要包含以下三个点：

- 为不同操作造成的“自变量变化”赋予不同的优先级
- 所有优先级统一调度，优先处理“最高优先级的更新”
- 如果更新正在进行（进入虚拟 DOM 相关工作），此时有“更高优先级的更新”产生的话，中段当前的更新，优先处理高优先级更新

要实现上面的这三个点，就需要 React 底层能实现：

- 用于调度优先级的调度器
- 调度器对应的调度算法
- 支持可中断的虚拟 DOM 的实现

所以不管是解决 CPU 的瓶颈还是 I/O 的瓶颈，底层的诉求都是需要实现 time slice

## 新架构的解决思路

### 解决 CPU 瓶颈

从 React v16 开始，官方团队正式引用了 Fiber 的概念，这是一种通过链表来描述 UI 的方式，本质上你也可以看作是一种虚拟 DOM 的实现。

>与其将 “Virtual DOM” 视为一种技术，不如说它是一种模式，人们提到它时经常是要表达不同的东西。在 React 的世界里，术语 “Virtual DOM” 通常与 [React 元素 ](https://react.docschina.org/docs/rendering-elements.html)关联在一起，因为它们都是代表了用户界面的对象。而 React 也使用一个名为 “fibers” 的内部对象来存放组件树的附加信息。上述二者也被认为是 React 中 “Virtual DOM” 实现的一部分。

Fiber 本质上也是一个对象，但是和之前 React 元素不同的地方在于对象之间使用链表的结构串联起来，child 指向子元素，sibling 指向兄弟元素，return 指向父元素。

如下图：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-24-032509.png" alt="image-20230224112508425" style="zoom:50%;" />

使用链表这种结构，有一个最大的好处就是在进行整颗树的对比（reconcile）计算时，这个过程是可以被打断。

在发现一帧时间已经不够，不能够再继续执行 JS，需要渲染下一帧的时候，这个时候就会打断 JS 的执行，优先渲染下一帧。渲染完成后再接着回来完成上一次没有执行完的 JS 计算。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-27-070226.png" alt="image-20221227150225918" style="zoom:30%;" />

官方还提供了一个 Stack 架构和 Fiber 架构的对比示例：https://claudiopro.github.io/react-fiber-vs-stack-demo/

下面是 React 源码中创建 Fiber 对象的相关代码：

```js
const createFiber = function (tag, pendingProps, key, mode) {
  // 创建 fiber 节点的实例对象
  return new FiberNode(tag, pendingProps, key, mode);
};

function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // 映射真实 DOM

  // Fiber
  // 上下、前后 fiber 通过链表的形式进行关联
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;
  this.refCleanup = null;
  // 和 hook 相关
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  this.alternate = null;
  // ...
}
```

### 解决 I/O 瓶颈

从 React v16 开始引入了 Scheduler（调度器），用来调度任务的优先级。

UI = f（state）：

- 根据自变量的变化计算出 UI
- 根据 UI 变化执行具体的宿主环境的 API

React v16之前：

- Reconciler（协调器）：vdom 的实现，根据自变量的变化计算出 UI 的变化
- Renderer（渲染器）：负责将 UI 的变化渲染到宿主环境



从 React v16 开始，多了一个组件：

- Scheduler（调度器）：调度任务的优先级，高优先级的任务会优先进入到 Reconciler
- Reconciler（协调器）：vdom 的实现，根据自变量的变化计算出 UI 的变化
- Renderer（渲染器）：负责将 UI 的变化渲染到宿主环境

新架构中，Reconciler 的更新流程也从之前的递归变成了“可中断的循环过程”。

```js
function workLoopConcurrent{
  // 如果还有任务，并且时间切片还有剩余的时间
  while(workInProgress !== null && !shouldYield()){
    performUnitOfWork(workInProgress);
  }
}

function shouldYield(){
  // 当前时间是否大于过期时间
  // 其中 deadline = getCurrentTime() + yieldInterval
  // yieldInterval 为调度器预设的时间间隔，默认为 5ms
  return getCurrentTime() >= deadline;
}
```

每次循环都会调用 shouldYield 判断当前的时间切片是否有足够的剩余时间，如果没有足够的剩余时间，就暂停 reconciler 的执行，将主线程还给渲染流水线，进行下一帧的渲染操作，渲染工作完成后，再等待下一个宏任务进行后续代码的执行。
