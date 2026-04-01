---
title: Babel Type
date: 2024-11-14T16:43:27
lang: zh-CN
type: blog
duration: 10min
description: 深入解析 Babel 核心工具库，包括 @babel/core、@babel/cli、@babel/preset-env、@babel/plugin-transform-runtime 等常用包的作用与用法
---

[[toc]]

## Babel 的核心工具库

Babel 是一个广泛使用的 JavaScript 编译器和工具链，主要用于将现代 JavaScript（包括 ECMAScript 新标准、TypeScript、JSX 等）代码转换为向后兼容的 JavaScript 代码，以支持旧版本的浏览器或运行环境。Babel 的核心是其插件系统和工具库，这些工具库提供了各种功能来处理代码的编译、转换和分析。

### @babel/core

简介: Babel 的核心库，包含 Babel 的主要编译逻辑。它负责加载配置文件、应用插件、执行代码转换等。

用途: 用于编译代码，通过调用 babel.transform、babel.transformSync 等方法，可以将代码转换为目标版本的 JavaScript。

### @babel/cli

简介: Babel 的命令行工具，用于在命令行中编译文件和目录。

用途: 通过命令行执行 Babel 编译任务，适合自动化构建流程或手动编译。

示例:

```bash
babel src --out-dir lib
```

### @babel/preset-env

简介: Babel 的一个预设（preset），用于智能地选择需要的 Babel 插件，以转换最新的 ECMAScript 代码为向后兼容的 JavaScript。

用途: 根据目标浏览器或环境的兼容性需求，自动应用适当的 Babel 插件。

示例:
```json
{
  "presets": ["@babel/preset-env"]
}
```

### @babel/preset-react

简介: 用于将 JSX 语法和 React 特定的语法转换为普通 JavaScript。

用途: 在 React 项目中，自动处理 JSX 语法转换。

示例:
```json
{
  "presets": ["@babel/preset-react"]
}
```

### @babel/preset-typescript

简介: 用于将 TypeScript 代码转换为普通 JavaScript，但不包括类型检查。

用途: 在 TypeScript 项目中使用，处理 TypeScript 语法，但类型检查仍需借助 TypeScript 编译器 tsc。

示例:
```json
{
  "presets": ["@babel/preset-typescript"]
}
```

### @babel/plugin-transform-runtime

简介: 用于优化 Babel 编译的输出，减少冗余代码的生成，特别是当代码中使用了很多辅助函数时。

用途: 减少编译后的代码体积，尤其是在需要兼容旧环境时。

示例:
```json
{
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### @babel/plugin-proposal-class-properties

简介: 支持 JavaScript 中的类属性语法（包括静态属性）。

用途: 使 Babel 可以正确处理类属性的编译。

示例:

```json
{
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

## Babel 的辅助工具库

### @babel/parser

简介: Babel 的 JavaScript 解析器，将代码解析为抽象语法树（AST）。

用途: 用于分析、转换、检查 JavaScript 代码结构，是 Babel 插件开发的重要工具。

示例:

```js
const parser = require('@babel/parser');
const ast = parser.parse(code);
```

### @babel/traverse

简介: 用于遍历和修改 Babel 生成的 AST。

用途: 在插件中用于访问和更改 AST 节点。

示例:

```js
const traverse = require('@babel/traverse').default;
traverse(ast, {
  enter(path) {
    console.log(path.node);
  }
});
```

### @babel/types

简介: 提供了一组工具函数，用于生成和验证 Babel 的 AST 节点。

用途: 在 Babel 插件中创建、修改或检查 AST 节点。

示例:

```js
const t = require('@babel/types');
const newNode = t.identifier('newVariable');
```

### @babel/generator

简介: 将 AST 重新生成代码。

用途: 在代码转换后生成新代码，通常与 @babel/parser 和 @babel/traverse 配合使用。

示例:

```js
const generate = require('@babel/generator').default;
const code = generate(ast).code;
```

### @babel/register

简介: 在 Node.js 中动态编译使用新语法的文件。

用途: 在运行时自动编译 JavaScript 文件，允许你在 Node.js 中直接使用新语法而无需预先编译。

示例:

```js
require('@babel/register');
require('./index.js');
```

## Babel 插件开发工具

### @babel/template

简介: 提供模板字符串功能，帮助快速生成 AST 节点。

用途: 在插件开发中，使用模板快速创建代码结构。

示例:

```js
const template = require('@babel/template').default;
const buildRequire = template(`  var IMPORT_NAME = require(SOURCE);`);
const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});
```
### @babel/helper-plugin-utils

简介: 提供一些工具函数，简化 Babel 插件的编写。

用途: 用于创建 Babel 插件时，处理插件配置和选项。

示例:
```js
const { declare } = require('@babel/helper-plugin-utils');
module.exports = declare((api, options) => {
  api.assertVersion(7);
  return {
    visitor: {
      Identifier(path) {
        // ...
      }
    }
  };
});
```