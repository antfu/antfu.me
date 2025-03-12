import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import ExifReader from 'exifreader'
import fg from 'fast-glob'
import { basename, join, parse } from 'pathe'
import sharp from 'sharp'
import { compressSharp } from './img-compress'

const folder = fileURLToPath(new URL('../photos', import.meta.url))

const files = (await fg('**/*.{jpg,png,jpeg}', {
  caseSensitiveMatch: false,
  absolute: true,
  cwd: fileURLToPath(new URL('../photos', import.meta.url)),
}))
  .sort((a, b) => a.localeCompare(b))

for (const filepath of files) {
  if (basename(filepath).startsWith('p-')) {
    continue
  }
  let writepath = filepath
  let { ext } = parse(filepath.toLowerCase())
  if (ext === '.jpeg')
    ext = '.jpg'
  const buffer = await fs.readFile(filepath)
  const img = await sharp(buffer)
  const exif = await ExifReader.load(buffer)

  let title: string | undefined

  let dateRaw = exif.DateTimeOriginal?.value || exif.DateTime?.value || exif.DateCreated?.value
  dateRaw ||= new Date(await fs.stat(filepath).then(stat => stat.birthtime || stat.mtime)).toISOString()
  if (Array.isArray(dateRaw))
    dateRaw = dateRaw[0] as string
  dateRaw = String(dateRaw)

  // convert 2025:02:02 10:07:10 to date object
  const date = new Date(dateRaw.replace(/:/g, (x, idx) => {
    if (idx < 10)
      return '-'
    return x
  }))

  const timeDiff = Date.now() - +date
  // 1 hour
  if (timeDiff < 1000 * 60 * 60) {
    console.warn(`Date of ${filepath} is too recent: ${dateRaw}`)
    continue
  }

  const base = `p-${date.toISOString().replace(/[:.a-z]+/gi, '-')}`
  let index = 1
  while (existsSync(join(folder, `${base}${index}${ext}`.toLowerCase())))
    index++
  writepath = join(folder, `${base}${index}${ext}`.toLowerCase())

  const { outBuffer, percent, outFile } = await compressSharp(img, buffer, filepath, writepath)
  if (outFile !== filepath || percent > -0.10)
    await fs.writeFile(outFile, outBuffer)
  if (outFile !== filepath)
    await fs.unlink(filepath)

  if (title) {
    await fs.writeFile(outFile.replace(/\.\w+$/, '.json'), JSON.stringify({ text: title }, null, 2))
  }
}
