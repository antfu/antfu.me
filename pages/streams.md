---
title: Streams - Anthony Fu
display: ''
plum: true
items:
  - title: '用 Vue 写个扫雷吧！'
    date: '2022-03-09'
    path: 'https://www.bilibili.com/video/BV1ia411b7jY'
    platform: Bilibili
    lang: 'zh'
  - title: '用 Vue 写个扫雷之二'
    date: '2022-03-12'
    path: 'https://www.bilibili.com/video/BV15b4y1s7it'
    platform: Bilibili
    lang: 'zh'
  - title: '用 Canvas 做梅花生长动画'
    date: '2022-03-15'
    path: 'https://www.bilibili.com/video/BV1wY411n7er'
    platform: Bilibili
    lang: 'zh'
  - title: '实现 UnoCSS 自动补全'
    date: '2022-03-15'
    path: 'https://www.bilibili.com/video/BV1y3411W7YG'
    platform: Bilibili
    lang: 'zh'
  - title: '写个聪明的打字机'
    date: '2022-03-20'
    path: 'https://www.bilibili.com/video/BV1bZ4y167gz'
    platform: Bilibili
    lang: 'zh'
  - title: '实现 Vite 插件 import.meta.glob'
    date: '2022-03-27'
    path: 'https://www.bilibili.com/video/BV1ea411x7zm'
    platform: Bilibili
    lang: 'zh'
  - title: 'Vue 全自动引入黑魔法'
    date: '2022-03-29'
    path: 'https://www.bilibili.com/video/BV1L34y147jA'
    platform: Bilibili
    lang: 'zh'
  - title: '起飞！跨路由 Vue 组件动画实验'
    date: '2022-04-01'
    path: 'https://www.bilibili.com/video/BV1na41147qR'
    platform: Bilibili
    lang: 'zh'
  - title: '差点坠机！跨路由 Vue 组件动画实验'
    date: '2022-04-05'
    path: 'https://www.bilibili.com/video/BV1sa41147qH'
    platform: Bilibili
    lang: 'zh'
  - title: 'Create with Anthony Fu - A World Clock EP1'
    platform: YouTube
    date: '2022-06-11'
    path: 'https://www.youtube.com/watch?v=-EHoncCeg_Y'
    lang: 'en'
  - title: 'Create with Anthony Fu - A World Clock EP2'
    platform: YouTube
    date: '2022-06-12'
    path: 'https://www.youtube.com/watch?v=8vfDZqZLiG8'
    lang: 'en'
  - title: 'Live AMA'
    platform: YouTube
    date: '2022-06-23'
    path: 'https://www.youtube.com/watch?v=Am60EtlGm9Y'
    lang: 'en'
  - title: '读评论！AMA'
    date: '2022-06-23'
    path: 'https://www.bilibili.com/video/BV11W4y167Uu'
    platform: Bilibili
    lang: 'zh'
  - title: '获取包的所有导出函数'
    date: '2022-06-28'
    path: 'https://www.bilibili.com/video/BV1Z34y1H7fJ'
    platform: Bilibili
    lang: 'zh'
  - title: 'VueUse 9.0 / Slidev / UnoCSS 一通乱播'
    date: '2022-07-08'
    path: 'https://www.bilibili.com/video/BV1qB4y1i76x'
    platform: Bilibili
    lang: 'zh'
  - title: '开源探店第一期'
    date: '2022-09-19'
    path: 'https://www.bilibili.com/video/BV1Bt4y1j7L5'
    platform: Bilibili
    lang: 'zh'
  - title: '开源探店第二期'
    date: '2022-10-09'
    path: 'https://www.bilibili.com/video/BV1he4y1n7w8'
    platform: Bilibili
    lang: 'zh'
  - title: 'Nuxt，进一步的开发者体验'
    date: '2023-02-13'
    path: 'https://www.bilibili.com/video/BV1vx4y1V7VD'
    platform: Bilibili
    lang: 'zh'
  - title: '直播打工1 - Nuxt DevTools SEO 工具'
    date: '2023-05-05'
    path: 'https://www.bilibili.com/video/BV1eh4y1J75z'
    platform: Bilibili
    lang: 'zh'
---

<SubNav />

<div slide-enter>

<div i-ri:vidicon-2-line mr2 />
<span op50>Live streaming at <a href="https://www.youtube.com/anthonyfu7" target="_blank">YouTube</a> & <a href="https://space.bilibili.com/668380" target="_blank">哔哩哔哩</a></span>

</div>

<ListPosts :posts="frontmatter.items.reverse()" />
