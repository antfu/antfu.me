import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'

interface ProductData {
  slug: string
  title: string
  tabTitle?: string
  description: string
  image: string
  date: string
  content: string
  features: string[]
  techStack: string[]
}

export async function generateProductsData() {
  const productDir = path.resolve('./pages/content/product')
  const outputFile = path.resolve('./src/data/productsAuto.ts')

  const files = await fg('*.md', { cwd: productDir, absolute: false })

  const products: Record<string, ProductData> = {}

  for (const file of files) {
    const filePath = path.join(productDir, file)
    const { data, content } = matter(fs.readFileSync(filePath, 'utf-8'))

    if (!data.slug)
      continue

    products[data.slug] = {
      slug: data.slug,
      title: data.title || '',
      tabTitle: data?.tabTitle,
      description: data.description || '',
      image: data.image || '',
      date: data.date || '',
      content: content.trim(),
      features: data.features || [],
      techStack: data.techStack || [],
    }
  }

  const output = `// Auto-generated file - DO NOT EDIT
export interface ProductData {
  slug: string
  title: string
  tabTitle?: string
  description: string
  image: string
  date: string
  content: string
  features: string[]
  techStack: string[]
}

export const productsData: Record<string, ProductData> = ${JSON.stringify(products, null, 2)}
`

  await fs.ensureDir(path.dirname(outputFile))
  await fs.writeFile(outputFile, output, 'utf-8')
  console.log('[generateProducts] Generated productsAuto.ts')
}

generateProductsData().catch(console.error)
