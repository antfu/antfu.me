import type { Component } from 'vue'

const video = import.meta.glob('./*.mp4', { eager: true, as: 'url' })

export const demoItems = Array.from(Object.entries(import.meta.glob('./*.md', { eager: true })))
  .map(([path, page]: any) => ({
    date: path.slice(2, -3) as string,
    comp: page.default as Component,
    video: video[`./${path.slice(2, -3)}.mp4`] as string,
  }))
  .sort((a, b) => b.date.localeCompare(a.date))
