import type { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { contentConfigs, type ContentType, generateFilename, generateMarkdown } from '@/lib/config'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, fields, content } = await request.json() as {
      type: ContentType
      fields: Record<string, string | string[]>
      content: string
    }

    if (!contentConfigs[type]) {
      return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 })
    }

    // For non-travel-album types, set default date if not provided
    if (type !== 'travel-album' && !fields.date) {
      fields.date = new Date().toISOString().split('T')[0]
    }

    const config = contentConfigs[type]
    const filename = generateFilename(type, fields as Record<string, string>)
    const baseName = filename.replace(/\.md$/, '')
    // Root is parent directory of content-creator
    const rootDir = path.join(process.cwd(), '..')
    const contentDir = path.join(rootDir, config.directory)

    let coverImagePath: string | undefined

    // Process single cover image
    const imageField = config.fields.find(f => f.type === 'image')
    if (imageField && fields.image && typeof fields.image === 'string' && fields.image.startsWith('data:image/')) {
      const match = fields.image.match(/^data:image\/(\w+);base64,(.+)$/)
      if (match) {
        const ext = match[1]
        const base64Data = match[2]
        const imageFilename = `${baseName}.${ext}`
        const imagePath = path.join(contentDir, imageFilename)

        await fs.mkdir(contentDir, { recursive: true })
        const imageBuffer = Buffer.from(base64Data, 'base64')
        await fs.writeFile(imagePath, imageBuffer)

        coverImagePath = `/${imagePath}`
      }
    }

    // Process multiple images
    const imagesField = config.fields.find(f => f.type === 'images')
    if (imagesField && fields.images) {
      const images = Array.isArray(fields.images) ? fields.images : [fields.images]
      await fs.mkdir(contentDir, { recursive: true })

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          const match = img.match(/^data:image\/(\w+);base64,(.+)$/)
          if (match) {
            const ext = match[1]
            const base64Data = match[2]

            // For travel-album, use city-spot-date-hash format for filename
            let imageFilename: string
            if (type === 'travel-album') {
              const city = fields.city || ''
              const spot = fields.spot || ''
              const date = fields.date ? String(fields.date).replace(/-/g, '') : ''
              // Generate short hash from image data
              const hash = crypto.createHash('md5').update(base64Data).digest('hex').slice(0, 6)
              // Format: 城市-景点-日期-hash (hash at the end for proper parsing)
              imageFilename = spot ? `${city}-${spot}-${date}-${hash}.${ext}` : `${city}-${date}-${hash}.${ext}`
            }
            else {
              imageFilename = `${baseName}-${i + 1}.${ext}`
            }

            const imagePath = path.join(contentDir, imageFilename)
            const imageBuffer = Buffer.from(base64Data, 'base64')
            await fs.writeFile(imagePath, imageBuffer)
          }
        }
      }
    }

    // Skip markdown file generation for travel-album
    if (type === 'travel-album') {
      return NextResponse.json({ success: true, message: 'Photos uploaded successfully' })
    }

    // Ensure content directory exists
    await fs.mkdir(contentDir, { recursive: true })

    // Generate markdown with cover image
    const markdown = generateMarkdown(type, fields as Record<string, string>, content, coverImagePath)
    const filepath = path.join(contentDir, filename)

    // Write file
    await fs.writeFile(filepath, markdown, 'utf-8')

    return NextResponse.json({ success: true, path: filepath, filename })
  }
  catch (error) {
    console.error('Save failed:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
