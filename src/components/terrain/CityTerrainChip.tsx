import type { CityTerrainId } from '../../lib/terrain'
import { getCityTerrain } from '../../lib/terrain'
import { CityTileArt } from './CityTileArt'

interface CityTerrainChipProps {
  id: CityTerrainId
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  selected?: boolean
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-11',
  md: 'w-14',
  lg: 'w-[5.5rem]',
}

export function CityTerrainChip({
  id,
  size = 'md',
  showLabel = false,
  selected = false,
  onClick,
}: CityTerrainChipProps) {
  const terrain = getCityTerrain(id)
  const interactive = Boolean(onClick)

  const chip = (
    <div
      className={[
        'relative flex flex-col items-center gap-1.5',
        interactive ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      <div
        className={[
          sizeClasses[size],
          'transition',
          selected ? 'drop-shadow-[0_0_4px_rgba(111,74,42,0.6)]' : '',
          interactive ? 'hover:scale-105 active:scale-95' : '',
        ].join(' ')}
      >
        <CityTileArt id={id} className="h-auto w-full [&>svg]:h-auto [&>svg]:w-full" />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-coffee-700">{terrain.label}</span>
      )}
    </div>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="touch-target rounded-xl p-1 text-left">
        {chip}
      </button>
    )
  }

  return chip
}
