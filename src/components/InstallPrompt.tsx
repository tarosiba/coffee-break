import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('coffee-break-install-dismissed') === '1'
  })
  const [isStandalone] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true),
  )

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isStandalone || dismissed || !deferredPrompt) return null

  const install = async () => {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  const dismiss = () => {
    localStorage.setItem('coffee-break-install-dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="rounded-2xl border border-coffee-300 bg-coffee-100/80 p-4">
      <p className="mb-3 text-sm text-coffee-700">
        <span className="mr-1" aria-hidden>📲</span>
        ホーム画面に追加すると、アイコンからすぐゲームを始められます
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={install}
          className="touch-target rounded-xl bg-coffee-600 px-4 py-2 text-sm font-medium text-cream"
        >
          インストール
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="touch-target rounded-xl px-4 py-2 text-sm text-coffee-600"
        >
          あとで
        </button>
      </div>
      <p className="mt-2 text-xs text-coffee-500">
        iPad の場合: Safari の共有ボタン →「ホーム画面に追加」
      </p>
    </div>
  )
}
