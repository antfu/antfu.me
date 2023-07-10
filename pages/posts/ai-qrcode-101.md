---
title: Stable Diffusion QR Code 101
date: 2023-07-08T05:00:00.000+00:00
lang: en
duration: 15min
draft: true
tocAlwaysOn: true
---

[[toc]]

<p>
<span i-carbon-events mr1 /> Co-authored by <a href="https://antfu.me" target="_blank">Anthony Fu</a>, <a href="https://space.bilibili.com/339984/" target="_blank">赛博迪克朗</a> and <a href="https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f" target="_blank">代々木</a>
</p>

> Work in progress. This is a live document, will be updated as we learn more.
>
> If you are interested in contributing, [edit this page on GitHub](https://github.com/antfu/antfu.me/edit/main/pages/posts/ai-qrcode-101.md).

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

As of July 8th, 2023, [QRBTF](https://qrbtf.com/) haven't released their model or service yet, you can join their [Discord server](https://discord.gg/V9CNuqYfte) to get the latest news. The methods mentioned here are based on community research and experiments.

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
    :xScale="[0.7, 1.6, 0.1]"
    :xValue="3"
    yTitle="Start"
    :yScale="[0.1, 0.5, 0.1]"
    :aspectRatio="0.75"
    :fixedRowsAfter="[['End', '1.0']]"
    :fixedRowsBefore="[['Model', 'QR Pattern']]"
  />
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-pattern-end.webp"
    xTitle="Weight"
    :xScale="[0.7, 1.6, 0.1]"
    :xValue="3"
    yTitle="End"
    :yScale="[0.4, 1.0, 0.1]"
    :aspectRatio="0.75"
    :fixedRowsBetween="[['Start', '0']]"
    :fixedRowsBefore="[['Model', 'QR Pattern']]"
  />
</div>

#### [QR Code Monster Model](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster)

<div grid="~ cols-1 md:cols-2 gap-2">
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-monster-start.webp"
    xTitle="Weight"
    :xScale="[0.7, 1.6, 0.1]"
    :xValue="3"
    yTitle="Start"
    :yScale="[0.1, 0.5, 0.1]"
    :aspectRatio="0.75"
    :fixedRowsAfter="[['End', '1.0']]"
    :fixedRowsBefore="[['Model', 'QR Code Monster']]"
  />
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-monster-end.webp"
    xTitle="Weight"
    :xScale="[0.7, 1.6, 0.1]"
    :xValue="3"
    yTitle="End"
    :yScale="[0.4, 1.0, 0.1]"
    :aspectRatio="0.75"
    :fixedRowsBetween="[['Start', '0']]"
    :fixedRowsBefore="[['Model', 'QR Code Monster']]"
  />
</div>

#### [IoC Lab Brightness Model](https://huggingface.co/ioclab/ioc-controlnet/tree/main/models)

<div grid="~ cols-1 md:cols-2 gap-2">
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-brightness-start.webp"
    xTitle="Weight"
    :xScale="[0.1, 0.9, 0.1]"
    :xValue="1"
    yTitle="Start"
    :yScale="[0, 0.5, 0.1]"
    :aspectRatio="0.75"
    :fixedRowsAfter="[['End', '0']]"
    :fixedRowsBefore="[['Model', 'IoC Lab Brightness']]"
  />
  <QRCodeMatrix
    src="/images/ai-qrcode-101-matrix-brightness-end.webp"
    xTitle="Weight"
    :xScale="[0.1, 0.9, 0.1]"
    :xValue="2"
    yTitle="End"
    :yScale="[0.5, 1.0, 0.1]"
    :aspectRatio="0.75"
    :fixedRowsBetween="[['Start', '0']]"
    :fixedRowsBefore="[['Model', 'IoC Lab Brightness']]"
  />
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
<QRCodeCompare scale-85 md:scale-100 input="/images/ai-qrcode-101-input-edit1-i.png" output="/images/ai-qrcode-101-input-edit1-o.jpg" />
<div><div i-ri-arrow-down-line/> Adding some noise to the margin</div>
<QRCodeCompare scale-85 md:scale-100 input="/images/ai-qrcode-101-input-edit2-i.png" output="/images/ai-qrcode-101-input-edit2-o.jpg" />
<div><div i-ri-arrow-down-line/> Manually connect some points in margin</div>
<QRCodeCompare scale-85 md:scale-100 input="/images/ai-qrcode-101-input-edit6-i.png" output="/images/ai-qrcode-101-input-edit6-o.jpg" />
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
      <img src="/images/ai-qrcode-101-prompt-bird.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>bird</b>
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
      <img src="/images/ai-qrcode-101-prompt-leaf.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>leaf</b>
        <div text-xs mt1>by <a href="https://v.douyin.com/iDLHquJ/" target="_blank">五倍速企鹅</a></div>
      </figcaption>
    </figure>
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-buildings.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>buildings</b>
        <div text-xs mt1>by <a href="https://space.bilibili.com/251938958" target="_blank">阿帝</a></div>
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

## Contributing

If you are interested in contributing to this post, fixing typos, or adding new ideas, you can [edit this page on GitHub](https://github.com/antfu/antfu.me/edit/main/pages/posts/ai-qrcode-101.md). Or if you are not familiar with Git, you can also go to [Anthony's Discord server](https://chat.antfu.me) and discuss with us.
