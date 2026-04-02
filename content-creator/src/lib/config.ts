export type ContentType = 'post' | 'daily' | 'product-daily' | 'product-new' | 'interest'

export interface Field {
  key: string
  label: string
  type: 'text' | 'date' | 'textarea' | 'select' | 'image' | 'images'
  required: boolean
  options?: string[]
  default?: string
}

export interface ContentConfig {
  type: ContentType
  label: string
  directory: string
  extension: string
  fields: Field[]
}

export const contentConfigs: Record<ContentType, ContentConfig> = {
  'post': {
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
      { key: 'image', label: '头图', type: 'image', required: false },
      { key: 'images', label: '配图', type: 'images', required: false },
    ],
  },
  'daily': {
    type: 'daily',
    label: '碎记',
    directory: 'pages/content/daily',
    extension: '.md',
    fields: [
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'image', label: '头图', type: 'image', required: false },
      { key: 'images', label: '配图', type: 'images', required: false },
    ],
  },
  'product-daily': {
    type: 'product-daily',
    label: '产品碎记',
    directory: 'pages/product',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'duration', label: '阅读时长', type: 'text', required: false },
      { key: 'image', label: '头图', type: 'image', required: false },
      { key: 'images', label: '配图', type: 'images', required: false },
    ],
  },
  'product-new': {
    type: 'product-new',
    label: '新增产品',
    directory: 'pages/content/product',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'slug', label: '唯一标识', type: 'text', required: true },
      { key: 'image', label: '头图', type: 'image', required: false },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'techStack', label: '技术栈', type: 'textarea', required: false },
      { key: 'features', label: '核心功能', type: 'textarea', required: false },
      { key: 'github', label: 'GitHub 链接', type: 'text', required: false },
      { key: 'product_link', label: '项目链接', type: 'text', required: false },
      { key: 'images', label: '配图', type: 'images', required: false },
    ],
  },
  'interest': {
    type: 'interest',
    label: '兴趣',
    directory: 'pages/content/interest',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: false },
      { key: 'description', label: '描述', type: 'textarea', required: false },
      { key: 'category', label: '分类', type: 'text', required: false },
      { key: 'image', label: '头图', type: 'image', required: false },
    ],
  },
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格转横线
    .replace(/-+/g, '-') // 多条横线合并
    .trim()
}

export function generateFilename(type: ContentType, data: Record<string, string | string[]>): string {
  if (type === 'daily') {
    const date = Array.isArray(data.date) ? data.date[0] : data.date
    return `${date || new Date().toISOString().split('T')[0]}.md`
  }
  const title = Array.isArray(data.title) ? data.title[0] : data.title
  return `${slugify(title || 'untitled')}.md`
}

export function generateMarkdown(type: ContentType, fields: Record<string, string | string[]>, content: string, coverImage?: string): string {
  const config = contentConfigs[type]
  const frontmatter: Record<string, any> = {}

  // Parse list-like content from textarea fields
  function parseListContent(text: string): string[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    return lines.map(line => line.replace(/^-\s*/, ''))
  }

  config.fields.forEach((field) => {
    // Skip images field (multiple images handled separately by API)
    if (field.type === 'images')
      return
    // Handle single image - show placeholder path instead of base64
    if (field.type === 'image') {
      return // Don't include in preview, will be added from coverImage
    }
    if (field.key === 'draft') {
      frontmatter[field.key] = fields[field.key] === 'true'
    }
    else if (fields[field.key]) {
      const value = fields[field.key]
      // For textarea fields like features, techStack - parse list content
      if (field.type === 'textarea' && typeof value === 'string' && value.includes('\n')) {
        const listItems = parseListContent(value)
        if (listItems.length > 0) {
          frontmatter[field.key] = listItems
          return
        }
      }
      frontmatter[field.key] = value
    }
  })

  // Add cover image to frontmatter if present (from API response path)
  if (coverImage) {
    frontmatter.image = coverImage
  }

  let md = '---\n'
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      md += `${key}:\n`
      value.forEach((item) => {
        md += `  - ${item}\n`
      })
    }
    else {
      md += `${key}: ${value}\n`
    }
  })
  md += '---\n\n'
  md += content

  return md
}
