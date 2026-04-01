---
title: React组件渲染性能优化
date: 2024-11-19T08:48:55
lang: zh-CN
type: blog
duration: 40min
description: 探讨 React 组件渲染性能优化策略，包括 shouldComponentUpdate、PureComponent、React.memo、useMemo、useCallback 等优化手段的原理与适用场景
---

[[toc]]

> 来源：转自渡一React课程笔记

在该文章里，我们将会探讨组件在渲染时，如何优化渲染性能问题。

涉及到的内容会包含 *shouldComponentUpdate、PureComnent、React.memo、useMemo、useCallback* 等。

## *shouldComponentUpdate* 与 *PureComnent*

**shouldComponentUpdate** 与 **PureComnent** 都与类组件相关，所以下面会以类组件来示例。

```js
import React, { Component } from 'react'

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      counter: 1
    }
  }
  render() {
    console.log("App 渲染了");
    return (
      <div>
        <h1>App 组件</h1>
        <div>{this.state.counter}</div>
        <button onClick={() => this.setState({
          counter : 1
        })}>+1</button>
      </div>
    )
  }
}
```

在上面的代码中，我们书写了一个简单的计数器，按钮在点击的时候仍然是设置 *counter* 的值为 *1*，不过，虽然 *counter* 的值没有变，整个组件仍然是重新渲染了的。显然，这一次渲染是没有必要的。

此时，我们就可以使用 *shouldComponentUpdate* 来进行优化。

文档地址：*https://zh-hans.legacy.reactjs.org/docs/react-component.html#shouldcomponentupdate*

当 *props* 或 *state* 发生变化时，*shouldComponentUpdate* 会在渲染执行之前被调用。返回值默认为 *true*。首次渲染或使用 *forceUpdate* 方法时不会调用该方法。

下面我们来使用 *shouldComponentUpdate* 优化上面的示例：

```js
import React, { Component } from 'react'
import { objectEqual } from "./utils/tools"

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      counter: 1
    }
  }

  /**
   *
   * @param {*} nextProps 新的 props
   * @param {*} nextState 新的 state
   * @returns
   */
  shouldComponentUpdate(nextProps, nextState) {
    // shouldComponentUpdate会根据返回值来决定是否重新渲染
    // 默认是 true，要重新渲染
    // 如果返回 false，则不会重新渲染
    // 我们就需要将当前的 props 和 state 与新的 props 和 state 进行一个比较
    if (objectEqual(this.props, nextProps) && objectEqual(this.state, nextState)) {
      // 如果新旧 props 和 state 都是相同的，那么就返回 false，不需要重新渲染
      return false;
    }
    return true;
  }

  render() {
    console.log("App 渲染了");
    return (
      <div>
        <h1>App 组件</h1>
        <div>{this.state.counter}</div>
        <button onClick={() => this.setState({
          counter: Math.floor(Math.random() * 3 + 1)
        })}>+1</button>
      </div>
    )
  }
}
```

在上面的代码中，我们在类组件中书写了一个 *shouldComponentUpdate* 的生命周期钩子函数，该函数会在渲染执行之前被调用，函数内部能够接收到新的属性和新的状态，我们要做的就是让新的属性和状态和当前的属性以及状态进行浅比较，如果相同则返回 *false*，也就是不重新渲染。

此方法仅作为性能优化的方式而存在，不要企图依靠此方法来“阻止”渲染。另外，现在 *React* 官方已经提供了 *PureComponent*，因此一般情况下我们是不需要手写 *shouldComponentUpdate* 的。

*PureComponent* 文档：*https://zh-hans.react.dev/reference/react/PureComponent*

>**<u>*React.PureComponent* 与 *React.Component* 很相似。两者的区别在于 *React.Component* 并未实现 *shouldComponentUpdate( )*，而 *React.PureComponent* 中以浅层对比 *prop* 和 *state* 的方式来实现了该函数。</u>**

例如我们将上面的示例直接修改为 *PureComponent*，如下：

```js
import React, { PureComponent } from 'react'
export default class App extends PureComponent {

  constructor() {
    super();
    this.state = {
      counter: 1
    }
  }

  render() {
    console.log("App 渲染了");
    return (
      <div>
        <h1>App 组件</h1>
        <div>{this.state.counter}</div>
        <button onClick={() => this.setState({
          counter: Math.floor(Math.random() * 3 + 1)
        })}>+1</button>
      </div>
    )
  }
}
```

可以看到，效果相同，但是代码精简了很多。在使用 *PureComponent* 的时候，有一点一定要注意，这也是官方所强调，就是内部做的是浅比较，这意味下面的代码是无法更新的：

