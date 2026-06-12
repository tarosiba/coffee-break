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
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
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
          'overflow-hidden rounded-lg border-2 shadow-sm transition',
          selected
            ? 'border-coffee-500 ring-2 ring-coffee-300 ring-offset-1'
            : 'border-coffee-200',
          interactive ? 'hover:border-coffee-400 hover:shadow-md active:scale-95' : '',
        ].join(' ')}
      >
        <CityTileArt id={id} className="h-full w-full [&>svg]:h-full [&>svg]:w-full" />
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
