---
title: React渲染流程
date: 2024-12-06T09:13:09
lang: zh-CN
type: blog
duration: 15min
description: 深入理解 React 的两大核心阶段——Reconciler 协调阶段和 Renderer 渲染阶段，以及 render 阶段和 commit 阶段的工作流程
---

[[toc]]

> 来源：转自渡一React课程笔记

现代前端框架都可以总结为一个公式：

> UI = f（state）

上面的公式还可以进行一个拆分：

- 根据自变量（state）的变化计算出 UI 的变化
- 根据 UI 变化执行具体的宿主环境的 API

对应的公式：

```js
const state = reconcile(update); // 通过 reconciler 计算出最新的状态
const UI = commit(state); // 根据上一步计算出来的 state 渲染出 UI
```

对应到 React 里面就两大阶段：

- render 阶段：调合虚拟 DOM，计算出最终要渲染出来的虚拟 DOM
- commit 阶段：根据上一步计算出来的虚拟 DOM，渲染具体的 UI

每个阶段对应不同的组件：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-23-101849.png" alt="image-20230223181848783" style="zoom:50%;" />

- 调度器（Scheduer）：调度任务，为任务排序优先级，让优先级高的任务先进入到 Reconciler
- 协调器（Reconciler）：生成 Fiber 对象，收集副作用，找出哪些节点发生了变化，打上不同的 flags，著名的 diff 算法也是在这个组件中执行的。
- 渲染器（Renderer）：根据协调器计算出来的虚拟 DOM 同步的渲染节点到视图上。

接下来我们来看一个例子：

```jsx
export default () => {
  const [count, updateCount] = useState(0);
  return (
    <ul>
    	<button onClick={() => updateCount(count + 1)}>乘以{count}</button>
      <li>{1 * count}</li>
      <li>{2 * count}</li>
      <li>{3 * count}</li>
    </ul>
  );
}
```

当用户点击按钮时，首先是由 Scheduler 进行任务的协调，render 阶段（虚线框内）的工作流程是可以随时被以下原因中断：

- 有其他更高优先级的任务需要执行
- 当前的 time slice 没有剩余的时间
- 发生了其他错误

注意上面 render 阶段的工作是在内存里面进行的，不会更新宿主环境 UI，因此这个阶段即使工作流程反复被中断，用户也不会看到“更新不完整的UI”。

当 Scheduler 调度完成后，将任务交给 Reconciler，Reconciler 就需要计算出新的 UI，最后就由 Renderer **同步**进行渲染更新操作。

如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-23-103449.png" alt="image-20230223183449668" style="zoom: 55%;" />

## 调度器

在 React v16 版本之前，采用的是 Stack 架构，所有任务只能同步进行，无法被打断，这就导致浏览器可能会出现丢帧的现象，表现出卡顿。React 为了解决这个问题，从 v16 版本开始从架构上面进行了两大更新：

- 引入 Fiber
- 新增了 Scheduler

Scheduler 在浏览器的原生 API 中实际上是有类似的实现的，这个 API 就是 requestIdleCallback

> MDN：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback

虽然每一帧绘制的时间约为 16.66ms，但是如果屏幕没有刷新，那么浏览器会安排长度为 50ms 左右的空闲时间。

为什么是50ms？

根据研究报告表明，用户操作之后，100ms以内的响应给用户的感觉都是瞬间发生，也就是说不会感受到延迟感，因此将空闲时间设置为 50，浏览器依然还剩下 50ms 可以处理用户的操作响应，不会让用户感到延迟。



虽然浏览器有类似的 API，但是 React 团队并没有使用该 API，因为该 API 存在兼容性问题。因此 React 团队自己实现了一套这样的机制，这个就是调度器 Scheduler。

后期 React 团队打算单独发行这个 Scheduler，这意味着调度器不仅仅只能在 React 中使用，凡是有涉及到任务调度需求的项目都可以使用 Scheduler。



## 协调器

