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
> If you are interested in contributing, [edit this page on GitHub](https://github.com/antfu/antfu.me/edit/main/pages/posts/ai-qrcode-101.md).

A summary of discussions made in [QRBTF's Discord server](https://discord.gg/V9CNuqYfte) and [Anthony's Discord server](https://chat.antfu.me). Thanks to everyone who participated in those servers.

## What's a Stable Diffusion QR Code?

Images that are generated with [Stable Diffusion](https://stability.ai/blog/stable-diffusion-public-release) with QR Codes as [ControlNet](https://github.com/lllyasviel/ControlNet)'s input, making the QR Code data points blend into the artwork while still being scannable by QR Code readers.

<figure>
  <div grid="~ cols-1 md:cols-3 gap-1" lg:scale-120 md:scale-110>
    <img src="/images/ai-qrcode-101-example2.jpg" rounded shadow important-m0 />
    <img src="/images/ai-qrcode-101-example1.jpg" rounded shadow important-m0 />
    <img src="/images/ai-qrcode-101-example3.jpg" rounded shadow important-m0 />
  </div>
  <figcaption important-mt8 text-center>Examples from <a href="https://qrbtf.com/">QRBTF.com</a></figcaption>
</figure>

The original idea was created by the people behind [QRBTF](https://qrbtf.com/)](https://qrbtf.com/), and was first revealed on [this reddit](https://www.reddit.com/r/StableDiffusion/comments/141hg9x/controlnet_for_qr_code/) by [nhciao](https://www.reddit.com/user/nhciao/).

As of July 8th, 2023, [QRBTF](https://qrbtf.com/) haven't released their model or service yet, you can join their [Discord server](https://discord.gg/V9CNuqYfte) to get the latest news. The methods mentioned here are based on community research and experiments.

## How to Generate?

There are a few online services you can try, but this guide will focus on doing it locally on our own. You will need the basic knowledge of Stable Diffusion and ControlNet, a computer with a GPU (or a cloud GPU instance) to start.

There are two approaches to generating a stylized QR Code:

- **Text to Image with ControlNet** - Generate an image with prompts, and use ControlNet with a QR Code input to intervention the generation process.
  - [Stylistic QR Code with Stable Diffusion](/posts/ai-qrcode) - by Anthony Fu
  - [Refining AI Generated QR Code](/posts/ai-qrcode-refine) - by Anthony Fu
  - [[Video] 二维码融合技术2.0](https://www.bilibili.com/video/BV1zF411R7xg/) - by 赛博迪克朗
- **Image to Image** - Use a QR Code image as input, and let Stable Diffusion redraw each part of the QR Code. Doesn't require ControlNet.
  - [How to make a QR code with Stable Diffusion](https://stable-diffusion-art.com/qr-code/) - by Andrew

We found that the **Text to Image approach produces much better results**, and it's easier to control the output. We will focus on that approach in this guide.

## ControlNet Models

Here are a few ControlNet models we found useful:

- [QR Pattern](https://civitai.com/models/90940/controlnet-qr-pattern-qr-codes)
- [QR Code Monster](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster)
- [IoC Lab Control Net](https://huggingface.co/ioclab/ioc-controlnet/tree/main/models)

// TODO: add a compare table, and a bit of explanation for each model

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

### Parameters

The parameters of the ControlNet affect when and how the control is applied to the generation process.

- **Control weight** - The weight of the ControlNet. The higher the weight, the more the output will be affected by the ControlNet.
- **Start control step** - The percentage of the generation process when the ControlNet starts to take effect.
- **End control step** - The percentage of the generation process when the ControlNet stops taking effect.

<div relative flex="~ col items-center" py3>
  <div absolute top-0 left="1/12" translate-x="-1/2">prompts</div>
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

### Compare with the Original QR Code

// TODO: 

<hr>

## Improving the QR Code

Say that you already generated a bunch of QR Codes and find some of them you like. You want to improve them to make them more scannable, or more blended-in, or more artistic. Here are some tips we found useful.

### Tweak the Input QR Code

The **input QR Code is one of the most important parts** of the whole process to generate well-blended code.

You can refer to [this post](/posts/ai-qrcode-refine#generating-the-base-qr-code) to see a comparison of how different QR Code input affects the output.

We recommend using [Anthony's](https://qrcode.antfu.me/) QR Toolkit](https://qrcode.antfu.me/) to generate the QR Code. It allows you to customize the QR Code and distort it as needed.

Meanwhile, note that the margin of the QR Code also affects the output, for example:

<div flex="~ col items-center gap-4" py4>
<QRCodeCompare scale-85 md:scale-100 input="/images/ai-qrcode-101-input-edit1-i.png" output="/images/ai-qrcode-101-input-edit1-o.jpg" />
<div><div i-ri-arrow-down-line/> Adding some noise to the margin</div>
<QRCodeCompare scale-85 md:scale-100 input="/images/ai-qrcode-101-input-edit2-i.png" output="/images/ai-qrcode-101-input-edit2-o.jpg" />
<div><div i-ri-arrow-down-line/> Manually connect some points in margin</div>
<QRCodeCompare scale-85 md:scale-100 input="/images/ai-qrcode-101-input-edit6-i.png" output="/images/ai-qrcode-101-input-edit6-o.jpg" />
</div>

<hr>

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
    <!-- <figure important-my-0>
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
      <img src="/og-icon.png" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>leaves</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">-</a></div>
      </figcaption>
    </figure> -->
    <figure important-my-0>
      <img src="/images/ai-qrcode-101-prompt-snow.jpg" rounded-md shadow />
      <figcaption text-center>
        <b text-lg>snow</b>
        <div text-xs mt1>by <a href="https://antfu.me" target="_blank">Anthony Fu</a></div>
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

Ribbon

```ruby
(1 girl:1.6), full body, from side, ultra wide shot, (azure blue dress:1.3), (grey long hair:1.3), (white ribbon:1.6), (white lace:1.6), BREAK, (dark background:1.3)
```

Feather

```ruby
(1 girl:1.3), upper body, (grey long hair:1.3), (blue dress:1.3), zigzag patterns, graphic impact, (white feathers:1.6), BREAK, (dark background:1.3)
```

Bird

```ruby
(1 girl:1.3), upper body, rosemaling patterns, Norwegian folk art, decorative designs, vibrant colors, (white birds:1.6), BREAK, (dark background:1.3)
```

</p>

> Credits to [@代々木](https://www.xiaohongshu.com/user/profile/5be8fb806b58b745447aab0f)

<hr>

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

> Idea credits to [@whmc76](https://space.bilibili.com/339984/)

<hr>

### Multiple ControlNet

// TODO: anyone can help to explain this?

<hr>

### Image to Image Enhancement

When you find a generated image is hard to scan, you can try to send the image to `img2img`, enable ControlNet with your original QR Code input and:

- Decrease the **Denoising strength** to retain more of the original image.
- Increase the **Control weight** for better readability.
- A typical workflow for "saving" a code would be: Max out the guidance scale and minimize the denoising strength, then bump the strength until the code scans.

This tells the model to re-enhance the image by making dark areas darker and light areas lighter under the guidance of ControlNet.

> Credits to [QR Code Monster's Tips](https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster#tips)

<hr>

### Manually Editing and Inpainting

The ultimate solution is indeed to manually edit the output image. You can use editing tools like Photoshop combined with inpainting to fine-tune every part of the imaged image. It might require a lot of effort, we'd generally recommend focusing on tweaking the generation first before going to this step. More details can be found in [this post](/posts/ai-qrcode-refine).
