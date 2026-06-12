import { useState } from 'react'
import { CITY_TERRAINS, type CityTerrainId } from '../../lib/terrain'
import { CityTerrainChip } from './CityTerrainChip'
import { CityTileArt } from './CityTileArt'

export function TerrainShowcase() {
  const [selected, setSelected] = useState<CityTerrainId>('factory')
  const detail = CITY_TERRAINS.find((t) => t.id === selected)!

  return (
    <div className="space-y-6">
      <p className="text-sm text-coffee-600">
        大戦略のマップチップを参考にした六角形ピクセルアートです。施設タイルは青背景に建物シルエットを配置し、FC 時代のドット絵スタイルで統一しています。
      </p>

      <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
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
          <div className="w-28 shrink-0 sm:w-32">
            <CityTileArt id={selected} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="mb-1 text-xl font-bold text-coffee-800">{detail.label}</h4>
            <p className="mb-3 text-sm text-coffee-600">{detail.description}</p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-white/70 px-3 py-2">
                <dt className="text-xs text-coffee-400">効果</dt>
                <dd className="font-medium text-coffee-800">{detail.effect}</dd>
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
        <h5 className="mb-2 text-sm font-semibold text-coffee-700">デザイン仕様</h5>
        <ul className="space-y-1 text-xs text-coffee-600">
          <li>六角形グリッド（flat-top hex）+ 黒い輪郭線</li>
          <li>施設タイルは青背景（#2858b8）で地形と区別</li>
          <li>限定パレットのピクセルアート（shape-rendering: crispEdges）</li>
          <li>斜め俯瞰のシンプルなアイコンシルエット</li>
        </ul>
        <h5 className="mb-2 mt-4 text-sm font-semibold text-coffee-700">サイズ比較</h5>
        <div className="flex items-end justify-center gap-3">
          <CityTerrainChip id={selected} size="sm" showLabel />
          <CityTerrainChip id={selected} size="md" showLabel />
          <CityTerrainChip id={selected} size="lg" showLabel />
        </div>
      </div>
    </div>
  )
}
