---
title: Talks - Michelangelo De Francesco
display: ''
plum: true
items:
  # - title: 'Text for talk'
  #   date: '2023-10-25'
  #   inperson: true
  #   path: 'https://vuefes.jp/2023/'
---

<SubNav />

<div slide-enter>
  <div i-ri:presentation-line mr-1 />
  <RouterLink to="/giving-talks" op50>Available for giving talks</RouterLink>
</div>

<ListPosts type="talk" :extra="frontmatter.items" />