```js
import React, { PureComponent } from 'react'
export default class App extends PureComponent {

  constructor() {
    super();
    this.state = {
      stu: ["张三", "李四"]
    }
  }

  addStuHandle = () => {
    this.state.stu.push("王武");
    this.setState({
      stu: this.state.stu
    })
  }

  render() {
    const stuLis = this.state.stu.map((it, index) => (<li key={index}>{it}</li>))
    return (
      <div>
        <h1>App 组件</h1>
        <ul>
          {stuLis}
        </ul>
        <button onClick={this.addStuHandle}>添加学生</button>
      </div>
    )
  }
}
```

究其原因，是因为数组的地址并没有发生更改，而是数组内部发生的更改，但是 **<u>*PureComponent* 是浅比较，会认为数组并没有发生更改，因此不会进行渲染更新。</u>**（如果使用 *Component* 则是没有问题的，因为 *React.Component* 并未实现 *shouldComponentUpdate*）

但是不管怎样，我们都应该返回一个新的数组，而不是把原来的数组赋值给 *stu*：

```js
addStuHandle = () => {
    const arr = [...this.state.stu]
    arr.push("王武");
    this.setState({
      stu: arr
    })
}
```

## *React.memo*

**shouldComponentUpdate** 与 **PureComnent** 主要是优化类组件的渲染性能，那么如果是函数组件该怎么办呢？

在 *React* 中，为我们提供了 *React.memo*。

文档地址：*https://zh-hans.legacy.reactjs.org/docs/react-api.html#reactmemo*

这是一个高阶组件，如果你的组件在相同 *props* 的情况下渲染相同的结果，那么你可以通过将其包装在 *React.memo* 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。

来看一个例子：

```js
import React, { useState } from 'react';
import ChildCom1 from "./components/ChildCom1"

function App() {

  const [counter1, setCounter1] = useState(1);
  const [counter2, setCounter2] = useState(1);

  console.log("App 渲染了");
  return (
    <div>
      <div>{counter1}</div>
      <button onClick={() => setCounter1(counter1 + 1)}>+1</button>
      <ChildCom1 counter={counter2} setCounter={setCounter2} />
    </div>
  );
}

export default App;
```

```js
import React from "react"
function ChildCom1(props) {
    console.log("ChildCom1 渲染了")
    return (
        <div>
            <div>ChildCom1</div>
            <div>{props.counter}</div>
        </div>
    );
}

export default ChildCom1;
```

在上面的示例中，*App* 根组件中定义了两个状态 *counter1* 和 *counter2*，在 *App* 组件内部修改 *counter1*，然后 *counter2* 作为 *porps* 传递给子组件，此时我们修改 *counter1* 的状态时，子组件也会跟着更新，原因很简单，因为父组件更新了，那你子组件当然要重新更新。

但是，我们发现，其实**子组件的更新是没有必要的，因为传递给子组件的 *props* 并没有发生变化**，此时我们就可以使用 *React.memo*，如下：

```js
import React from "react"
function ChildCom1(props) {
    console.log("ChildCom1 渲染了")
    return (
        <div>
            <div>ChildCom1</div>
            <div>{props.counter}</div>
        </div>
    );
}

export default React.memo(ChildCom1);
```

之后我们再更新 *counter1* 时，由于传递给子组件的 *counter2* 这个 *props* 属性并没有变化，因此子组件不会更新。

注意：默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

举个例子：

```js
import React, { useState } from 'react';
import ChildCom1 from "./components/ChildCom1"

function App() {

  const [counter1, setCounter1] = useState(2);
  const [stu, setStu] = useState(["张三","李四"]);

  console.log("App 渲染了");

  function clickHandle(){
    setCounter1(counter1 + 1);
    stu.push("王武");
    setStu(stu)
  }

  return (
    <div>
      <div>{counter1}</div>
      <button onClick={clickHandle}>+1</button>
      <ChildCom1 stu={stu} setStu={setStu} />
    </div>
  );
}

export default App;
```

```js
import React from "react"
function ChildCom1(props) {
    console.log("ChildCom1 渲染了")
    const lis = props.stu.map((it,index)=>(<li key={index}>{it}</li>))
    return (
        <div>
            <div>ChildCom1</div>
            <ul>{lis}</ul>
        </div>
    );
}

export default React.memo(ChildCom1);
```

这个例子和我们之前的 *PureComponent* 所举的例子很相似，由于是在原来的数组上面进行的修改，数组的地址并没有发生变化，因此 *React.memo* 返回的组件并不会更新。

>实际上 *React.memo* 的源码就是返回一个 *PureComponent* 组件：
>```js
>function memo(FuncComp){
>	return class Memo extends PureComponent{
>      render(){
>           return <>{FuncComp(this.props)}</>
>        }
>    }
>}
>```

此时要解决这个问题也很简单，和前面一样，直接返回一个新的数组，例如：

