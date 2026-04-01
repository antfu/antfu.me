---
title: Vue3.4中.vue文件编译流程图
date: 2024-11-14T17:01:36
lang: zh-CN
type: daily
duration: 10min
description: 图解 Vue3.4 中 .vue 文件的编译流程，从 @vite/plugin-vue 插件入口开始，详解 template 和 script 的解析与转换过程
---

[[toc]]

以` vite `配置中的` @vite/plugin-vue `插件为入口
如何将vue文件编译为js

![alt text](./image.png)

setup语法解析

![alt text](./image-1.png)
