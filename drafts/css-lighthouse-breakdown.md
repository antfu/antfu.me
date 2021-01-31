---
title: CSS Lighthouse Game Break Down
lang: en
---

<!--
  I probably won't get a chance to finish it :P
-->

One day I was randomly browsing [CodePen](https://codepen.io/) and accidentally found out this [Pure CSS Game - You Must Build a Lighthouse.](https://codepen.io/ivorjetski/pen/OJXbvdL) by [Ben Evans](https://twitter.com/ivorjetski). With a similar art style of [Townscaper](https://store.steampowered.com/app/1291340), I was immediately attracted.

The goal of this game is to make a lighthouse through a combination of house blocks. Similar to Townscaper, when you have two blocks next to each other, they will become a bigger house. Lighthouse should be able to appear with one of the patterns. The most important of this game is that it's built with PURE CSS, NO Javascript!

![Pure CSS Game - You Must Build a Lighthouse.](https://pbs.twimg.com/card_img/1319262775219281920/gMkamPlr?format=jpg&name=medium)

In this post, I will break it down into parts to explain how it works. And hope you can write yourself a CSS game after reading it. [**Play the game**]((https://codepen.io/ivorjetski/pen/OJXbvdL)) before you continue.

---

## TOC

- [Interactive](#Interactive)

## Interactive

The art of this game is awesome, but before we dig into the art part, let's see how the fundamental - interactivity work first. I am not really into the "CSS Only" world before, the ability to have interactivity and states without JavaScript is just blowing my mind. This is the initial motivation for me to break it down - I must find out how! Luckily, Ben has left some hints on this. In the game, you can see a grid of dots on the top-left corner, every time you toggle the house, some of the dots will alter between gray and blue. They look like radio inputs. Since it's a CSS game, let's remove all the CSS to see what happened.

![Lighthouse with CSS Removed](/images/lighthouse-css-removed.png)

Oh, they're indeed radios! If you play with them, clicking some radios will unselect some others - there are some secret groups for them. That's how the interactivity works without JavaScript, states and logics are handled by the native elements. With this knowledge, we should be able to re-implement it easily.

Let take a simple 2x2 as the example:

```html
<input type="radio" name="1-1"/>
<input type="radio" name="1-2"/>
<input type="radio" name="2-1"/>
<input type="radio" name="2-2"/>
```

Use the [`::after` pseudo-element](https://www.w3schools.com/cssref/sel_after.asp) to extend the clickable area and custom styling.

```css
input[type='radio']::after {
  content: "";
  width: 50px;
  height: 50px;
  border: 1px solid #eee;
  position: absolute;
  top: 100px;
  left: 100px;
}
input[type='radio']:cheked::after {
  background: #81C7D4;
}
```

To set the position of each radio, we can use the [`@for` function in SASS](https://sass-lang.com/documentation/at-rules/control/for) or set each manually in plain CSS.

```scss
// this is SASS

@for $i from 1 through 2 {
  @for $j from 1 through 2 {
    input[name="#{$i}-#{$j}"]::after {
      top: (100px + 50px * $i);
      left: (100px + 50px * $j);
    }
  }
}
```

```css
/* Equivalent to this in CSS*/

input[name="1-1"]::after { top: 150px; left: 150px; }
input[name="1-2"]::after { top: 150px; left: 200px; }
input[name="2-1"]::after { top: 200px; left: 150px; }
input[name="2-2"]::after { top: 200px; left: 200px; }
```

> I will use the [SASS preprocessor](https://sass-lang.com/) for all the CSS snippets in the rest of this post. You can always copy-paste SASS code into [this Playground](https://www.sassmeister.com/) to see the compiled CSS if you are not familiar with their syntaxes.

After that, you should be able to get a Pure CSS clickable grid similar to the game

Code can be found in these Pens

- [Checkbox version](https://codepen.io/antfu/pen/eYzvEJg)
- [Radio version](https://codepen.io/antfu/pen/wvWJgjN)

### Time Limit

### Dialog

### House Merging
