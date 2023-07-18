import Git from 'simple-git'
import prompts from 'prompts'
import { compressImages } from './img-compress'

const git = Git()
const stagedFiles = (await git.diff(['--cached', '--name-only']))
  .split('\n')
  .map(i => i.trim())
  .filter(Boolean)

const images = stagedFiles.filter(i => i.match(/\.(png|jpe?g|webp)$/i))
if (images.length > 0) {
  console.log('Images to compress:\n', images)
  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Compress ${images.length} images?`,
  })

  compressImages(images)

  if (!confirm)
    process.exit(0)
}
else {
  console.log('No images to compress')
  process.exit(0)
}
