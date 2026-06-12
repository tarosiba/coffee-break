import { useState } from 'react'
import { CITY_TERRAINS, type CityTerrainId } from '../../lib/terrain'
import { CityTerrainChip } from './CityTerrainChip'
import { CityTileArt } from './CityTileArt'

export function TerrainShowcase() {
  const [selected, setSelected] = useState<CityTerrainId>('village')
  const detail = CITY_TERRAINS.find((t) => t.id === selected)!

  return (
    <div className="space-y-6">
      <p className="text-sm text-coffee-600">
        ストラテジーゲーム向けの都市地形タイルチップ見本です。統一されたパレットと枠線で、小さいサイズでも判別しやすくしています。
      </p>

      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6">
        {CITY_TERRAINS.map((terrain) => (
          <CityTerrainChip
            key={terrain.id}
            id={terrain.id}
            size="lg"
            showLabel
            selected={selected === terrain.id}
            onClick={() => setSelected(terrain.id)}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-coffee-200 bg-coffee-50/60 p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="w-32 shrink-0 overflow-hidden rounded-xl border-2 border-coffee-300 shadow-md">
            <CityTileArt id={selected} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="mb-1 text-xl font-bold text-coffee-800">{detail.label}</h4>
            <p className="mb-3 text-sm text-coffee-600">{detail.description}</p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-xs text-coffee-400">人口</dt>
                <dd className="font-medium text-coffee-800">{detail.population}</dd>
              </div>
              <div className="rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-xs text-coffee-400">ボーナス</dt>
                <dd className="font-medium text-coffee-800">{detail.bonus}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-coffee-300 bg-white/50 p-4">
        <h5 className="mb-2 text-sm font-semibold text-coffee-700">サイズ比較</h5>
        <div className="flex items-end justify-center gap-3">
          <CityTerrainChip id={selected} size="sm" showLabel />
          <CityTerrainChip id={selected} size="md" showLabel />
          <CityTerrainChip id={selected} size="lg" showLabel />
        </div>
        <p className="mt-3 text-center text-xs text-coffee-500">
          sm (48px) / md (64px) / lg (96px) — マップ上のズームレベルに合わせて使い分け
        </p>
      </div>
    </div>
  )
}