协调器是 render 阶段的第二阶段工作，类组件或者函数组件本身就是在这个阶段被调用的。

根据 Scheduler 调度结果的不同，协调器起点可能是不同的

- performSyncWorkOnRoot（同步更新流程）
- performConcurrentWorkOnRoot（并发更新流程）

```js
// performSyncWorkOnRoot 会执行该方法
function workLoopSync(){
  while(workInProgress !== null){
    performUnitOfWork(workInProgress)
  }
}
```

```js
// performConcurrentWorkOnRoot 会执行该方法
function workLoopConcurrent(){
  while(workInProgress !== null && !shouldYield()){
    performUnitOfWork(workInProgress)
  }
}
```

新的架构使用 Fiber（对象）来描述 DOM 结构，最终需要形成一颗 Fiber tree，这不过这棵树是通过链表的形式串联在一起的。

workInProgress 代表的是当前的 FiberNode。

performUnitOfWork 方法会创建下一个 FiberNode，并且还会将已创建的 FiberNode 连接起来（child、return、sibling），从而形成一个链表结构的 Fiber tree。

如果 workInProgress 为 null，说明已经没有下一个 FiberNode，也就是说明整颗 Fiber tree 树已经构建完毕。

上面两个方法唯一的区别就是是否调用了 shouldYield方法，该方法表明了是否可以中断。



performUnitOfWork在创建下一个 FiberNode 的时候，整体上的工作流程可以分为两大块：

- 递阶段
- 归阶段



**递阶段**

递阶段会从 HostRootFiber 开始向下以深度优先的原则进行遍历，遍历到的每一个 FiberNode 执行 beginWork 方法。该方法会根据传入的 FiberNode 创建下一级的 FiberNode，此时可能存在两种情况：

- 下一级只有一个元素，beginWork 方法会创建对应的 FiberNode，并于 workInProgress 连接

```jsx
<ul>
  <li></li>
</ul>
```

这里就会创建 li 对应的 FiberNode，做出如下的连接：

```js
LiFiber.return = UlFiber;
```



- 下一级有多个元素，这是 beginWork 方法会依次创建所有的子 FiberNode 并且通过 sibling 连接到一起，每个子 FiberNode 也会和 workInProgress 连接

```jsx
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

此时会创建 3 个 li 对应的 FiberNode，连接情况如下：

```js
// 所有的子 Fiber 依次连接
Li0Fiber.sibling = Li1Fiber;
Li1Fiber.sibling = Li2Fiber;

// 子 Fiber 还需要和父 Fiber 连接
Li0Fiber.return = UlFiber;
Li1Fiber.return = UlFiber;
Li2Fiber.return = UlFiber;
```

由于采用的是深度优先的原则，因此无法再往下走的时候，会进入到归阶段。



**归阶段**

归阶段会调用 completeWork 方法来处理 FiberNode，做一些副作用的收集。

当某个 FiberNode 执行完了 completeWork 方法后，如果存在兄弟元素，就会进入到兄弟元素的递阶段，如果不存在兄弟元素，就会进入父 FiberNode 的归阶段。

```js
function performUnitOfWork(fiberNode){
  // 省略 beginWork
  if(fiberNode.child){
    performUnitOfWork(fiberNode.child);
  }
  // 省略 CompleteWork
  if(fiberNode.sibling){
    performUnitOfWork(fiberNode.sibling);
  }
}
```

最后我们来看一张图：

![image-20230224111517826](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-24-031518.png)



## 渲染器

Renderer 工作的阶段被称之为 commit 阶段。该阶段会将各种副作用 commit 到宿主环境的 UI 中。

相较于之前的 render 阶段可以被打断，commit 阶段一旦开始就会**同步**执行直到完成渲染工作。

整个渲染器渲染过程中可以分为三个子阶段：

- BeforeMutation 阶段
- Mutation 阶段
- Layout 阶段

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-03-02-090354.png" alt="image-20230302170353345" style="zoom:50%;" />
