const PENROSE_STAIRS_SRC = `${import.meta.env.BASE_URL}images/penrose-stairs.png`

export function CursorGallery() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-coffee-600">
        カーソル君が描いた騙し絵です。ずっと登り続けているように見える「ペンローズの階段」。
      </p>
      <figure className="overflow-hidden rounded-xl border border-coffee-200 bg-cream">
        <img
          src={PENROSE_STAIRS_SRC}
          alt="ペンローズの階段 — ずっと登り続ける錯覚の階段"
          className="mx-auto w-full max-w-lg"
          loading="lazy"
        />
        <figcaption className="border-t border-coffee-100 px-4 py-3 text-center text-xs text-coffee-500">
          ペンローズの階段（騙し絵）🤖☕
        </figcaption>
      </figure>
    </div>
  )
}
