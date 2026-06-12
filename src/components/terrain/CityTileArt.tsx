import type { ReactElement, ReactNode } from 'react'
import type { CityTerrainId } from '../../lib/terrain'

interface CityTileArtProps {
  id: CityTerrainId
  className?: string
}

const palette = {
  grassLight: '#7fa86d',
  grassDark: '#5d7a4f',
  dirt: '#c9a97a',
  dirtDark: '#a8875c',
  wall: '#8a8a8a',
  wallDark: '#5c5c5c',
  roof: '#6f4a2a',
  roofDark: '#4a3018',
  wallWood: '#8b5e34',
  cream: '#fff8f0',
  shadow: '#2a1b0f',
  water: '#6ba3b8',
  waterLight: '#8ec4d4',
  gold: '#d4a84b',
  window: '#ffe9a8',
}

function TileFrame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="grass-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor={palette.grassLight} />
          <stop offset="100%" stopColor={palette.grassDark} />
        </linearGradient>
        <filter id="tile-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor={palette.shadow} floodOpacity="0.25" />
        </filter>
      </defs>
      <rect width="64" height="64" rx="6" fill="url(#grass-bg)" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="5" stroke={palette.shadow} strokeOpacity="0.15" strokeWidth="1" fill="none" />
      {children}
      <rect x="2" y="2" width="60" height="60" rx="5" stroke={palette.cream} strokeOpacity="0.35" strokeWidth="0.75" fill="none" />
    </svg>
  )
}

function VillageArt() {
  return (
    <TileFrame>
      <path d="M28 34h8v18H28z" fill={palette.dirt} />
      <path d="M20 34h24v3H20z" fill={palette.dirtDark} opacity="0.5" />
      <ellipse cx="32" cy="52" rx="10" ry="2" fill={palette.shadow} opacity="0.12" />

      <rect x="10" y="28" width="10" height="8" fill={palette.wallWood} filter="url(#tile-shadow)" />
      <path d="M9 28l5-5 5 5z" fill={palette.roof} />
      <rect x="12" y="31" width="3" height="3" rx="0.5" fill={palette.window} />

      <rect x="44" y="26" width="10" height="9" fill={palette.wallWood} filter="url(#tile-shadow)" />
      <path d="M43 26l5-5 5 5z" fill={palette.roofDark} />
      <rect x="47" y="29" width="3" height="3" rx="0.5" fill={palette.window} />

      <rect x="26" y="18" width="12" height="10" fill={palette.wallWood} filter="url(#tile-shadow)" />
      <path d="M25 18l6-6 6 6z" fill={palette.roof} />
      <rect x="30" y="22" width="4" height="4" rx="0.5" fill={palette.window} />

      <circle cx="18" cy="44" r="4" fill={palette.waterLight} stroke={palette.water} strokeWidth="1" />
      <rect x="16" y="42" width="4" height="1.5" rx="0.5" fill={palette.wallDark} opacity="0.4" />

      <circle cx="48" cy="42" r="3.5" fill={palette.grassDark} />
      <circle cx="48" cy="40" r="3.5" fill={palette.grassLight} />
      <rect x="47" y="42" width="2" height="4" fill={palette.wallWood} />
    </TileFrame>
  )
}

