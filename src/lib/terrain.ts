export type CityTerrainId = 'factory' | 'airfield' | 'capital' | 'city'

export interface CityTerrain {
  id: CityTerrainId
  label: string
  description: string
  effect: string
  bonus: string
}

/** 大戦略スタイルの施設タイル定義 */
export const CITY_TERRAINS: CityTerrain[] = [
  {
    id: 'factory',
    label: '工場',
    description: '煙突の立つ工業施設。物資生産の拠点。',
    effect: '毎ターン物資 +1',
    bonus: '生産力',
  },
  {
    id: 'airfield',
    label: '飛行場',
    description: '滑走路を備えた航空基地。空軍の展開に必須。',
    effect: '航空ユニット配備可',
    bonus: '空域支配',
  },
  {
    id: 'capital',
    label: '首都',
    description: '政府庁舎の立つ首都。占領で勝利に近づく。',
    effect: '占領で大きな勝利点',
    bonus: '支配力',
  },
  {
    id: 'city',
    label: '都市',
    description: '高層ビルが立ち並ぶ大都市。資金と人員の源泉。',
    effect: '毎ターン資金 +2',
    bonus: '経済力',
  },
]

export function getCityTerrain(id: CityTerrainId): CityTerrain {
  const terrain = CITY_TERRAINS.find((t) => t.id === id)
  if (!terrain) throw new Error(`Unknown city terrain: ${id}`)
  return terrain
}
