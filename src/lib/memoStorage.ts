export interface MemoRecord {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
  audioMimeType?: string
}

const DB_NAME = 'coffee-break-memos'
const DB_VERSION = 1
const MEMO_STORE = 'memos'
const AUDIO_STORE = 'audio'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(MEMO_STORE)) {
        db.createObjectStore(MEMO_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE)
      }
    }
  })
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export function generateMemoId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function loadMemos(): Promise<MemoRecord[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEMO_STORE, 'readonly')
    const request = tx.objectStore(MEMO_STORE).getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const list = (request.result as MemoRecord[]) ?? []
      list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      resolve(list)
    }
  })
}

export async function saveMemo(memo: MemoRecord): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(MEMO_STORE, 'readwrite')
  tx.objectStore(MEMO_STORE).put(memo)
  await txDone(tx)
}

export async function deleteMemo(id: string): Promise<void> {
  const db = await openDb()
  const tx = db.transaction([MEMO_STORE, AUDIO_STORE], 'readwrite')
  tx.objectStore(MEMO_STORE).delete(id)
  tx.objectStore(AUDIO_STORE).delete(id)
  await txDone(tx)
}

export async function saveMemoAudio(id: string, blob: Blob): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(AUDIO_STORE, 'readwrite')
  tx.objectStore(AUDIO_STORE).put(blob, id)
  await txDone(tx)
}

export async function loadMemoAudio(id: string): Promise<Blob | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, 'readonly')
    const request = tx.objectStore(AUDIO_STORE).get(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null)
  })
}

export async function deleteMemoAudio(id: string): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(AUDIO_STORE, 'readwrite')
  tx.objectStore(AUDIO_STORE).delete(id)
  await txDone(tx)
}

export function formatMemoDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
