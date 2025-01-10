---
title: Collective Sponsorship
display: ''
---

<script setup>
import { useRoute } from 'vue-router'
import { computed, nextTick } from 'vue'

const route = useRoute()

const monthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const month = computed(() => monthes[+route.query.month - 1])
</script>

<h1 class="flex gap-2 items-center">
👋 Hello
<img :src="`https://github.com/${route.query.github}.png`" class="!h-12 !w-12 rounded-full !m0" />
{{route.query.name}}!
</h1>

This is {@antfu|Anthony Fu}

I'd like to represent our ecosystem to say **THANK YOU** for your open source work!

To show our appreciation,<br>**we'd like to offer you a one-time sponsorship of <span>${{route.query.amount}} USD</span> from our [Open Collective](https://opencollective.com/antfu)**.

You can learn more about the context in this post: [Initiative on Sponsorship Forwarding](/posts/sponsorship-forwarding).

---

As our funds are in Open Collective, it would require a bit manual work on your side to claim the sponsorship (sorry for the inconvenience, we are consistently evaluating the approaches and trying find a better way).

There are two ways you can do that:

## A. Sumbit expense on Open Collective

Create an expense on our Open Collective, it usually take a few seconds to fill the form. You will receive the payment directly to your bank account or PayPal within a few days after approval.

1. Got to https://opencollective.com/antfu/expenses/new, select "Invoice"
2. Fill in your payment information
3. For expense title, put <TextCopy inline font-bold :slice="[1, -1]">"One-time Sponsorship, {{month}} {{route.query.year}}"</TextCopy>
4. For the description field, put <TextCopy inline font-bold :slice="[1, -1]">"One-time sponsorship"</TextCopy> with **a link to your recent work** in the description, and fill in the amount **${{route.query.amount}} USD**.
5. Click "Next" and then "Submit Expense"

That's it! Feel free to reach out to me if you have any questions.

## B. Create your own Collective

An alternate solution is to create your own Collective on Open Collective so we could directly sponsor you to your collective without the need of submitting an expense on your side. This way you also can manage your own funds and expenses as wish.

You fiscal host has to be in [Open Source Collective](https://opencollective.com/opensource) for us to forward the sponsorship.

Also note that if you are trying to apply for one, it usually requires to link to an open source projects that are under an GitHub organization but not the personal namespace. Send me your open collective link once you have it and we will do the sponsorship.

---

We will do this sponsorship on a monthly basis, with a post each month to announce the sponsorships and introducing the contributors and their work. For example, like [this one we had for April 2024](https://opencollective.com/antfu/updates/anthony-collective-redistribution-april-2024). If you have anything you'd like us to mention in the post, feel free to let us know!

Thank you again for your amazing work and contributions to open source! 🙏 💖
