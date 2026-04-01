---
title: 虚拟 DOM
date: 2024-12-01T14:16:51
lang: zh-CN
type: blog
duration: 30min
description: 深入理解虚拟 DOM 的概念、原理及其优势，探讨为何虚拟 DOM 能提升渲染性能以及其在多平台渲染中的作用
---

[[toc]]

> 来源：转自渡一React课程笔记

虚拟 DOM 最早是由 React 团队提出来的，因此 React 团队在对虚拟 DOM 的定义上面有绝对的话语权。

>https://react.docschina.org/docs/faq-internals.html

**Virtual DOM 是一种编程概念**。在这个概念里， UI 以一种理想化的，或者说“虚拟的”表现形式被保存于内存中。

也就是说，只要我们有一种方式，能够将真实 DOM 的层次结构描述出来，那么这就是一个虚拟 DOM。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2023-02-23-034001.png" alt="image-20230223114000816" style="zoom: 50%;" />

在 React 中，React 团队使用的是 JS 对象来对 DOM 结构进行一个描述。但是很多人会直接把 JS 对象和虚拟 DOM 划等号，这种理解是不太准确的，比较片面的。

虚拟 DOM 和 JS 对象之间的关系：**前者是一种思想，后者是一种思想的具体实现。**


## 为什么需要虚拟 DOM

使用虚拟 DOM 主要有两个方面的优势：

- 相较于 DOM 的体积优势和速度优势
- 多平台的渲染抽象能力



**相较于 DOM 的体积优势和速度优势**

首先我们需要明确一个点，JS 层面的计算速度要比 DOM 层面的计算要快：

- DOM 对象最终要被浏览器渲染出来之前，浏览器会有很多工作要做（浏览器的渲染原理）
- DOM 对象上面的属性也非常非常多

```js
const div = document.createElement("div");
for(let i in div){console.log(i + " ")}
```

操作 JS 对象的时间和操作 DOM 对象的时间是完全不一样的。

JS 层面的计算速度要高于 DOM 层面的计算速度。

此时有一个问题：虽然使用了 JS 对象来描述 UI，但是最终不还是要用原生 DOM API 去操作 DOM 么？

虚拟 DOM 在第一次渲染页面的时候，并没有什么优势，速度肯定比直接操作原生 DOM API 要慢一些，虚拟 DOM 真正体现优势是在更新阶段。

根据 React 团队的研究，在渲染页面时，相比使用原生 DOM API，开发人员更加倾向于使用 innerHTML

```js
let newP = document.createElement("p");
let newContent = document.createTextNode("this is a test");
newP.appendChild(newContent);
document.body.appendChild(newP);
```

```js
document.body.innerHTML = `
	<p>
		this is a test
	</p>
`;
```

因此在使用 innerHTML 的时候，就涉及到了两个层面的计算：

- JS 层面：解析字符串
- DOM 层面：创建对应的 DOM 节点

接下来我们加入虚拟 DOM 来进行对比：

|              | innerHTML           | 虚拟 DOM            |
| ------------ | ------------------- | ------------------- |
| JS 层面计算  | 解析字符串          | 创建 JS 对象        |
| DOM 层面计算 | 创建对应的 DOM 节点 | 创建对应的 DOM 节点 |

虚拟 DOM 真正发挥威力的时候，是在更新阶段

innerHTML 进行更新的时候，要全部重新赋值，这意味着之前创建的 DOM 节点需要全部销毁掉，然后重新进行创建

但是虚拟 DOM 只需要更新必要的 DOM 节点即可

|              | innerHTML               | 虚拟 DOM            |
| ------------ | ----------------------- | ------------------- |
| JS 层面计算  | 解析字符串              | 创建 JS 对象        |
| DOM 层面计算 | 销毁原来所有的 DOM 节点 | 修改必要的 DOM 节点 |
| DOM 层面计算 | 创建对应的 DOM 节点     |                     |



**多平台的渲染抽象能力**

UI = f（state）这个公式进一步进行拆分可以拆分成两步：

