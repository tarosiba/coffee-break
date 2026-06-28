import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deleteMemo,
  formatMemoDate,
  generateMemoId,
  loadMemoAudio,
  loadMemos,
  saveMemo,
  saveMemoAudio,
  type MemoRecord,
} from '../lib/memoStorage'

const MAX_RECORD_SECONDS = 120

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function Memo() {
  const [memos, setMemos] = useState<MemoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [pendingAudio, setPendingAudio] = useState<Blob | null>(null)
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const refresh = useCallback(async () => {
    const list = await loadMemos()
    setMemos(list)
    return list
  }, [])

  useEffect(() => {
    let cancelled = false
    void loadMemos().then((list) => {
      if (!cancelled) {
        setMemos(list)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (pendingAudioUrl) URL.revokeObjectURL(pendingAudioUrl)
      if (timerRef.current) window.clearInterval(timerRef.current)
      recorderRef.current?.stop()
    }
  }, [pendingAudioUrl])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setBody('')
    setPendingAudio(null)
    if (pendingAudioUrl) URL.revokeObjectURL(pendingAudioUrl)
    setPendingAudioUrl(null)
    setError(null)
    setRecordSeconds(0)
  }

  const startNew = () => {
    resetForm()
    setEditingId('new')
  }

  const startEdit = (memo: MemoRecord) => {
    setEditingId(memo.id)
    setTitle(memo.title)
    setBody(memo.body)
    setPendingAudio(null)
    if (pendingAudioUrl) URL.revokeObjectURL(pendingAudioUrl)
    setPendingAudioUrl(null)
    setError(null)
  }

  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    recorderRef.current?.stop()
    recorderRef.current = null
    setIsRecording(false)
  }

  const startRecording = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : ''
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (pendingAudioUrl) URL.revokeObjectURL(pendingAudioUrl)
        setPendingAudio(blob)
        setPendingAudioUrl(URL.createObjectURL(blob))
        setRecordSeconds(0)
      }
      recorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setRecordSeconds(0)
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => {
          if (s + 1 >= MAX_RECORD_SECONDS) {
            stopRecording()
            return MAX_RECORD_SECONDS
          }
          return s + 1
        })
      }, 1000)
    } catch {
      setError('マイクの使用が許可されていません。設定からマイクをオンにしてください。')
    }
  }

  const handleRecordToggle = () => {
    if (isRecording) stopRecording()
    else void startRecording()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()
    if (!trimmedTitle && !trimmedBody && !pendingAudio) {
      setError('タイトル、メモ、または音声のいずれかを入力してください。')
      return
    }

    const now = new Date().toISOString()
    const id = editingId === 'new' ? generateMemoId() : editingId!
    const existing = memos.find((m) => m.id === id)

    const memo: MemoRecord = {
      id,
      title: trimmedTitle || '無題のメモ',
      body: trimmedBody,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      audioMimeType: pendingAudio
        ? pendingAudio.type
        : existing?.audioMimeType,
    }

    if (!pendingAudio && !existing?.audioMimeType) {
      delete memo.audioMimeType
    }

    try {
      await saveMemo(memo)
      if (pendingAudio) {
        await saveMemoAudio(id, pendingAudio)
        memo.audioMimeType = pendingAudio.type
      }
      await refresh()
      resetForm()
    } catch {
      setError('保存に失敗しました。録音が長すぎる場合は短くしてみてください。')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('このメモを削除しますか？')) return
    await deleteMemo(id)
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
    }
    if (editingId === id) resetForm()
    await refresh()
  }

  const playAudio = async (memo: MemoRecord) => {
    if (playingId === memo.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    const blob = await loadMemoAudio(memo.id)
    if (!blob) {
      setError('音声が見つかりませんでした。')
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
      URL.revokeObjectURL(audioRef.current.src)
    }
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => {
      setPlayingId(null)
      URL.revokeObjectURL(url)
    }
    setPlayingId(memo.id)
    void audio.play()
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-coffee-500">メモを読み込み中…</div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-coffee-800">コーヒーブレイクメモ</h2>
          <p className="mt-1 text-sm text-coffee-500">
            思いついたことを記録。音声メモも残せます（最大{MAX_RECORD_SECONDS}秒）
          </p>
        </div>
        {!editingId && (
          <button
            type="button"
            onClick={startNew}
            className="touch-target shrink-0 rounded-xl bg-coffee-600 px-4 py-2 text-sm font-medium text-cream hover:bg-coffee-700"
          >
            ＋ 新規
          </button>
        )}
      </div>

      {editingId && (
        <form
          onSubmit={(e) => void handleSave(e)}
          className="space-y-4 rounded-2xl border border-coffee-200 bg-white/80 p-4 shadow-sm sm:p-6"
        >
          <h3 className="font-semibold text-coffee-800">
            {editingId === 'new' ? '新しいメモ' : 'メモを編集'}
          </h3>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル（例: 今日の気づき）"
            maxLength={80}
            className="w-full rounded-xl border border-coffee-200 bg-white px-3 py-2.5 text-coffee-800 placeholder:text-coffee-400 focus:border-coffee-400 focus:outline-none"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="メモを書く…"
            rows={5}
            maxLength={5000}
            className="w-full resize-y rounded-xl border border-coffee-200 bg-white px-3 py-2.5 text-sm text-coffee-800 placeholder:text-coffee-400 focus:border-coffee-400 focus:outline-none"
          />

          <div className="rounded-xl border border-coffee-200 bg-coffee-50/50 p-4">
            <p className="mb-3 text-sm font-medium text-coffee-700">音声メモ</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRecordToggle}
                className={`touch-target rounded-xl px-4 py-2.5 text-sm font-medium ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-coffee-600 text-cream hover:bg-coffee-700'
                }`}
              >
                {isRecording ? `■ 録音停止（${formatDuration(recordSeconds)}）` : '🎙 録音する'}
              </button>
              {pendingAudioUrl && !isRecording && (
                <audio controls src={pendingAudioUrl} className="max-w-full" />
              )}
              {!pendingAudioUrl && editingId !== 'new' && memos.find((m) => m.id === editingId)?.audioMimeType && (
                <button
                  type="button"
                  onClick={() => {
                    const m = memos.find((x) => x.id === editingId)
                    if (m) void playAudio(m)
                  }}
                  className="touch-target rounded-xl bg-coffee-100 px-4 py-2.5 text-sm text-coffee-700"
                >
                  {playingId === editingId ? '■ 停止' : '▶ 保存済みの音声'}
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-coffee-500">
              iPad / iPhone ではマイクの許可が必要です。コーヒーブレイクのひと言を残すのに便利です。
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="touch-target flex-1 rounded-xl bg-coffee-600 py-2.5 text-sm font-medium text-cream hover:bg-coffee-700"
            >
              記録を保存
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="touch-target rounded-xl bg-coffee-100 px-4 py-2.5 text-sm text-coffee-700"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-coffee-600">
          記録一覧（{memos.length}件）
        </h3>

        {memos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-coffee-300 bg-coffee-50/50 p-6 text-center text-sm text-coffee-500">
            まだメモがありません。「＋ 新規」から記録を始めましょう。
          </p>
        ) : (
          memos.map((memo) => (
            <article
              key={memo.id}
              className="rounded-2xl border border-coffee-200 bg-white/70 p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-coffee-800">{memo.title}</h4>
                  <p className="text-xs text-coffee-400">
                    記録: {formatMemoDate(memo.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {memo.audioMimeType && (
                    <button
                      type="button"
                      onClick={() => void playAudio(memo)}
                      className="touch-target rounded-lg bg-coffee-100 px-2 py-1 text-sm text-coffee-700"
                      aria-label="音声を再生"
                    >
                      {playingId === memo.id ? '■' : '🎙'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(memo)}
                    className="touch-target rounded-lg px-2 py-1 text-sm text-coffee-500 hover:bg-coffee-100"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(memo.id)}
                    className="touch-target rounded-lg px-2 py-1 text-sm text-red-500 hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>
              {memo.body && (
                <p className="whitespace-pre-wrap text-sm text-coffee-600">{memo.body}</p>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  )
}
