---
title: 日常样式问题记录
date: 2020-11-14T14:49:49
lang: zh-CN
type: daily
duration: 10min
description: 记录日常开发中遇到的 CSS 样式问题及解决方案，包括标点符号换行、多行文字处理、文字超出显示省略号等常见样式技巧
---

[[toc]]

# web

## 标点符号不出现在行首且换行

```css
word-break: normal;
word-wrap: break-word;
```

## 多行文字处理

```css
/* 限制文字显示行数 */
word-wrap: break-word;
word-break: normal;
overflow: hidden;
line-clamp: 2;
/* 控制文字超出显示省略号 */
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
/* 多行文字溢出打点 */
display: -webkit-box;
overflow: hidden;
text-overflow: ellipsis;
word-wrap: break-word;
-webkit-line-clamp: 2; /* 行数 */
-webkit-box-orient: vertical;
```

## 移动端android line-height不居中的问题解决方法

一般文本垂直居中都是通过line-height来实现的，但是有些时候在安卓端line-height是不生效的

```css
span {
  height: 30px;
  line-height: 30px; /* 此处的line-height在Android上是不生效的 */
}
```

解决方法是给文本包裹元素的before伪元素添加以下css属性：

```css
span::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 100%;
  margin-top: 1px;
}
```

## ios键盘弹出导致表单input select等表单填写标签focus移位

原因：由于键盘弹出使得页面整体上移，键盘消失后，页面上移的元素不能回到原来的地方
解决方法：标签添加blur事件，通过window.scrollTo(0,0)使得页面回滚到原来的位置，有时候会有输入框点击不灵敏的情况出现，可以通过手动点击事件获取焦点

```html
<div @click="focus($event)">
  <textarea
    v-model="slogan.value"
    :placeholder="slogan.slogan_placeholder"
    @blur="blur"
    class="dialog-form-item"
  ></textarea>
</div>
```

```js
focus(e) {
  clearTimeout(this.blurTimer);
  e.target.focus();
}
blur() {
  this.blurTimer=setTimeout(()=>{
    window.scrollTo(0,0);
  },300);
}
```

## 禁止微信自带的下拉弹性效果

```js
document.body.addEventListener('touchmove', (e) => {
  e.preventDefault()
}, { passive: false })
// 安卓只有e.preventDefault就可以
// ios必须加上{ passive: false }才可以
// 就不需要fixed定位了
```

## css动画使用

css控制dom元素的变换
Background-position 控制背景图片移动在手机端可能会有效果（卡顿）性能问题
使用transform:translate() 效果更佳
使用transform:translate3d(0,0,0)可开启GPU渲染

## 视频自动播放

安卓不能自动播放，需要有点击事件的触发，才可以调用video的play方法

## 布局屏幕适配解决方案

1、通过百分比设置宽高(vh, vw)
2、通过flex布局，给固定内容指定高度不变，其他部分可以通过自适应方式解决
例如对于页面分为两块的，上面自适应，下面高度固定：

```css
div {
  display: flex;
  div {
    flex: 1;
  }
  div {
    height: 500px;
  }
}
```

## 样式冲突问题

1、样式隔离
2、特殊命名

## flex布局下，子元素内容超出打点省略

在下面的左右两栏布局中，我们要实现的是在最外层父级元素自适应宽度（跟随屏幕宽度）的情况下，子元素不定宽实现内容自适应超出打点省略。即 container 自适应宽度（跟随屏幕宽度），right定宽，left自适应宽度。实现left下context内容不换行超出打点省略，则需要在left元素上添加`overflow: hidden`属性即可实现。

```html
<div class="container">
  <div class="wrap">
    <div class="left">
      <div class="title">我是一个title</div>
      <div class="sub-title">
        <div class="context">此处是需要打点省略的长文案</div>
      </div>
    </div>
    <div class="right">取消按钮</div>
  </div>
</div>
```

通过css实现如下：

```css
.container {
  display: inline-block;
  width: 240px; /* 此处宽度为模拟屏幕宽度（可理解为定宽） */
  background-color: #ccc;
}
.wrap {
  display: flex;
}
.left {
  border: 2px solid #f40;
  border-radius: 5px;
  overflow: hidden;
}
.left .title {
  font-size: 24px;
  font-weigth: 500;
}
.left .sub-title .context {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.right {
  width: 80px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border: 2px solid #111;
  border-radius: 5px;
}
```

## 实现1px的边框

```html
<div class="border">按钮</div>
```

```css
.border {
  position: relative;
  padding: 5px 10px;
  display: inline-block;
}
.border::after {
  position: absolute;
  left: 0;
  top: 0;
  content: '';
  display: inline-block;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  border: 1px solid #f40;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0);
  transform: scale(0.5);
  transform-origin: left top;
}
```