- 根据自变量的变化计算出 UI
- 根据 UI 变化执行具体的宿主环境的 API

虚拟 DOM 只是多真实 UI 的一个描述，回头根据不同的宿主环境，可以执行不同的渲染代码：

- 浏览器、Node.js 宿主环境使用 ReactDOM 包
- Native 宿主环境使用 ReactNative 包
- Canvas、SVG 或者 VML（IE8）宿主环境使用 ReactArt 包
- ReactTest 包用于渲染出 JS 对象，可以很方便地测试“不隶属于任何宿主环境的通用功能”



## React 中的虚拟DOM

在 React 中通过 JSX 来描述 UI，JSX 最终会被转为一个叫做 createElement 方法的调用，调用该方法后就会得到虚拟 DOM 对象。

经过 Babel 编译后结果如下：

![image-20221226155735808](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-26-075736.png)

在源码中 createElement 方法如下：

```js
/**
 *
 * @param {*} type 元素类型 h1
 * @param {*} config 属性对象 {id : "aa"}
 * @param {*} children 子元素 hello
 * @returns
 * <h1 id="aa">hello</h1>
 */
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 说明有属性
  if (config != null) {
    // ...
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
  // 经历了上面的 if 之后，所有的属性都放到了 props 对象上面
  // props ==> {id : "aa"}

  // children 可以有多个参数，这些参数被转移到新分配的 props 对象上
  // 如果是多个子元素，对应的是一个数组
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    // ...
    props.children = childArray;
  }

  // 添加默认的 props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  // ...
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}

const ReactElement = function (type, key, ref, self, source, owner, props) {
    // 该对象就是最终向外部返回的 vdom（也就是用来描述 DOM 层次结构的 JS 对象）
  const element = {
    // 让我们能够唯一地将其标识为 React 元素
    $$typeof: REACT_ELEMENT_TYPE,

    // 元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 记录负责创建此元素的组件。
    _owner: owner,
  };
  // ...
  return element;
};
```

在上面的代码中，最终返回的 element 对象就是我们所说的虚拟 DOM 对象。在官方文档中，官方更倾向于将这个对象称之为 React 元素。



## 真题解答

> 题目：什么是虚拟DOM？其优点有哪些？
>
> 参考答案：
>
> 虚拟 DOM 最初是由 React 团队所提出的概念，这是一种编程的思想，指的是针对真实 UI DOM 的一种描述能力。
>
> 在 React 中，使用了 JS 对象来描述真实的 DOM 结构。虚拟DOM和 JS 对象之间的关系：前者是一种思想，后者是这种思想的具体实现。
>
> 使用虚拟 DOM 有如下的优点：
>
> - 相较于 DOM 的体积和速度优势
> - 多平台渲染的抽象能力
>
> **相较于 DOM 的体积和速度优势**
>
> -  JS 层面的计算的速度，要比 DOM 层面的计算快得多
>    - DOM 对象最终要被浏览器显示出来之前，浏览器会有很多工作要做（浏览器渲染原理）
>    - DOM 上面的属性也是非常多的
> -  虚拟 DOM 发挥优势的时机主要体现在更新的时候，相比较 innerHTML 要将已有的 DOM 节点全部销毁，虚拟 DOM 能够做到针对 DOM 节点做最小程度的修改
>
> **多平台渲染的抽象能力**
>
> - 浏览器、Node.js 宿主环境使用 ReactDOM 包
> - Native 宿主环境使用 ReactNative 包
> - Canvas、SVG 或者 VML（IE8）宿主环境使用 ReactArt 包
> - ReactTest 包用于渲染出 JS 对象，可以很方便地测试“不隶属于任何宿主环境的通用功能”
>
> 在 React 中，通过 JSX 来描述 UI，JSX 仅仅是一个语法糖，会被 Babel 编译为 createElement 方法的调用。该方法调用之后会返回一个 JS 对象，该对象就是虚拟 DOM 对象，官方更倾向于称之为一个 React 元素。
