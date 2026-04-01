import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import path from 'path'

const md = new MarkdownIt()

interface InterestImage {
  filename: string
  url: string
  city: string
  spot: string
  date: string
}

interface InterestData {
  title: string
  cover: string
  intro: string
  content: string
  images: InterestImage[]
}

function parseFilename(filename: string): { city: string; spot: string; date: string } {
  const nameWithoutExt = path.basename(filename, path.extname(filename))
  const parts = nameWithoutExt.split('-')

  let date = '2024-01-01'

  if (parts.length >= 2) {
    const last = parts[parts.length - 1]
    const secondLast = parts[parts.length - 2]

    if (/^\d{8}$/.test(last)) {
      date = `${last.slice(0, 4)}-${last.slice(4, 6)}-${last.slice(6, 8)}`
      parts.pop()
    }
    else if (/^\d{4}$/.test(secondLast) && /^\d{2}$/.test(last)) {
      date = `${secondLast}-${last}-01`
      parts.pop()
      parts.pop()
    }
    else {
      parts.pop()
    }
  }

  const city = parts[0] || ''
  const spot = parts.slice(1).join('-') || city

  return { city, spot, date }
}

async function getImagesFromDir(slug: string): Promise<InterestImage[]> {
  const imageDir = path.resolve(`./public/images/interests/${slug}`)

  const exist = await fs.pathExists(imageDir)
  if (!exist)
    return []

  let files = await fg('*.jpg', { cwd: imageDir, absolute: false, caseSensitiveMatch: false })
  if (files.length === 0)
    files = await fg('*.jpeg', { cwd: imageDir, absolute: false, caseSensitiveMatch: false })
  if (files.length === 0)
    files = await fg('*.png', { cwd: imageDir, absolute: false, caseSensitiveMatch: false })
  if (files.length === 0)
    files = await fg('*.webp', { cwd: imageDir, absolute: false, caseSensitiveMatch: false })

  if (files.length === 0)
    return []

  const images: InterestImage[] = files.map((file) => {
    const { city, spot, date } = parseFilename(file)
    return {
      filename: file,
      url: `/images/interests/${slug}/${file}`,
      city,
      spot,
      date,
    }
  }).sort((a, b) => b.date.localeCompare(a.date))

  return images
}

export async function generateInterestsData() {
  const interestDir = path.resolve('./pages/content/interest')
  const outputFile = path.resolve('./src/data/interestsAuto.ts')

  const files = await fg('*.md', { cwd: interestDir, absolute: false })

  const interestsData: Record<string, InterestData> = {}

  for (const file of files) {
    const filePath = path.join(interestDir, file)
    const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'))

    if (!data.slug)
      continue

    const images = await getImagesFromDir(data.slug)

    interestsData[data.slug] = {
      title: data.title || '',
      cover: data.cover || (images[0]?.url || ''),
      intro: data.intro || '',
      content: content.trim() ? md.render(content.trim()) : '',
      images,
    }
  }

  const output = `// Auto-generated file - DO NOT EDIT
export interface InterestImage {
  filename: string
  url: string
  city: string
  spot: string
  date: string
}

export interface InterestData {
  title: string
  cover: string
  intro: string
  content: string
  images: InterestImage[]
}

export const interestsData: Record<string, InterestData> = ${JSON.stringify(interestsData, null, 2)}
`

  await fs.ensureDir(path.dirname(outputFile))
  await fs.writeFile(outputFile, output, 'utf-8')
  console.log('[generateInterests] Generated interestsAuto.ts')
}

generateInterestsData().catch(console.error)
