import path from 'node:path'
import fs from 'fs-extra'
import matter from 'gray-matter'

export type ContentType = 'post' | 'daily' | 'product' | 'interest'

export interface ContentField {
  key: string
  label: string
  type: 'text' | 'date' | 'textarea' | 'select'
  required: boolean
  options?: string[]
  default?: string
}

export interface ContentConfig {
  type: ContentType
  label: string
  directory: string
  extension: string
  fields: ContentField[]
}

export const contentConfigs: Record<ContentType, ContentConfig> = {
  post: {
    type: 'post',
    label: '博客文章',
    directory: 'pages/posts',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'lang', label: '语言', type: 'select', required: false, options: ['zh', 'en'], default: 'zh' },
      { key: 'duration', label: '阅读时长', type: 'text', required: false },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'draft', label: '草稿', type: 'select', required: false, options: ['true', 'false'], default: 'false' },
    ],
  },
  daily: {
    type: 'daily',
    label: '碎记',
    directory: 'pages/content/daily',
    extension: '.md',
    fields: [
      { key: 'date', label: '日期', type: 'date', required: true },
    ],
  },
  product: {
    type: 'product',
    label: '产品',
    directory: 'pages/content/product',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'category', label: '分类', type: 'select', required: true, options: ['cli-tool', 'design-system', 'node-framework', 'vite-plugin', 'vue-components', 'other'] },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'link', label: '链接', type: 'text', required: false },
      { key: 'github', label: 'GitHub', type: 'text', required: false },
    ],
  },
  interest: {
    type: 'interest',
    label: '兴趣',
    directory: 'pages/content/interest',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'category', label: '分类', type: 'text', required: false },
    ],
  },
}

export interface ContentData {
  type: ContentType
  fields: Record<string, string>
  content: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .trim()
}

export function generateFilename(type: ContentType, data: Record<string, string>): string {
  if (type === 'daily') {
    return `${data.date || new Date().toISOString().split('T')[0]}.md`
  }

  const title = data.title || 'untitled'
  return `${slugify(title)}.md`
}

export function generateFrontmatter(type: ContentType, data: Record<string, string>): Record<string, any> {
  const config = contentConfigs[type]
  const frontmatter: Record<string, any> = {}

  for (const field of config.fields) {
    if ((field.key === 'content') || (field.key === 'title' && type !== 'post'))
      continue

    if (field.key === 'draft') {
      frontmatter[field.key] = data[field.key] === 'true'
    }
    else if (data[field.key]) {
      frontmatter[field.key] = data[field.key]
    }
  }

  return frontmatter
}

export function generateMarkdown(type: ContentType, data: Record<string, string>, content: string): string {
  const frontmatter = generateFrontmatter(type, data)

  if (type === 'daily') {
    return content
  }

  const fileContent = matter.stringify(content, frontmatter)
  return fileContent
}

export async function saveContent(data: ContentData): Promise<{ success: boolean, path?: string, error?: string }> {
  try {
    const config = contentConfigs[data.type]
    const filename = generateFilename(data.type, data.fields)
    const filepath = path.join(process.cwd(), config.directory, filename)

    await fs.ensureDir(path.dirname(filepath))

    const markdown = generateMarkdown(data.type, data.fields, data.content)
    await fs.writeFile(filepath, markdown, 'utf-8')

    return { success: true, path: filepath }
  }
  catch (error) {
    return { success: false, error: String(error) }
  }
}
