export interface PhotoMate {
  text?: string
}

export interface Photo extends PhotoMate {
  name: string
  url: string
}

const metaInfo = Object.entries(
  import.meta.glob<PhotoMate>('./**/*.json', {
    eager: true,
    import: 'default',
  }),
).map(([name, data]) => {
  return {
    name: name.replace(/\.\w+$/, ''),
    data,
  }
})

const photos = Object.entries(
  import.meta.glob<string>('./**/*.{jpg,png,JPG,PNG}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .map(([name, url]): Photo => {
    return {
      ...metaInfo.find(info => info.name === name)?.data,
      name: name.replace(/\.\w+$/, ''),
      url,
    }
  })
  .sort((a, b) => b.name.localeCompare(a.name))

export default photos
