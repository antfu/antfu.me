import { basename } from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'

async function run() {
  const files = await fg('temp/*.svg')

  for (const file of files)
    await fs.copyFile(file, `public/${basename(file)}`)
}

run()
