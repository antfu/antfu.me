---
title: Photos Page
date: 2025-03-12T12:00:00Z
lang: en
duration: 3min
---

As you might have noticed, I added a [photos page](/photos) on this site recently. It's something I wanted to do for a very long time but always procrastinated on.

During certain periods of my life, photography was my greatest passion, just as much as I do today with Open Source and programming. Instagram was once a delightful, minimalist platform for photo sharing that I frequently used - until Meta's acquisition changed everything. While I could even tolerate the algorithms, ads, and short videos, the recent [change of profile photo grids' aspect ratio from square to 4:5](https://www.standard.co.uk/news/tech/instagram-update-how-adjust-profile-grid-what-changes-coming-b1205890.html) was the final straw - an arrogant decision that impacts every user's content without providing proper solutions.

I am not sure if anger or disappointment are the right words to describe my feelings. But I'm certainly lucky to be a frontend developer - so I can leverage my skills to build my own website and host my photos here.

I [requested to download all my data from Instagram](https://accountscenter.instagram.com/info_and_permissions/dyi/) (it took roughly a day to process in my case), and imported them to the website. Thankfully, the downloaded data was relatively easy to process, with photos dating back to 2015. I use [`sharp`](https://github.com/lovell/sharp) to process the images and compress them with [this script](https://github.com/antfu/antfu.me/blob/main/scripts/photos-manage.ts). This automation helps me manage the photos without worrying about image sizes for hosting.

Looking through these old photos brings back so many memories. While some may not meet my current standards - and I admittedly feel a bit embarrassed sharing them - they hold too many precious memories to leave behind. So I decided to keep most of them - hope you won't look too closely at them :P

Here are some of [my recent photos](/photos):

<div mb-8>
  <PhotoGrid :limit="12" class="gap-1!" />
</div>

It's a shame that the image quality from Instagram isn't great, since they compress photos heavily upon posting. I might replace some of them with higher quality originals in the future, but for now, I think it's a good start.

That said, I hope to get back into regularly sharing photos (as I keep saying 😅), especially now that I have my own platform for it.

Thanks for reading! And I hope you find [my photos](/photos) interesting. Cheese 🧀!
