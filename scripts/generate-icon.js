import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join } from 'path'

const svgBuffer = readFileSync(join(process.cwd(), 'public', 'icon.svg'))
sharp(svgBuffer)
  .png()
  .resize(512, 512)
  .toFile(join(process.cwd(), 'public', 'icon-512.png'))
  .then(() => console.log('Icon generated successfully'))
  .catch(console.error) 