import type { ReactElement } from 'react'
import { HEX_PATH, PIXEL_COLORS } from '../../lib/terrainMaps'

export const TILE_WIDTH = 24
export const TILE_HEIGHT = 22

interface PixelTileProps {
  map: string[]
  id: string
}

/** ピクセルマップを六角形クリップ付き SVG に描画 */
export function PixelHexTile({ map, id }: PixelTileProps): ReactElement {
  const pixels: ReactElement[] = []

  for (let y = 0; y < map.length; y++) {
    const row = map[y]
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      const fill = PIXEL_COLORS[ch]
      if (!fill || fill === 'transparent') continue
      pixels.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />)
    }
  }

  return (
    <svg
      viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <defs>
        <clipPath id={`hex-${id}`}>
          <path d={HEX_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#hex-${id})`}>
        <rect width={TILE_WIDTH} height={TILE_HEIGHT} fill={PIXEL_COLORS.B} />
        {pixels}
      </g>
      <path d={HEX_PATH} stroke={PIXEL_COLORS.K} strokeWidth={0.6} fill="none" />
    </svg>
  )
}