```js
function clickHandle(){
    setCounter1(counter1 + 1);
    const arr = [...stu];
    arr.push("王武");
    setStu(arr)
}
```

另外，在使用 *React.memo* 的时候还支持传入第二个自定义的比较函数参数，例如：

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

## *useCallback*

正常情况下，如果组件各自内部维护自己的数据，那么组件更新的时候相互并不会影响，例如：

*App* 根组件对应样式：

```css
.container {
    width: 500px;
    height: 200px;
    border: 1px solid;
    margin: 0 auto;
}

.btnContainer {
    text-align: center;
}

.childComContainer {
    display: flex;
    justify-content: space-between;
}
```

*App* 根组件，引入了 *ChildCom1* 和 *ChildCom2* 这两个子组件：

```js
import { useState } from 'react';
import ChildCom1 from "./components/ChildCom1"
import ChildCom2 from "./components/ChildCom2"

import styles from "./css/App.module.css"

function App() {
  const [counter, setCounter] = useState(0);
  console.log("App渲染了")
  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <div>{counter}</div>
        <button onClick={() => setCounter(counter + 1)}>+1</button>
      </div>


      <div className={styles.childComContainer}>
        <ChildCom1 />
        <ChildCom2 />
      </div>

    </div>
  );
}

export default App;
```

*ChildCom1* 子组件：

```js
import { useState } from "react"
function ChildCom1() {
    const [counter, setCounter] = useState(0);
    console.log("ChildCom1 渲染了")
    return (
        <div style={{
            width: "200px",
            height: "100px",
            border: "1px solid"
        }}>
            ChildCom1
            <div>{counter}</div>
            <button onClick={() => setCounter(counter + 1)}>+1</button>
        </div>
    );
}

export default ChildCom1;
```

>*ChildCom2*  组件基本相同

此时在我们的应用中，**各个组件内部维护了自身的数据，组件内部数据的更新并不会影响到同级组件和祖级组件**。效果如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-08-065641.gif" alt="iShot_2022-12-02_15.46.37" style="zoom:67%;" />

可以看到，父组件的更新会导致两个子组件更新，这是正常的，子组件各自的更新不会影响其他组件。

但是，倘若两个子组件的数据都来自于父组件，情况就不一样了。

这里我们把上面的代码稍作修改，如下：

*App.jsx* 根组件，为两个子组件提供了数据以及修改数据的方法

```js
import { useState } from 'react';
import ChildCom1 from "./components/ChildCom1"
import ChildCom2 from "./components/ChildCom2"

import styles from "./css/App.module.css"

function App() {
  const [counter, setCounter] = useState(0);
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  console.log("App渲染了")
  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <div>{counter}</div>
        <button onClick={() => setCounter(counter + 1)}>+1</button>
      </div>


      <div className={styles.childComContainer}>
        <ChildCom1 counter={counter1} setCounter={setCounter1}/>
        <ChildCom2 counter={counter2} setCounter={setCounter2}/>
      </div>

    </div>
  );
}

export default App;
```

*ChildCom1* 子组件接收从父组件传递过来的数据，并调用父组件传递过来的方法修改数据

```js
function ChildCom1(props) {
    console.log("ChildCom1 渲染了")
    return (
        <div style={{
            width: "200px",
            height: "100px",
            border: "1px solid"
        }}>
            ChildCom1
            <div>{props.counter}</div>
            <button onClick={() => props.setCounter(props.counter + 1)}>+1</button>
        </div>
    );
}

export default ChildCom1;
```

效果如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-12-08-065708.gif" alt="iShot_2022-12-02_15.52.31" style="zoom:67%;" />

可以看到，在更新子组件的数据时，由于数据是从父组件传递下去的，相当于更新了父组件数据，那么父组件就会重新渲染，最终导致的结果就是父组件下面所有的子组件都重新渲染了。

首先，我们会想到使用前面所讲的 *React.memo* 来解决这个问题，如下：

```js
import React from "react"
function ChildCom1(props) {
    console.log("ChildCom1 渲染了")
    return (
        <div style={{
            width: "200px",
            height: "100px",
            border: "1px solid"
        }}>
            ChildCom1
            <div>{props.counter}</div>
            <button onClick={() => props.setCounter(props.counter + 1)}>+1</button>
        </div>
    );
}

// 相同的 props 传入的时候该组件不需要重新渲染
export default React.memo(ChildCom1);
```

在上面的代码中，我们使用 *React.memo* 来缓存 *ChildCom1* 组件，这样在相同的 *props* 传入时，该组件不会重新渲染。

但是假设此时 *App* 组件还有一个单独的函数传入，那就不那么好使了：

