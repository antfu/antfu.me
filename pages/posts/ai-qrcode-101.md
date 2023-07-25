---
title: Stable Diffusion QR Code 101
date: 2023-07-10T05:00:00.000+00:00
lang: en
duration: 35min
tocAlwaysOn: true
---

[[toc]]

<p>
<span i-carbon-events mr1 /> Co-authored by <a href="https://antfu.me" target="_blank">Anthony Fu</a>, <a href="https://space.bilibili.com/339984/" target="_blank">赛博迪克朗</a>, wangcai and <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a>
</p>

> **This is a live document**, will be updated as we learn more. Check back occasionally.

A summary of discussions made in [QRBTF's Discord server](https://discord.gg/V9CNuqYfte) and [Anthony's Discord server](https://chat.antfu.me). Thanks to everyone who participated in those servers.

## What's a Stable Diffusion QR Code?

Images that are generated with [Stable Diffusion](https://stability.ai/blog/stable-diffusion-public-release) with QR Codes as [ControlNet](https://github.com/lllyasviel/ControlNet)'s input, making the QR Code data points blend into the artwork while still being scannable by QR Code readers.

<figure pt-5>
  <div grid="~ cols-1 md:cols-3 gap-1" lg:scale-120 md:scale-110>
    <img src="/images/ai-qrcode-101-example2.jpg" rounded shadow important-m0 />
    <img src="/images/ai-qrcode-101-example1.jpg" rounded shadow important-m0 />
    <img src="/images/ai-qrcode-101-example3.jpg" rounded shadow important-m0 />
  </div>
  <figcaption important-mt8 text-center>Examples from <a href="https://qrbtf.com/">QRBTF.com</a></figcaption>
</figure>

The original idea was created by the people behind [QRBTF](https://qrbtf.com/), and was first revealed on [this reddit](https://www.reddit.com/r/StableDiffusion/comments/141hg9x/controlnet_for_qr_code/) by [nhciao](https://www.reddit.com/user/nhciao/).

[QRBTF](https://qrbtf.com/) recently launched [their online generation service for open beta](https://qrbtf.com/ai). As of July 14th, 2023, they haven't released their model or methodology yet, you can join their [Discord server](https://discord.gg/V9CNuqYfte) to follow the latest news.

The methods mentioned in this guide are **based on community research and experiments**.

## How to Generate?

There are a few online services you can try, but this guide will focus on doing it locally on our own. You will need the basic knowledge of Stable Diffusion and ControlNet, a computer with a GPU (or a cloud GPU instance) to start. 

If you are new to Stable Diffusion, we recommend reading these guides to get started:

- [Stable Diffusion Knowledge Hub](https://aituts.com/stable-diffusion/)
- [Stable Diffusion LoRA Models](https://aituts.com/stable-diffusion-lora/)

Once you set them up, there are two approaches to generating a stylized QR Code:

### Method A: **Text to Image with ControlNet**

Generate an image with prompts, and use ControlNet with a QR Code input to intervention the generation process.

- [Stylistic QR Code with Stable Diffusion](/posts/ai-qrcode) - by Anthony Fu
- [Refining AI Generated QR Code](/posts/ai-qrcode-refine) - by Anthony Fu
- [[Video] 二维码融合技术2.0](https://www.bilibili.com/video/BV1zF411R7xg/) - by 赛博迪克朗

### Method B: **Image to Image** 

Use a QR Code image as input, and let Stable Diffusion redraw each part of the QR Code. Doesn't require ControlNet.

- [How to make a QR code with Stable Diffusion](https://stable-diffusion-art.com/qr-code/) - by Andrew

### Our Recommendation

We found that Method A, **Text to Image approach produces much better results**, and it's easier to control the output. We will mostly focus on that approach in this guide.

## ControlNet Models

Here are a few ControlNet models we found useful:

- [QR Pattern](https://civitai.com/models/90940/controlnet-qr-pattern-qr-codes)
- [QR Code Monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster)
- [IoC Lab Control Net](https://huggingface.co/ioclab/ioc-controlnet/tree/main/models)
  - Brightness Model
  - Illumination Model

See [model comparison](#model-comparison) section for more details.

## The Code is Not Scannable

Before going into details, let's picture the goal of your QR Code first. Here are 3 typical approaches listed by [@1r00t](https://github.com/1r00t):

- Artistic code that scans 100% and is obvious but creative
- Code that is kind of hidden but with a bit of fiddling you get it
- Code that is completely hidden as a sort of secret message

All these approaches are viable. They are on a different balance between the art and the functionality. It's better to have such expectations so you can tune your models, parameters and prompts accordingly.

<hr>

### Scanners

When the images are generated, we will use a QR Code scanner to verify if the code is scannable. 

If your goal is to make a more blended-in QR Code, and you are okay with the code not being scannable by all QR Code readers, it's better to use an error-tolerant scanner to verify. We recommend using iOS's code **scanner from the Control Center**, or the scanner from [WeChat](https://www.wechat.com/en/) to verify your QR Code. They are the most tolerant ones we found so far.

Meanwhile, if you failed to find a good scanner on your phone, or want to verify the QR Codes directly in your computer, we recently enrolled a [new scanner in Anthony's QR Toolkit](https://qrcode.antfu.me/#scan), based on [WeChat's open sourced algorithm](https://docs.opencv.org/4.5.4/d5/d04/classcv_1_1wechat__qrcode_1_1WeChatQRCode.html) (Ported to WebAssembly, source code at [antfu/qr-scanner-wechat](https://github.com/antfu/qr-scanner-wechat)).

![](/images/ai-qrcode-101-toolkit-scanner.png)

<hr>

### Compare with the Original QR Code

You can use [Anthony's QR Toolkit](https://qrcode.antfu.me/) to compare the generated QR Code with the original one. It will show you the mismatches and help you to optimize the generation process.

![](/images/ai-qrcode-refine-compare-2.png)

Read more about it in [this post](/posts/ai-qrcode-refine).

<hr>

## Parameters

### ControlNet

The parameters of the ControlNet affect when and how the control is applied to the generation process.

- **Control weight** - The weight of the ControlNet. The higher the weight, the more the output will be affected by the ControlNet.
- **Start control step** - The percentage of the generation process when the ControlNet starts to take effect.
- **End control step** - The percentage of the generation process when the ControlNet stops taking effect.

<div relative flex="~ col items-center" py3>
  <div absolute top-0 left="1/14" translate-x="-1/2" hidden md:block>prompts</div>
  <div absolute top-0 left="5/12" translate-x="-1/2">prompts + control net</div>
  <div absolute top-0 left="10/12" translate-x="-1/2">prompts</div>
  <div w-full mt-1.5em h-1em rounded bg-gray:10 border="~ base" relative>
    <div absolute left="1/6" bg-yellow op80 w="3/6" h-full/>
  </div>
  <div absolute top-2.7em flex="~ col items-center" left="1/6" translate-x="-1/2">
    <div i-ri-arrow-up-s-fill text-lg/>
    <div>Control Start</div>
  </div>
   <div absolute top-2.7em flex="~ col items-center" left="4/6" translate-x="-1/2">
    <div i-ri-arrow-up-s-fill text-lg/>
    <div>Control End</div>
  </div>
</div>

<div mt-14 />

The start control step will allow the prompts and the model to be creative before it knows the QR Code control exists. And the end control step will allow the model to try to blend the QR Code into the artwork more (but will make the code less scannable).

It requires a few trials and errors to find the right balance so that the ControlNet has enough time to intervene, but not too much so the code can be artistic enough.

Different models might have different strengths of the control, so you might need to adjust the parameters accordingly. It's better to read their instructions first.

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://space.bilibili.com/339984/" target="_blank">赛博迪克朗</a>
</div>

### Model Comparison

Thanks a lot to [赛博迪克朗](https://space.bilibili.com/339984/) for running the following matrixes against each model.

Here is the original image (without ControlNet) and the QR Code Input:

<div grid="~ cols-2 gap-4">
  <figure important-m0>
    <img src="/images/ai-qrcode-101-multi-cn-original.png" rounded shadow  />
    <figcaption text-center>
      Original Image
    </figcaption>
  </figure>
  <figure important-m0>
    <img src="/images/ai-qrcode-101-multi-cn-qr.png" rounded shadow  />
    <figcaption text-center>
      QR Code
    </figcaption>
  </figure>
</div>

The comparison matrixes are generated with the exact same prompts and same seed as the original image, but only the parameters of the ControlNet are changed.

<details>
<summary cursor-pointer select-none>Detailed prompts and paramaters</summary>

<div class="code-wrap" border="~ base rounded" px4 pt3 mt2>

```ruby
best quality, masterpiece, depth of field, 1girl, dress, trees, flowers, sky, water
```

```ruby
NSFW, nude, bad-hands-5, bad-picture-chill-75v, badhandv4, easynegative, ng_deepnegative_v1_75t, verybadimagenegative_v1.3, bhands-neg, watermark, character watermark, photo date watermark, Date watermarking
```

- Checkpoint: [PrimeMix](https://civitai.com/models/28779/primemix)
- Steps: 50
- Sampler: DPM++ 2M SDE Karras
- CFG scale: 7
- Seed: 1902542336
- Size: 768x1024

</div>

</details>

You can **drag the sliders** below to see the difference between the start and end control steps:

#### [QR Pattern Model](https://civitai.com/models/90940/controlnet-qr-pattern-qr-codes)

<div grid="~ cols-1 md:cols-2 gap-2">
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-pattern-start.webp"
    xTitle="Weight"
    :xScale="{ min: 0.7, max: 1.6, step: 0.1}"
    :xValue="3"
    yTitle="Start"
    :yScale="{ min: 0.1, max: 0.5, step: 0.1}"
    :aspectRatio="0.75"
    :fixedRowsAfter="[['End', '1.0']]"
    :fixedRowsBefore="[['Model', 'QR Pattern']]"
  >
    <template #post="{ xValue, yValue }">
      <QRCodeControlNetScale :start="+yValue" :end="1" :weight="+xValue" />
    </template>
  </QRCodeMatrix>
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-pattern-end.webp"
    xTitle="Weight"
    :xScale="{ min: 0.7, max: 1.6, step: 0.1 }"
    :xValue="3"
    yTitle="End"
    :yScale="{ min: 0.4, max: 1.0, step: 0.1 }"
    :aspectRatio="0.75"
    :fixedRowsBetween="[['Start', '0']]"
    :fixedRowsBefore="[['Model', 'QR Pattern']]"
  >
    <template #post="{ xValue, yValue }">
      <QRCodeControlNetScale :start="0" :end="+yValue" :weight="+xValue" />
    </template>
  </QRCodeMatrix>
</div>

#### [QR Code Monster Model](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster)

<div grid="~ cols-1 md:cols-2 gap-2">
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-monster-start.webp"
    xTitle="Weight"
    :xScale="{ min: 0.7, max: 1.6, step: 0.1 }"
    :xValue="3"
    yTitle="Start"
    :yScale="{ min: 0.1, max: 0.5, step: 0.1 }"
    :aspectRatio="0.75"
    :fixedRowsAfter="[['End', '1.0']]"
    :fixedRowsBefore="[['Model', 'QR Code Monster']]"
  >
    <template #post="{ xValue, yValue }">
      <QRCodeControlNetScale :start="+yValue" :end="1" :weight="+xValue" />
    </template>
  </QRCodeMatrix>
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-monster-end.webp"
    xTitle="Weight"
    :xScale="{ min: 0.7, max: 1.6, step: 0.1 }"
    :xValue="3"
    yTitle="End"
    :yScale="{ min: 0.4, max: 1.0, step: 0.1 }"
    :aspectRatio="0.75"
    :fixedRowsBetween="[['Start', '0']]"
    :fixedRowsBefore="[['Model', 'QR Code Monster']]"
  >
    <template #post="{ xValue, yValue }">
      <QRCodeControlNetScale :start="0" :end="+yValue" :weight="+xValue" />
    </template>
  </QRCodeMatrix>
</div>

#### [IoC Lab Brightness Model](https://huggingface.co/ioclab/ioc-controlnet/tree/main/models)

<div grid="~ cols-1 md:cols-2 gap-2">
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-brightness-start.webp"
    xTitle="Weight"
    :xScale="{ min: 0.1, max: 0.9, step: 0.1 }"
    :xValue="1"
    yTitle="Start"
    :yScale="{ min: 0, max: 0.5, step: 0.1 }"
    :aspectRatio="0.75"
    :fixedRowsAfter="[['End', '0']]"
    :fixedRowsBefore="[['Model', 'IoC Lab Brightness']]"
  >
    <template #post="{ xValue, yValue }">
      <QRCodeControlNetScale :start="+yValue" :end="1" :weight="+xValue" />
    </template>
  </QRCodeMatrix>
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-brightness-end.webp"
    xTitle="Weight"
    :xScale="{ min: 0.1, max: 0.9, step: 0.1 }"
    :xValue="2"
    yTitle="End"
    :yScale="{ min: 0.5, max: 1.0, step: 0.1 }"
    :aspectRatio="0.75"
    :fixedRowsBetween="[['Start', '0']]"
    :fixedRowsBefore="[['Model', 'IoC Lab Brightness']]"
  >
    <template #post="{ xValue, yValue }">
      <QRCodeControlNetScale :start="0" :end="+yValue" :weight="+xValue" />
    </template>
  </QRCodeMatrix>
</div>

<hr>

## Improve the Result

Say that you already generated a bunch of QR Codes and find some of them you like. You want to improve them to make them more scannable, or more blended-in, or more artistic. Here are some tips we found useful.

### Tweak the Input

The **input QR Code is one of the most important parts** of the whole process to generate well-blended code.

You can refer to [this post](/posts/ai-qrcode-refine#generating-the-base-qr-code) to see a comparison of how different QR Code input affects the output.

![Comparison grid between different styled QR Code as input](/images/ai-qrcode-refine-input-compare.jpg)

We recommend using [Anthony's QR Toolkit](https://qrcode.antfu.me/) to generate the QR Code. It allows you to customize the QR Code and distort it as needed.

Meanwhile, the margin area of the QR Code also affects the look and feel, for example:

<div flex="~ col items-center gap-4" py4>
<QRCodeCompare scale-85 md:scale-100 h-100 input="/images/ai-qrcode-101-input-edit1-i.png" output="/images/ai-qrcode-101-input-edit1-o.jpg" />
<div><div i-ri-arrow-down-line/> Adding some noise to the margin</div>
<QRCodeCompare scale-85 md:scale-100 h-100 input="/images/ai-qrcode-101-input-edit2-i.png" output="/images/ai-qrcode-101-input-edit2-o.jpg" />
<div><div i-ri-arrow-down-line/> Manually connect some points in margin (Photoshop etc.)</div>
<QRCodeCompare scale-85 md:scale-100 h-100 input="/images/ai-qrcode-101-input-edit6-i.png" output="/images/ai-qrcode-101-input-edit6-o.jpg" />
</div>

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a>
</div>

### Improve the Prompts

Theoretically, you can use any prompts to generate those QR Codes.

To help the QR codes more blend in, we find that it's helpful to include some fluidity or fragmented items in the prompts.

#### Example Outputs

<div py15>
  <div grid="~ md:cols-3 cols-2 gap-x-2 gap-y-4" lg:scale-110 md:scale-105>
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
        <b text-lg>plants</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">Anthony Fu</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-bird.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>bird</b>
        <div text-xs mt1>by <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a></div>
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
      <img src="/images/ai-qrcode-101-prompt-snow.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>snow</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">Anthony Fu</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-wave.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>wave</b>
        <div text-xs mt1>by <a href="https://v.douyin.com/iDLHquJ/" target="_blank">五倍速企鹅</a></div>
      </figcaption>
    </figure>
     <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-katana-swords.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>katana swords</b>
        <div text-xs mt1>by <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-shibori-patterns.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>shibori patterns</b>
        <div text-xs mt1>by <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-buildings.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>buildings</b>
        <div text-xs mt1>by <a href="https://space.bilibili.com/251938958" target="_blank">阿帝</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-leaf.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>leaf</b>
        <div text-xs mt1>by <a href="https://v.douyin.com/iDLHquJ/" target="_blank">五倍速企鹅</a></div>
      </figcaption>
    </figure>
  </div>
</div>

#### Example Prompts

<p class="code-wrap">

**Ribbon** - by [代々木](https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f)

```ruby
(1 girl:1.6), full body, from side, ultra wide shot, (azure blue dress:1.3), (grey long hair:1.3), (white ribbon:1.6), (white lace:1.6), BREAK, (dark background:1.3)
```

**Feather** - by [代々木](https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f)

```ruby
(1 girl:1.3), upper body, (grey long hair:1.3), (blue dress:1.3), zigzag patterns, graphic impact, (white feathers:1.6), BREAK, (dark background:1.3)
```

**Birds** - by [代々木](https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f)

```ruby
(1 girl:1.3), upper body, rosemaling patterns, Norwegian folk art, decorative designs, vibrant colors, (white birds:1.6), BREAK, (dark background:1.3)
```

**Wave** - by [五倍速企鹅](https://v.douyin.com/iDLHquJ/)

```ruby
(1 girl:1.3),(white dress:1.3), upper body, blonde hair, from side, decorative designs, (wave:1.3),BREAK, (blue background:1.3)
```

**Leaf** - by [五倍速企鹅](https://v.douyin.com/iDLHquJ/)

```ruby
(1 girl:1.3),(pink dress:1.3), upper body, white hair, from side, decorative designs, (leaf:1.6),BREAK, (sunset background:1.3)
```

</p>

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to wangcai
</div>

### XYZ Plot

In case you are uncertain about which model or prompts to use, you can utilize the XYZ Plot script to generate a matrix of images with different prompts and models for easier comparison.

![](/images/ai-qrcode-101-xyz.png)

You can learn more about how to use XYZ plot in [this tutorial](https://gigazine.net/gsc_news/en/20220909-automatic1111-stable-diffusion-webui-prompt-matrix/).

Below is an example of a matrix runned by `wangcai`, testing some popular checkpoint models and the prompts we mentioned above. You can click to select different combinations, or click the image to see the full matrix.

<QRCodeMatrixModelPrompts />

Similarly, this is a matrix testing samplers:

<QRCodeMatrixModelSamplers />

We encourage you to try different prompts and models to find the best combination for your use case.


<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://space.bilibili.com/339984/" target="_blank">赛博迪克朗</a>
</div>

### Non-Square Image

To make the QR Code less obvious, you can try to generate a non-square image, leaving some extra space around the QR Code for the Stable Diffusion to be creative. With that, you can shift the focus of the viewers to the other parts of the image. 

<figure>
  <img src="/images/ai-qrcode-101-non-square-example3.jpg" rounded shadow />
  <figcaption text-center>
    by <a href="https://antfu.me/" target="_blank">Anthony Fu</a>
  </figcaption>
</figure>

<figure>
  <img src="/images/ai-qrcode-101-non-square-example1.jpg" rounded shadow />
  <figcaption text-center>
    by <a href="https://antfu.me/" target="_blank">Anthony Fu</a>
  </figcaption>
</figure>

To generate a non-square image, you can change the **Resize Mode** in ControlNet to `Resize and Fill` and change the Text to Image width or height.

![](/images/ai-qrcode-101-non-square-resize.png)

Or in the [Toolkit](https://qrcode.antfu.me/), you click the <span i-carbon-chevron-down/> button on **Margin** to expand the option and have different margins for each side.

![](/images/ai-qrcode-101-non-square-toolkit.png)

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://www.instagram.com/terryberrystudio" target="_blank">lameguy</a>
</div>

### Perspective

You can also try to apply some perspective transformation to the QR Code to make it more interesting.

<div grid="~ cols-2 gap-2">
  <figure>
    <img src="/images/ai-qrcode-101-perspective-ep1.png" rounded shadow />
    <figcaption text-center>
      by <a href="https://www.instagram.com/terryberrystudio" target="_blank">lameguy</a>
    </figcaption>
  </figure>

  <figure>
    <img src="/images/ai-qrcode-101-perspective-ep2.png" rounded shadow />
    <figcaption text-center>
      by <a href="https://www.instagram.com/terryberrystudio" target="_blank">lameguy</a>
    </figcaption>
  </figure>
</div>

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://space.bilibili.com/339984/" target="_blank">赛博迪克朗</a>
</div>

### Multiple ControlNet

Multiple ControlNet layers are mainly used to increase the recognizability of the image when the model control is insufficient. Try to avoid the result deviation caused by excessive changes in the picture, causing the ideal picture cannot be obtained.

Difficulties in recognition may be due to changes in prompts or due to the characteristics of the SD model, resulting in too trivial details of the picture or too bright/dark overall tone to make it impossible to recognize.

This method can effectively improve the automatic recognition success rate of scanning.

Usually, we use **QR Code Monster** or **QR Code Pattern** model as the main guidance model, and use the **Brightness Model** from IoC Lab as the auxiliary model to improve the local contrast.

> <span i-ri-lightbulb-line text-yellow/> 赛博迪克朗: It's recommended to use the QR Monster model. The QR Pattern v2.0 still has too much interference, which may cause a great change in the style of the image.

For example, running the same prompts as [the previous example](#model-comparison), when using the **QR Code Monster** model alone (single model), with control steps 0.0 to 1.0, we got the following results with different weights:

<div grid="~ cols-2 md:cols-3 gap-2">
  <figure important-mb0 important-mt-2>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w100.png" rounded shadow  />
    <figcaption text-center>
      Weight: 1.0
    </figcaption>
  </figure>
  <figure important-mb0 important-mt-2>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w125.png" rounded shadow  />
    <figcaption text-center>
      Weight: 1.25
    </figcaption>
  </figure>
  <figure important-mb0 important-mt-2>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w140.png" rounded shadow  />
    <figcaption text-center>
      Weight: 1.4
    </figcaption>
  </figure>
  <figure  important-mb0 important-mt-2>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w150.png" rounded shadow  />
    <figcaption text-center>
      Weight: 1.5
    </figcaption>
  </figure>
  <figure important-mb0 important-mt-2>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w160.png" rounded shadow  />
    <figcaption text-center>
      Weight: 1.6
    </figcaption>
  </figure>
  <figure important-mb0 important-mt-2>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w170.png" rounded shadow  />
    <figcaption text-center>
      Weight: 1.7
    </figcaption>
  </figure>
</div>

We notice that only Weight 1.5 and 1.7 are scannable (and do not have very good error tolerant), and we also see the compositions of them are changed a lot as the weight increases.

So if we want to keep the original composition but still have good enough recognizability, we could add the **Brightness Model** as the second model.

<div grid="~ cols-1 md:cols-2 gap-4">
 <figure important-m0>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w100-s00-e10-brightness-w015-s01-e10.png" rounded shadow  />
    <figcaption text-center font-mono important-text-xs>
      Monster &nbsp;&nbsp;: Weight <b>1.00</b> Start <b>0.0</b> End <b>1.0</b><br>
      Brightness: Weight <b>0.15</b> Start <b>0.1</b> End <b>1.0</b>
    </figcaption>
  </figure>
  <figure important-m0>
    <img src="/images/ai-qrcode-101-multi-cn-monster-w100-s00-e10-brightness-w025-s04-e08.png" rounded shadow  />
    <figcaption text-center font-mono important-text-xs>
      Monster &nbsp;&nbsp;: Weight <b>1.00</b> Start <b>0.0</b> End <b>1.0</b><br>
      Brightness: Weight <b>0.25</b> Start <b>0.4</b> End <b>0.8</b>
    </figcaption>
  </figure>
</div>

We can see that even if we reduce the weight of the **Monster Model** to 1.0, the recognizability is as good as the single model with the Weight 1.5, while the composition is closer to the original image.

If you want to go further, it's also possible to try more models. For example, here is the result of using **QR Code Monster** and **Brightness Model** together with **QR Pattern**:

<div grid="~ cols-1 md:cols-[1fr_2fr_1fr] gap-4 justify-center">
  <div />
  <figure important-m0>
    <img src="/images/ai-qrcode-101-multi-cn-monster-monster-w100-brightness-w010-s04-e08-pattern-w010-s04-e08.png" rounded shadow  />
    <figcaption text-center font-mono important-text-xs>
      Monster &nbsp;&nbsp;: Weight <b>1.00</b> Start <b>0.0</b> End <b>1.0</b><br>
      Brightness: Weight <b>0.10</b> Start <b>0.4</b> End <b>0.8</b><br>
      QR Pattern: Weight <b>0.10</b> Start <b>0.4</b> End <b>0.8</b>
    </figcaption>
  </figure>
  <div />
</div>

> <span i-ri-lightbulb-line text-yellow/> If you didn't see the tabs for multiple layers of ControlNet, you can go to the settings page to enable it:
> ![](/images/ai-qrcode-101-multi-cn-settings.png)

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to wangcai
</div>

### OpenPose

To get more control over the composition, you can also use other ControlNet models like OpenPose to generate a human pose and use it as the input of the QR Code.

For example, you can see the following image is generated with both QR Code and OpenPose as the input. With some tricks on the composition, you can shift the focus of the viewers to the other parts of the image and make the QR Code less obvious.

<div flex="~ col items-center" py4>
  <QRCodeCompare scale-85 md:scale-100 h-80
    input="/images/ai-qrcode-101-openpose-qr.png"
    input2="/images/ai-qrcode-101-openpose-pose.png"
    output="/images/ai-qrcode-101-openpose-output1.jpg" 
  />
<!-- 
  <QRCodeCompare scale-85 md:scale-100 h-80
    input="/images/ai-qrcode-101-openpose-qr.png"
    input2="/images/ai-qrcode-101-openpose-pose.png"
    output="/images/ai-qrcode-101-openpose-output2.jpg" 
  /> -->

  <QRCodeCompare scale-85 md:scale-100 h-80 mt4
    input="/images/ai-qrcode-101-openpose-qr3.png"
    input2="/images/ai-qrcode-101-openpose-pose3.png"
    output="/images/ai-qrcode-101-openpose-output4.png" 
  />

  <QRCodeCompare scale-85 md:scale-100 h-80
    input="/images/ai-qrcode-101-openpose-qr2.png"
    input2="/images/ai-qrcode-101-openpose-pose2.png"
    output="/images/ai-qrcode-101-openpose-output3.png" 
  />
</div>

You can learn more about OpenPose in [this tutorial](https://stable-diffusion-art.com/controlnet/).

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://antfu.me" target="_blank">Anthony Fu</a>
</div>

### Selective Multi-layer Control

Look deep into the [QR Code specification](https://en.wikipedia.org/wiki/QR_code#Standards), you can see a QR Code is composed with different types of data and position patterns:

![](/images/ai-qrcode-101-qr-struct.png)

Other than the position markers that are obvious to find, we can see there are also the **Version and Format information** around the position markers. Those information are quite important because it tells the scanner how to decode the QR Code properly. On the other hand, since the **Data area** has good error correction and duplications, it's actually fine for it to contain a few misalignment when needed. Now we realize that many QR Code that are not scannable are because those area are not distinguishable enough, causing the scanner to exit early before going into the actual data. 

So, since the data points in a QR Code are **not equally important**, why would we control them equally? Maybe we could try to selective control different areas. Like increasing the control weight of the functional areas and decreasing the weight of the data area, to make the QR Code more scannable while being more artistic.

In the recent update of [QR Toolkit](https://qrcode.antfu.me/), we added a new option **Render Type** to only generate some specific areas of the QR Code, combining with a grey background, we could have:

> <span i-ri-lightbulb-line text-yellow/> Both **QR Pattern v2** and **QR Code Monster** models support having grey as the hint of arbitrary content (bypass the control). Thanks for the information from [Nacholmo](https://civitai.com/user/Nacholmo) and [Cyril Bareme](https://twitter.com/vyrilbareme).

![](/images/ai-qrcode-101-render-type.png)

With this, we could use two ControlNet layers:

- Layer 1: Full QR Code, with medium control weight.
- Layer 2: Selective parts of QR Code, with **strong weight** but shorter control steps.

For example, here I have two ControlNet layers, both using the **QR Code Monster** model:

<QRCodeSelectiveLayers />

> <span i-ri-lightbulb-line text-yellow/> In the second layer of the example, I excluded the position markers as I was seeking for more blend-in image. You can also include them if you want to make the QR Code more scannable.

After a few tweaks, the result are surprisingly good. It's able to retain the recognizability of the QR Code while being more artistic. Here are some of the results:

<div flex="~ col items-center gap-8" py6>
  <QRCodeCompare scale-85 md:scale-100 h-100
    input="/images/ai-qrcode-101-selective-qr1.png"
    input2="/images/ai-qrcode-101-selective-qr2.png"
    output="/images/ai-qrcode-101-selective-example1.jpg" 
  />

  <QRCodeCompare scale-85 md:scale-100 h-100
    input="/images/ai-qrcode-101-selective-qr1.png"
    input2="/images/ai-qrcode-101-selective-qr2.png"
    output="/images/ai-qrcode-101-selective-example2.jpg" 
  />

  <QRCodeCompare scale-85 md:scale-100 h-100
    input="/images/ai-qrcode-101-selective-qr1.png"
    input2="/images/ai-qrcode-101-selective-qr2.png"
    output="/images/ai-qrcode-101-selective-example3.jpg" 
  />
</div>

<hr>

<div border="~ rounded-full base" px3 py1 inline text-sm float-right>
<span i-ri-book-2-line /> Credits to <a href="https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster#tips" target="_blank">QR Code Monster</a>
</div>

### Image to Image Enhancement

When you find a generated image is hard to scan, you can try to send the image to `img2img`, enable ControlNet with your original QR Code input and:

- Decrease the **Denoising strength** to retain more of the original image.
- Increase the **Control weight** for better readability.
- A typical workflow for "saving" a code would be: Max out the guidance scale and minimize the denoising strength, then bump the strength until the code scans.

This tells the model to re-enhance the image by making dark areas darker and light areas lighter under the guidance of ControlNet.

<hr>

### Manually Editing and Inpainting

The ultimate solution is indeed to manually edit the output image. You can use editing tools like Photoshop combined with inpainting to fine-tune every part of the imaged image. It might require a lot of effort, we'd generally recommend focusing on tweaking the generation first before going to this step. More details can be found in [this post](/posts/ai-qrcode-refine).

## Extra: Hidden Text in Image

While the QR Code models are primarily designed for generating QR Codes, they are fundamentally brightness-contrast models. This means that they can be used to control and modify anything that exhibits distinct local contrast. So, in addition to generating QR Codes, we can utilize these models to hide text or any symbols inside the generated images. This opens up exciting possibilities for creative exploration beyond just QR Code generation.

For example, we could have this using the exact same methods we learned for generating QR Code:

![](/images/ai-qrcode-101-text-result1.jpg)

<details mt--6>
<summary op50 select-none>Input Image</summary>
<p>
<img src="/images/ai-qrcode-101-text-input1.png" rounded shadow important-mt0 />
</p>
</details>

You can click the image to see the full size. When you zoom in on the QR Code image, it can become challenging to distinguish the text from the background. However, when you zoom out significantly, the text becomes much clearer and easier to scan. This observation highlights an interesting aspect of human vision—our eyes are indeed excellent scanners. 

Similarly, we could combing with QR Code, or anything you can think of:

![](/images/ai-qrcode-101-text-result2.png)

<details mt--6>
<summary op50 select-none>Input Image</summary>
<p>
<img src="/images/ai-qrcode-101-text-input2.png" rounded shadow important-mt0 />
</p>
</details>


## Contributing

This guide is aimed to be a one-stop documentations and references for the community to learn about the QR Code models and how to use them.

If you are interested in contributing to this post, fixing typos, or adding new ideas, you can [edit this page on GitHub](https://github.com/antfu/antfu.me/edit/main/pages/posts/ai-qrcode-101.md). Or if you are not familiar with Git, you can also go to [Anthony's Discord server](https://chat.antfu.me) and discuss with us.
