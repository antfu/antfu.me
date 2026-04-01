---
title: Node模块的查找
date: 2021-11-14T14:48:14
lang: zh-CN
type: daily
duration: 10min
description: 深入理解 Node.js 中模块的查找机制，包括绝对路径、相对路径、核心模块、文件模块和第三方模块的加载流程
---

[[toc]]

## 模块的查找

说到node模块，首先想起的可能就是关于模块的查找了。我们知道在node环境中是通过require函数导入模块，它可以接收一个path作为参数，而这个path呢，有两种，一种是绝对路径，一种是相对路径（其实在模块的加载过程中，相对路径最终都会被转化为绝对路径）。

### 绝对路径和相对路径

绝对路径的话应该就不用多说了，就直接加载对应的文件。

模块的查找主要是针对于导入相对路径的模块。

在node中，模块主要分为三类：核心模块（内置模块，类似fs、path等）、文件模块（自己写的）、第三方模块（通过npm包安装的）。所以模块的引用方式也就是两种：路径和模块名。通过路径的方式导入，将当前的路径转为绝对路径之后加载对应的文件模块内容。通过模块名导入的话，首先会先判断是不是内置模块，如果不是则按照一定的顺序进行查找，我们在模块中打印module对象，可以看到他有一个paths属性，模块的查找就是按照这个顺序来的。

```js
Module {
  ...
  paths: [
    '/Users/xxx/mypro/code-demo/node-demo/node_modules',
    '/Users/xxx/mypro/code-demo/node_modules',
    '/Users/xxx/mypro/node_modules',
    '/Users/xxx/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```

### 关于后缀名

对于模块文件的后缀名，可以不加，node在解析模块时，会自动补全后缀名（如js、json、node、mjs）。它会按照一定的顺序去为你的模块添加后缀名，然后查找。

### 关于文件名

如果导入模块时，只提供了目录，没有提供文件名，则会自动寻找目录中的index.js文件，但是当导入npm包时，只提供目录，则会使用包中的package.json文件中的main字段的值，作为包的入口文件，默认值为index.js。

> 待更新...
