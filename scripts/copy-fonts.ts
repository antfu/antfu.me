import fs from 'fs-extra'

async function run() {
  await fs.copy('public/assets/fonts', 'dist/assets/fonts', { overwrite: true })
}

run()
