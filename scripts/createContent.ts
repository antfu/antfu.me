import path from 'node:path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import prompts from 'prompts'

type ContentType = 'post' | 'daily' | 'product' | 'interest'

interface ContentConfig {
  type: ContentType
  label: string
  directory: string
  extension: string
  fields: Array<{
    key: string
    label: string
    type: 'text' | 'date' | 'textarea' | 'select'
    required: boolean
    options?: string[]
    default?: string
  }>
}

const contentConfigs: Record<ContentType, ContentConfig> = {
  post: {
    type: 'post',
    label: '博客文章',
    directory: 'pages/posts',
    extension: '.md',
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'date', label: '日期', type: 'date', required: true },
      { key: 'lang', label: '语言 (zh/en)', type: 'select', required: false, options: ['zh', 'en'], default: 'zh' },
      { key: 'duration', label: '阅读时长 (如: 10min)', type: 'text', required: false },
      { key: 'description', label: '描述', type: 'textarea', required: false },
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
      { key: 'github', label: 'GitHub 链接', type: 'text', required: false },
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .trim()
}

async function main() {
  console.log('\n📝 内容创建工具\n')

  // 选择内容类型
  const typeResponse = await prompts({
    type: 'select',
    name: 'type',
    message: '选择要创建的内容类型：',
    choices: Object.values(contentConfigs).map(config => ({
      title: config.label,
      value: config.type,
    })),
  })

  const config = contentConfigs[typeResponse.type as ContentType]

  // 收集字段
  const data: Record<string, string> = {}
  const frontmatter: Record<string, any> = {}

  for (const field of config.fields) {
    const value = await prompts({
      type: field.type === 'select' ? 'select' : field.type === 'textarea' ? 'multiline' : 'text',
      name: field.key,
      message: `${field.label}${field.required ? ' (必填)' : ''}：`,
      choices: field.options?.map(opt => ({ title: opt, value: opt })),
      initial: field.default,
    })

    data[field.key] = value[field.key]

    if (field.key === 'draft') {
      frontmatter[field.key] = value[field.key] === 'true'
    }
    else if (value[field.key]) {
      frontmatter[field.key] = value[field.key]
    }
  }

  // 收集正文内容
  const contentResponse = await prompts({
    type: 'multiline',
    name: 'content',
    message: '正文内容 (Markdown 格式)：\n',
  })

  const content = contentResponse.content || ''

  // 生成文件名
  let filename: string
  if (typeResponse.type === 'daily') {
    filename = `${data.date || new Date().toISOString().split('T')[0]}.md`
  }
  else {
    filename = `${slugify(data.title || 'untitled')}.md`
  }

  // 生成 frontmatter
  const fileContent = matter.stringify(content, frontmatter)

  // 保存文件
  const filepath = path.join(process.cwd(), config.directory, filename)

  try {
    await fs.ensureDir(path.dirname(filepath))
    await fs.writeFile(filepath, fileContent, 'utf-8')
    console.log(`\n✅ 文件已创建：${filepath}\n`)
  }
  catch (error) {
    console.error('\n❌ 创建失败：', error)
  }
}

main()
