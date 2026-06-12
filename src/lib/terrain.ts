export type CityTerrainId = 'village' | 'town' | 'metropolis'

export interface CityTerrain {
  id: CityTerrainId
  label: string
  description: string
  population: string
  bonus: string
}

export const CITY_TERRAINS: CityTerrain[] = [
  {
    id: 'village',
    label: '村',
    description: '小さな集落。農地と家屋が点在する。',
    population: '〜500人',
    bonus: '食料 +1',
  },
  {
    id: 'town',
    label: '都市',
    description: '城壁に囲まれた商業都市。交易の拠点。',
    population: '〜5,000人',
    bonus: '金貨 +2',
  },
  {
    id: 'metropolis',
    label: '大都市',
    description: '王城と大聖堂を持つ首都。文明の中心地。',
    population: '50,000人〜',
    bonus: '文化 +3',
  },
]

export function getCityTerrain(id: CityTerrainId): CityTerrain {
  const terrain = CITY_TERRAINS.find((t) => t.id === id)
  if (!terrain) throw new Error(`Unknown city terrain: ${id}`)
  return terrain
}
