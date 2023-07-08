---
title: Stable Diffusion QR Code 101
date: 2023-07-08T05:00:00.000+00:00
lang: en
duration: 15min
draft: true
---

[[toc]]

<p>
<span i-carbon-events mr1 /> Co-authored by <a href="https://antfu.me" target="_blank">Anthony Fu</a> and ...
</p>

> Work in progress. This is a live document, will be updated as we learn more.
>
> If you are interested in contributing, [edit this page on GitHub](https://github.com/antfu/antfu.me/edit/main/pages/posts/ai-qrcode-refine.md).

A summary of discussions made in [QRBTF's Discord server](https://discord.gg/V9CNuqYfte) and [Anthony's Discord server](https://chat.antfu.me). Thanks to everyone who participated in those servers.

## What's a Stable Diffusion QR Code?

Images that generated with [Stable Diffusion](https://stability.ai/blog/stable-diffusion-public-release) and as QR Codes as [ControlNet](https://github.com/lllyasviel/ControlNet)'s input, to make the QR Code data points blend into the artwork while still being scannable by QR Code readers.

<figure>
  <div grid="~ cols-3 gap-1" lg:scale-120 md:scale-110>
    <img src="/images/ai-qrcode-101-example2.jpg" rounded shadow />
    <img src="/images/ai-qrcode-101-example1.jpg" rounded shadow />
    <img src="/images/ai-qrcode-101-example3.jpg" rounded shadow />
  </div>
  <figcaption class="mt0!" text-center>Examples from <a href="https://qrbtf.com/">QRBTF.com</a></figcaption>
</figure>

The original idea was created by people behind [QRBTF](https://qrbtf.com/), and first revealed on [this reddit](https://www.reddit.com/r/StableDiffusion/comments/141hg9x/controlnet_for_qr_code/) by [nhciao](https://www.reddit.com/user/nhciao/).

As of July 8th 2023, [QRBTF](https://qrbtf.com/) haven't released their model nor service yet, you can join their [Discord server](https://discord.gg/V9CNuqYfte) to get the latest news. The methods mentioned here are based on community's research and experiments.

## How to Generate?

There are a few online services you can try, but this guide will focus doing it locally on our own. You will need the basics knowledge of Stable Diffusion and ControlNet, a computer with a GPU (or a cloud GPU instance) to start.

There are two approaches to generate a stylized QR Code:

- **Text to Image with ControlNet** - Generate a image with prompts, and using ControlNet with a QR Code input to intervention the generation process.
  - [Stylistic QR Code with Stable Diffusion](/posts/ai-qrcode) - by Anthony Fu
  - [Refining AI Generated QR Code](/posts/ai-qrcode-refine) - by Anthony Fu
  - [[Video] 二维码融合技术2.0](https://www.bilibili.com/video/BV1zF411R7xg/) - by 赛博迪克朗
- **Image to Image** - Use a QR Code image as input, and let Stable Diffusion to redraw each part of the QR Code.
  - [How to make a QR code with Stable Diffusion](https://stable-diffusion-art.com/qr-code/) - by Andrew

We found that the **Text to Image approach produce much better results**, and it's easier to control the output. We will focus on that approach in this guide.

## ControlNet Models

Here are a few ControlNet models we found useful:

- [QR Pattern](https://civitai.com/models/90940/controlnet-qr-pattern-qr-codes)
- [QR Code Monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster)
- [IoC Lab Control Net](https://huggingface.co/ioclab/ioc-controlnet/tree/main/models)

// TODO: add a compare table, and a bit of explanation for each model

## The Code is Not Scannable

Before going into details, let's picture your goal of your QR Code first. Here are 3 typical approaches listed by [@1r00t](https://github.com/1r00t):

- Artistic code that scans 100% and is obvious but creative
- Code that is kind of hidden but with a bit of fiddling you get it
- Code that is completely hidden as sort of secret message

All these approaches are viable. They are on the different balance between the art and the functionality. It's better to have such expectation so you can tune your models, parameters and prompts accordingly.

### The Scanners

If you goal is to make a more blended-in QR Code, and you are okay with the code not being scannable by all QR Code readers, we recommend to iPhone's code scanner from Control Center, or the scanner from [WeChat](https://www.wechat.com/en/) to verify your QR Code. They are the most tolerant ones we found so far.

// TODO:

### Parameters

// TODO:

### Compare with the Original QR Code

// TODO: 

## Improving the QR Code

### Tweak the Input QR Code

The input QR Code is one of most important parts of the whole process to generate well-blended code.

You can refer to [this post](/posts/ai-qrcode-refine#generating-the-base-qr-code) to see a comparion of how different QR Code input affects the output.

We recommend to use [Anthony's QR Toolkit](https://qrcode.antfu.me/) to generate the QR Code, which allows you to customize the QR Code and distort as needed.

// TODO: generated a new grid for comparison

### Improve the Prompts

Theorically, you can use any models, any prompts you would like to generated those QR Codes.

To help the QR codes more blend in, we find that it's helpful to include some fluidity or fragmented items into the prompts, such as:

> Listed contributed by [@代々木](https://discord.com/channels/1120565504545935404/1121837799054778460/1127208037048918107), [@soloshi](https://discord.com/channels/1120565504545935404/1121837799054778460/1127207924905820160), et al.

<div py15>
  <div grid="~ cols-3 gap-x-2 gap-y-4" lg:scale-110 md:scale-105>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-ribbon.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>ribbon</b>
        <div text-xs mt1>by <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-feather.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>feather</b>
        <div text-xs mt1>by <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-refine-distort-result.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>leaves</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">Anthony Fu</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-lace.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>lace</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">Anthony Fu</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/og-icon.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>wave</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">-</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/og-icon.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>tissue</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">-</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-snow.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>snow</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">Anthony Fu</a></div>
      </figcaption>
    </figure>
  </div>
</div>

### Non-Square Image

> Idea credits to [@whmc76](https://space.bilibili.com/339984/)

To make the QR Code less obvious, you can try to generate a non-square image, leaving some extra space around the QR Code for the Stable Diffusion to be creative. With that, you can shift the focus of the viewers into the other parts of the image. 

For examples:

<figure>
  <img src="/images/ai-qrcode-101-non-square-example1.jpg" rounded shadow />
  <figcaption text-center>
    by <a href="https://antfu.me/" target="_blank">Anthony Fu</a>
  </figcaption>
</figure>

// TODO: add more examples

<!--
Ask for permissions: 
- https://discord.com/channels/1120565504545935404/1120739793563832381/1126186859064729630
- https://discord.com/channels/1120565504545935404/1120739793563832381/1125777899753066526
- https://discord.com/channels/1120565504545935404/1120739793563832381/1125311132974981151
- https://discord.com/channels/1120565504545935404/1121837799054778460/1127076655714811984
-->

To generate a non-square image, you can change the **Resize Mode** in ControlNet to `Resize and Fill` and change the Text to Image width or height.

![](/images/ai-qrcode-101-non-square-resize.png)

Or in the [Toolkit](https://qrcode.antfu.me/), you click the <span i-carbon-chevron-down/> button on **Margin** to expand the option and have different margins for each side.

![](/images/ai-qrcode-101-non-square-toolkit.png)

### Multiple ControlNet

// TODO: any one can help to explain this?

