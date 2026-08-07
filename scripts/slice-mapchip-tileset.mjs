import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sheetPath = join(root, 'public/images/godot-mapchips/tileset-sheet.png')
const tileSize = 128
const cols = 8
const rows = 8

const houseNames = [
  'house-red-roof',
  'house-blue-roof',
  'house-thatch-roof',
  'house-green-roof',
  'house-grey-roof',
  'house-two-story-flag-red',
  'house-two-story-flag-blue',
  'house-church-steeple',
  'house-blue-chimney',
  'house-wood-shed',
  'house-side-stairs',
  'house-flowers-red-roof',
  'house-flowers-blue-roof',
  'house-coffee-shop',
  'house-flowers-green-roof',
  'house-robot-plaque',
]

const fieldNames = [
  'field-plowed',
  'field-sprouts',
  'field-cabbage',
  'field-wheat',
  'field-tomato',
  'field-eggplant',
  'field-pumpkin',
  'field-sunflower',
  'field-fenced-plowed',
  'field-fenced-sprouts',
  'field-fenced-cabbage',
  'field-fenced-wheat',
  'field-fenced-tomato',
  'field-fenced-eggplant',
  'field-fenced-pumpkin',
  'field-fenced-sunflower',
]

const terrainNames = [
  'terrain-grass',
  'terrain-dirt-path',
  'terrain-cobblestone',
  'terrain-water',
]

const allNames = [...houseNames, ...fieldNames, ...terrainNames]

for (const dir of ['tiles-128', 'tiles-32']) {
  await mkdir(join(root, 'public/images/godot-mapchips', dir), { recursive: true })
}

let index = 0
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    if (index >= allNames.length) break

    const name = allNames[index]
    const left = col * tileSize
    const top = row * tileSize

    const tile128 = join(root, 'public/images/godot-mapchips/tiles-128', `${name}.png`)
    const tile32 = join(root, 'public/images/godot-mapchips/tiles-32', `${name}.png`)

    await sharp(sheetPath)
      .extract({ left, top, width: tileSize, height: tileSize })
      .png({ compressionLevel: 9 })
      .toFile(tile128)

    await sharp(tile128).resize(32, 32).png({ compressionLevel: 9 }).toFile(tile32)

    index++
  }
}

console.log(`Sliced ${index} tiles (128px + 32px)`)
