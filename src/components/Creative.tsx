import { useState } from 'react'
import { DrawingApp } from './creative/DrawingApp'
import { PhotoSketchApp } from './creative/PhotoSketchApp'
import { CursorGallery } from './creative/CursorGallery'
import { HomeDesignerApp } from './creative/HomeDesignerApp'

type CreativeMode = 'drawing' | 'photo-sketch' | 'cursor-gallery' | 'home-designer'

const modes: { id: CreativeMode; title: string; description: string; icon: string }[] = [
  { id: 'drawing', title: 'お絵描き', description: '指やマウスで自由に描く', icon: '🖌' },
  { id: 'photo-sketch', title: '写真→イラスト', description: 'モノクロ・スケッチ風に変換', icon: '🖼' },
  { id: 'home-designer', title: '間取りデザイナー', description: '平面図を作って3Dで見る', icon: '🏠' },
  { id: 'cursor-gallery', title: 'カーソル君の絵', description: '騙し絵・しば犬など', icon: '🤖☕' },
]

export function Creative() {
  const [activeMode, setActiveMode] = useState<CreativeMode | null>(null)
  const active = modes.find((m) => m.id === activeMode)

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold text-coffee-800">クリエイティブ</h2>
        <p className="text-sm text-coffee-500">お絵描き・間取りデザイン・写真のイラスト風変換</p>
      </div>

      {!activeMode ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              className="touch-target flex items-center gap-4 rounded-2xl border border-coffee-200 bg-white/70 p-4 text-left transition active:scale-[0.98] hover:border-coffee-300 hover:shadow-sm"
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>{mode.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-coffee-800">{mode.title}</h3>
                <p className="text-sm text-coffee-500">{mode.description}</p>
              </div>
              <span className="text-coffee-400">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-coffee-200 bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveMode(null)}
              className="touch-target rounded-lg px-3 py-2 text-sm text-coffee-500 hover:bg-coffee-100"
            >
              ← 戻る
            </button>
            <h3 className="text-lg font-semibold text-coffee-800">
              <span className="mr-2" aria-hidden>{active?.icon}</span>
              {active?.title}
            </h3>
          </div>
          {activeMode === 'drawing' && <DrawingApp />}
          {activeMode === 'photo-sketch' && <PhotoSketchApp />}
          {activeMode === 'home-designer' && <HomeDesignerApp />}
          {activeMode === 'cursor-gallery' && <CursorGallery />}
        </div>
      )}
    </div>
  )
}
