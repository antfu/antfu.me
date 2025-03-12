---
title: Photos Page
date: 2025-03-12T12:00:00Z
lang: en
duration: 3min
---

As you might have noticed, I added a [photos page](/photos) on this site. Something I wanted to do for a very long time but always procrastinated on.

During certain periods of my life, photography was my greatest passion, just as much as I do today with Open Source and programming. Instagram was once a delightful, minimalist platform for photo sharing that I frequently used - until Meta's acquisition changed everything. While I could even tolerate the algorithms, ads, and short videos, the recent [change of profile photo grids' aspect ratio from square to 4:5](https://www.standard.co.uk/news/tech/instagram-update-how-adjust-profile-grid-what-changes-coming-b1205890.html) was the final straw - an arrogant decision that impacts every user's content without proper solutions provided.

I am not sure if anger or disappointment are the right words to describe my feelings. But I'm certainly lucky to be a frontend developer - so I can leverage my skills to build my own website and host my photos here.

So I [requested to download all my data from Instagram](https://accountscenter.instagram.com/info_and_permissions/dyi/) (it took roughly a day to process in my case), and imported them to the website. I use [`sharp`](https://github.com/lovell/sharp) to process the images and compress them with [this script](https://github.com/antfu/antfu.me/blob/main/scripts/photos-manage.ts). It helps me manage the photos automatically without worrying about image sizes for hosting.

Gratefully, the downloaded data is rather easy to process, and the photos track back to 2015. It's an interesting feeling to go through all those photos again. Technically speaking, my old photos are not honestly reaching my standards today. But they hold a ton of memories for me, so I kept most of them, hope you don't mind :P

Here are some of [my recent photos](/photos):

<div mb-8>
  <PhotoGrid :limit="12" class="gap-1!" />
</div>

It's a shame that the image quality from Instagram isn't great, since they compress photos heavily upon posting. I might replace some of them with higher quality originals in the future, but for now, I think it's a good start.

That said, I wish I could get back into the routine of posting my photos often (as I am always saying 😅), especially now that I have my own platform for that.

Thanks for reading! And I hope you find some of [my photos](/photos) interesting. Cheese 🧀!
