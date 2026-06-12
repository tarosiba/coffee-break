import type { CityTerrainId } from '../../lib/terrain'
import { TERRAIN_MAPS } from '../../lib/terrainMaps'
import { PixelHexTile } from './pixelTileUtils'

interface CityTileArtProps {
  id: CityTerrainId
  className?: string
}

export function CityTileArt({ id, className }: CityTileArtProps) {
  return (
    <div className={className}>
      <PixelHexTile map={TERRAIN_MAPS[id]} id={id} />
    </div>
  )
}