```js
function App() {
  // App 组件自身有一个状态
  // ...
  console.log("App 渲染了")

  function test() {
    console.log("test");
  }


  return (
    <div className={styles.container}>
      {/* ... */}

      <div className={styles.childComContainer}>
        <ChildCom1 counter={counter1} setCounter={setCounter1} test={test} />
        <ChildCom2 counter={counter2} setCounter={setCounter2} test={test} />
      </div>
    </div>
  );
}
```

在上面的代码中，我们还向两个子组件传入了一个 *test* 函数，由于每次 *App* 组件的重新渲染会生成新的 *test* 函数，所以对于两个子组件来讲传入的 *test* 导致 *props* 不同所以都会重新渲染。

此时就可以使用 *useCallback* 来解决这个问题，语法如下：

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

把内联回调函数及依赖项数组作为参数传入 *useCallback*，它将返回该回调函数的 *memoized* 版本，该回调函数仅在某个依赖项改变时才会更新。

接下来我们来使用 *useCallback* 优化上面的问题，对 *App.jsx* 做如下的修改：

```js
import React, { useState, useCallback } from 'react';
import ChildCom1 from "./components/ChildCom1"
import ChildCom2 from "./components/ChildCom2"

import styles from "./css/App.module.css"

function App() {

  const [counter, setCounter] = useState(1); // 这是 App 组件自身维护的状态
  const [counter1, setCounter1] = useState(1); // 这是要传递给 ChildCom1 组件的数据
  const [counter2, setCounter2] = useState(1); // 这是要传递给 ChildCom2 组件的数据

  console.log("App组件渲染了")

  // 每次重新渲染的时候，就会生成一个全新的 test 函数
  // 使用了 useCallback 之后，我们针对 test 函数做了一个缓存
  const newTest = useCallback(function test(){
    console.log("test触发了")
  },[])

  return (
    <div className={styles.container}>
      {/* 自身的计数器 */}
      <div className={styles.btnContainer}>
        <div>counter:{counter}</div>
        <button onClick={() => setCounter(counter + 1)}>+1</button>
      </div>

      {/* 使用子组件 */}
      <div className={styles.childComContainer}>
        <ChildCom1 counter={counter1} setCounter={setCounter1} test={newTest}/>
        <ChildCom2 counter={counter2} setCounter={setCounter2} test={newTest}/>
      </div>
    </div>
  );
}

export default App;
```

在上面的代码中，我们对 *test* 函数做了缓存，从而保证每次传入到子组件的这个 *props* 和之前是相同的。

**记住：*useCallback* 主要就是对函数进行缓存**

## *useMemo*

最后要介绍的是 **useMemo**，其语法如下：

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

主要用于返回一个 *memoized* 值。

文档地址：*https://zh-hans.react.dev/reference/react/useMemo*

某些时候，组件中某些值需要根据状态进行一个二次计算（类似于 *Vue* 中的计算属性），由于函数组件一旦重新渲染，就会重新执行整个函数，这就导致之前的二次计算也会重新执行一次，例如：

```js
import React, { useState } from 'react';

function App() {

  const [count, setCount] = useState(1);
  const [val, setValue] = useState('');

  console.log("App 渲染了");

  function getNum() {
    console.log('调用了！！！');
    return count + 100;
  }


  return (
    <div>
      <h4>总和：{getNum()}</h4>
      <div>
        <button onClick={() => setCount(count + 1)}>+1</button>
        {/* 文本框的输入会导致整个组件重新渲染 */}
        <input value={val} onChange={event => setValue(event.target.value)} />
      </div>
    </div>
  );
}

export default App;
```

在上面的示例中，文本框的输入会导致整个 *App* 组件重新渲染，但是 *count* 的值是没有改变的，所以 *getNum* 这个函数也是没有必要重新执行的。

此时，我们就可以使用 *useMemo* 来缓存这个计算值，除非 *count* 变了，否则直接使用缓存值，不需要重新做二次计算（调用 *getNum*）。

如下：

```js
import React, { useState,useMemo } from 'react';

function App() {

  const [count, setCount] = useState(1);
  const [val, setValue] = useState('');

  console.log("App 渲染了");


  const getNum = useMemo(() => {
    console.log('调用了！！！！！');
    return count + 100;
  }, [count])


  return (
    <div>
      <h4>总和：{getNum}</h4>
      <div>
        <button onClick={() => setCount(count + 1)}>+1</button>
        {/* 文本框的输入会导致整个组件重新渲染 */}
        <input value={val} onChange={event => setValue(event.target.value)} />
      </div>
    </div>
  );
}

export default App;
```

在上面的示例中，我们使用了 *useMemo* 来缓存二次计算的值，并设置了依赖项 *count*，只有在 *count* 发生改变时，才会重新执行二次计算。

