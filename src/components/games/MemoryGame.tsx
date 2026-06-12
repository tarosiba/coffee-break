import { useCallback, useState } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'

interface Card {
  id: number
  pairId: number
  suit: Suit
  rank: string
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8']

function createDeck(pairCount: number): Card[] {
  const cards: Card[] = []
  for (let i = 0; i < pairCount; i++) {
    const suit = SUITS[i % 4]
    const rank = RANKS[Math.floor(i / 4)]
    cards.push({ id: i * 2, pairId: i, suit, rank })
    cards.push({ id: i * 2 + 1, pairId: i, suit, rank })
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

function isRed(suit: Suit) {
  return suit === '♥' || suit === '♦'
}

export function MemoryGame() {
  const [cards, setCards] = useState(() => createDeck(8))
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)

  const won = matched.size === cards.length

  const restart = () => {
    setCards(createDeck(8))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
  }

  const flipCard = useCallback(
    (id: number) => {
      if (locked || flipped.includes(id) || matched.has(id)) return

      const nextFlipped = [...flipped, id]
      setFlipped(nextFlipped)

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1)
        setLocked(true)
        const [a, b] = nextFlipped
        const cardA = cards.find((c) => c.id === a)!
        const cardB = cards.find((c) => c.id === b)!

        if (cardA.pairId === cardB.pairId) {
          setMatched((prev) => new Set([...prev, a, b]))
          setFlipped([])
          setLocked(false)
        } else {
          setTimeout(() => {
            setFlipped([])
            setLocked(false)
          }, 800)
        }
      }
    },
    [cards, flipped, locked, matched],
  )

  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-6 text-sm text-coffee-600">
        <span>手数: {moves}</span>
        <span>ペア: {matched.size / 2} / {cards.length / 2}</span>
      </div>

      {won ? (
        <div className="space-y-4 text-center">
          <p className="text-xl font-bold text-coffee-700">
            クリア！ {moves} 手で全部揃えました 🎉
          </p>
          <button
            type="button"
            onClick={restart}
            className="touch-target rounded-xl bg-coffee-600 px-6 py-3 font-medium text-cream"
          >
            もう一度
          </button>
        </div>
      ) : (
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3">
          {cards.map((card) => {
            const isFaceUp = flipped.includes(card.id) || matched.has(card.id)
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => flipCard(card.id)}
                disabled={isFaceUp || locked}
                className={`touch-target flex aspect-[3/4] flex-col items-center justify-center rounded-xl border-2 text-lg font-bold transition active:scale-95 sm:text-xl ${
                  isFaceUp
                    ? matched.has(card.id)
                      ? 'border-green-300 bg-green-50'
                      : 'border-coffee-300 bg-white'
                    : 'border-coffee-400 bg-coffee-600 text-cream'
                }`}
              >
                {isFaceUp ? (
                  <>
                    <span className={isRed(card.suit) ? 'text-red-600' : 'text-coffee-900'}>
                      {card.rank}
                    </span>
                    <span className={`text-2xl ${isRed(card.suit) ? 'text-red-500' : 'text-coffee-800'}`}>
                      {card.suit}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl opacity-80">🂠</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!won && (
        <p className="text-center text-xs text-coffee-500">
          トランプのペアを探す神経衰弱です。カードをタップしてめくってください。
        </p>
      )}
    </div>
  )
}