function TownArt() {
  return (
    <TileFrame>
      <rect x="8" y="8" width="48" height="48" rx="2" fill={palette.wall} opacity="0.25" />
      <rect x="8" y="8" width="48" height="3" fill={palette.wallDark} />
      <rect x="8" y="53" width="48" height="3" fill={palette.wallDark} />
      <rect x="8" y="8" width="3" height="48" fill={palette.wallDark} />
      <rect x="53" y="8" width="3" height="48" fill={palette.wallDark} />

      <rect x="28" y="53" width="8" height="4" fill={palette.dirtDark} />
      <path d="M26 53h12l-2 4H28z" fill={palette.wall} />

      <path d="M30 20h4v34h-4z" fill={palette.dirt} />
      <path d="M18 30h28v3H18z" fill={palette.dirt} />

      <rect x="14" y="22" width="9" height="12" fill={palette.wallWood} filter="url(#tile-shadow)" />
      <path d="M13 22l4.5-5 4.5 5z" fill={palette.roof} />
      <rect x="16" y="26" width="2.5" height="3" rx="0.5" fill={palette.window} />

      <rect x="41" y="20" width="9" height="14" fill={palette.wallWood} filter="url(#tile-shadow)" />
      <path d="M40 20l4.5-6 4.5 6z" fill={palette.roofDark} />
      <rect x="44" y="25" width="2.5" height="3" rx="0.5" fill={palette.window} />

      <rect x="27" y="12" width="10" height="16" fill={palette.wall} filter="url(#tile-shadow)" />
      <rect x="29" y="8" width="6" height="6" fill={palette.wallDark} />
      <path d="M28 8h8l-1 3H29z" fill={palette.roofDark} />
      <rect x="31" y="18" width="2" height="4" fill={palette.cream} opacity="0.6" />

      <rect x="22" y="36" width="20" height="10" fill={palette.cream} filter="url(#tile-shadow)" />
      <path d="M21 36l10-4 10 4z" fill={palette.roof} />
      <rect x="28" y="40" width="8" height="5" rx="0.5" fill={palette.wallWood} opacity="0.5" />
    </TileFrame>
  )
}

function MetropolisArt() {
  return (
    <TileFrame>
      <rect x="6" y="6" width="52" height="52" rx="3" fill={palette.water} opacity="0.35" />
      <rect x="10" y="10" width="44" height="44" rx="2" fill={palette.grassLight} />

      <rect x="12" y="14" width="6" height="8" fill={palette.wallWood} />
      <path d="M11 14l3-3 3 3z" fill={palette.roof} />
      <rect x="46" y="14" width="6" height="8" fill={palette.wallWood} />
      <path d="M45 14l3-3 3 3z" fill={palette.roof} />
      <rect x="12" y="42" width="6" height="8" fill={palette.wallWood} />
      <path d="M11 42l3-3 3 3z" fill={palette.roofDark} />
      <rect x="46" y="42" width="6" height="8" fill={palette.wallWood} />
      <path d="M45 42l3-3 3 3z" fill={palette.roofDark} />

      <rect x="22" y="22" width="20" height="16" fill={palette.cream} filter="url(#tile-shadow)" />
      <path d="M21 22l10-6 10 6z" fill={palette.roofDark} />
      <rect x="30" y="28" width="4" height="10" fill={palette.wallDark} />
      <rect x="28" y="14" width="8" height="10" fill={palette.wall} filter="url(#tile-shadow)" />
      <path d="M27 14l4-5 4 5z" fill={palette.gold} />
      <circle cx="32" cy="11" r="1.5" fill={palette.gold} />

      <rect x="14" y="30" width="5" height="14" fill={palette.wall} />
      <path d="M13 30l2.5-8 2.5 8z" fill={palette.cream} />
      <rect x="45" y="30" width="5" height="14" fill={palette.wall} />
      <path d="M44 30l2.5-8 2.5 8z" fill={palette.cream} />

      <path d="M30 38h4v10h-4z" fill={palette.dirt} />
      <path d="M24 42h16v2H24z" fill={palette.dirt} />

      <rect x="18" y="46" width="28" height="4" fill={palette.wallDark} opacity="0.4" />
      <rect x="26" y="46" width="4" height="4" fill={palette.gold} opacity="0.8" />
      <rect x="34" y="46" width="4" height="4" fill={palette.gold} opacity="0.8" />
    </TileFrame>
  )
}

const artById: Record<CityTerrainId, () => ReactElement> = {
  village: VillageArt,
  town: TownArt,
  metropolis: MetropolisArt,
}

export function CityTileArt({ id, className }: CityTileArtProps) {
  const Art = artById[id]
  return (
    <div className={className}>
      <Art />
    </div>
  )
}
