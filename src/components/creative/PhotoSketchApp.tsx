import { useCallback, useRef, useState } from 'react'
import {
  applyFilterToCanvas,
  downloadCanvas,
  loadImageToCanvas,
  type FilterStyle,
} from '../../lib/imageFilters'

const FILTERS: { id: FilterStyle; label: string; description: string }[] = [
  { id: 'monochrome', label: 'モノクロ', description: 'グレースケール変換' },
  { id: 'sketch', label: 'スケッチ', description: '鉛筆画風の線画' },
  { id: 'high-contrast', label: '白黒', description: '高コントラストの白黒' },
]

export function PhotoSketchApp() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [filter, setFilter] = useState<FilterStyle>('sketch')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyCurrentFilter = useCallback((source: HTMLCanvasElement, style: FilterStyle) => {
    try {
      const result = applyFilterToCanvas(source, style)
      setPreviewUrl(result.toDataURL('image/png'))
      setError(null)
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : '画像の変換に失敗しました')
      return null
    }
  }, [])

  const handleFile = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('画像ファイル（JPEG, PNG など）を選んでください')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const canvas = await loadImageToCanvas(file)
      sourceCanvasRef.current = canvas
      setFileName(file.name.replace(/\.[^.]+$/, ''))
      applyCurrentFilter(canvas, filter)
    } catch (e) {
      setError(e instanceof Error ? e.message : '画像の処理に失敗しました')
      setPreviewUrl(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (style: FilterStyle) => {
    setFilter(style)
    const source = sourceCanvasRef.current
    if (source) applyCurrentFilter(source, style)
  }

  const handleDownload = () => {
    const source = sourceCanvasRef.current
    if (!source) return
    const result = applyFilterToCanvas(source, filter)
    downloadCanvas(result, `${fileName || 'coffee-break'}-${filter}.png`)
  }

  const handleReset = () => {
    sourceCanvasRef.current = null
    setPreviewUrl(null)
    setFileName('')
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-coffee-300 bg-coffee-50/50 p-4 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="touch-target rounded-xl bg-coffee-600 px-5 py-3 text-sm font-medium text-cream disabled:opacity-50"
        >
          {loading ? '処理中…' : '📷 写真を選ぶ'}
        </button>
        <p className="mt-2 text-xs text-coffee-500">
          カメラロールやギャラリーから選べます。画像は端末内だけで処理されます。
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {previewUrl && (
        <>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterChange(f.id)}
                className={`touch-target rounded-lg px-3 py-2 text-left text-sm ${
                  filter === f.id
                    ? 'bg-coffee-600 text-cream'
                    : 'bg-coffee-100 text-coffee-700'
                }`}
              >
                <span className="font-medium">{f.label}</span>
                <span className="ml-1 text-xs opacity-80">({f.description})</span>
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-coffee-200 bg-white p-2">
            <img
              src={previewUrl}
              alt="変換プレビュー"
              className="mx-auto max-h-[480px] w-full object-contain"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="touch-target rounded-lg bg-coffee-600 px-4 py-2 text-sm font-medium text-cream"
            >
              💾 PNG保存
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="touch-target rounded-lg bg-coffee-100 px-4 py-2 text-sm text-coffee-700"
            >
              別の写真
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="touch-target rounded-lg bg-coffee-100 px-4 py-2 text-sm text-coffee-700"
            >
              リセット
            </button>
          </div>
        </>
      )}
    </div>
  )
}
