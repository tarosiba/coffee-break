import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/terrain')

const PIXEL_COLORS = {
  '.': null,
  K: '#101010',
  B: '#2858b8',
  G: '#808080',
  g: '#b0b0b0',
  D: '#585858',
  W: '#e8e8e8',
  w: '#c8c8c8',
  R: '#a06830',
  r: '#c08040',
  S: '#989898',
  s: '#c0c0c0',
}

const HEX_PATH = 'M 12 1 L 22 6.5 L 22 15.5 L 12 21 L 2 15.5 L 2 6.5 Z'

const TERRAIN_MAPS = {
  factory: [
    '........................',
    '........................',
    '....DD......gggg........',
    '....DD......gGGg........',
    '....DD......gGGg........',
    '....DD......gGGg........',
    '....DD..ggggGGGG........',
    '....DD..gGGGGGGG........',
    '....DD..gGGGGGGG........',
    '....DD..ggggGGGG........',
    '.........gGGGGg.........',
    '.........gggggg.........',
    '........................',
    '.....rrrrrrrrrrrrr......',
    '.....RRRRRRRRRRRRR......',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
  airfield: [
    '........................',
    '........................',
    '........................',
    '..........ss............',
    '.........sSSs...........',
    '........sSSSs...........',
    '.......sSSSSs...........',
    '......sSSSSSs...........',
    '.....sSSSSSSs...........',
    '....sSSSSSSSs...........',
    '...sSSSSSSSSs...........',
    '..sSSSSSSSSSs...........',
    '.sSSSSSSSSSSs...........',
    'sSSSSSSSSSSSSs..........',
    '.sSSSSSSSSSSs...........',
    '..sSSSSSSSSSs...........',
    '...sSSSSSSSSs...........',
    '....sSSSSSSs............',
    '.....sSSSSs.............',
    '......sSSs..............',
    '.......sss..............',
    '........................',
  ],
  capital: [
    '........................',
    '..........WW............',
    '.........WWWW...........',
    '........WWWWWW..........',
    '.......WWWWWWWW.........',
    '......WWWWWWWWWW........',
    '.....WWWWWWWWWWWW.......',
    '....WWWWWWWWWWWWWW......',
    '...WWWWWWWWWWWWWWWW.....',
    '..WWWWWWWWWWWWWWWWWW....',
    '.WWwWWWWWWWWWWWWwWWWW...',
    '..WWwWWWWWWWWWWwWWWW....',
    '...WWwWWWWWWWWwWWWW.....',
    '....WWwWWWWWWwWWWW......',
    '.....WWwWWWWwWWWW.......',
    '......WWwWWwWWWW........',
    '.......WWWWWW...........',
    '........WWWW............',
    '.....rrrrrrrrrrrrr......',
    '.....RRRRRRRRRRRRR......',
    '........................',
    '........................',
  ],
  city: [
    '........................',
    '........................',
    '....gg....ggg...gg......',
    '....GG....GGG...GG......',
    '....GG....GGG...GG......',
    '....GG....GGG...GGg.....',
    '....GGg...GGG...GGG.....',
    '....GGG...GGG...GGG.....',
    '....GGG...GGG...GGG.....',
    '....GGG...GGG...GGG.....',
    '....GGG...GGG...GGG.....',
    '....ggg...ggg...ggg.....',
    '........................',
    '.....rrrrrrrrrrrrr......',
    '.....RRRRRRRRRRRRR......',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
}

function mapToSvg(name, map) {
  const rects = []
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const fill = PIXEL_COLORS[map[y][x]]
      if (fill) rects.push(`  <rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`)
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22" shape-rendering="crispEdges">
  <defs>
    <clipPath id="hex-${name}">
      <path d="${HEX_PATH}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#hex-${name})">
    <rect width="24" height="22" fill="${PIXEL_COLORS.B}"/>
${rects.join('\n')}
  </g>
  <path d="${HEX_PATH}" stroke="${PIXEL_COLORS.K}" stroke-width="0.6" fill="none"/>
</svg>
`
}

mkdirSync(outDir, { recursive: true })
for (const [name, map] of Object.entries(TERRAIN_MAPS)) {
  writeFileSync(join(outDir, `${name}.svg`), mapToSvg(name, map))
  console.log(`Generated ${name}.svg`)
}
