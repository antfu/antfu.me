import process from 'node:process'
import { compressImages } from './img-compress'

const files = process.argv.slice(2)

compressImages(files)
