export type FilterStyle = 'monochrome' | 'sketch' | 'high-contrast'

function cloneImageData(ctx: CanvasRenderingContext2D, width: number, height: number): ImageData {
  return ctx.getImageData(0, 0, width, height)
}

function toGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray
  }
}

function invertGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }
}

function colorDodge(base: number, blend: number): number {
  if (blend >= 255) return 255
  return Math.min(255, (base * 255) / (255 - blend))
}

function applyColorDodge(base: ImageData, blend: ImageData): ImageData {
  const out = new ImageData(base.width, base.height)
  for (let i = 0; i < base.data.length; i += 4) {
    const v = colorDodge(base.data[i], blend.data[i])
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = base.data[i + 3]
  }
  return out
}

function applyHighContrast(data: Uint8ClampedArray, threshold = 128): void {
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i] >= threshold ? 255 : 0
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
  }
}

function blurCanvas(source: HTMLCanvasElement, radius: number): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.filter = `blur(${radius}px)`
  ctx.drawImage(source, 0, 0)
  ctx.filter = 'none'
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function putImageData(ctx: CanvasRenderingContext2D, imageData: ImageData): void {
  ctx.putImageData(imageData, 0, 0)
}

export function applyFilterToCanvas(
  source: HTMLCanvasElement,
  style: FilterStyle,
): HTMLCanvasElement {
  const width = source.width
  const height = source.height
  const output = document.createElement('canvas')
  output.width = width
  output.height = height
  const ctx = output.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  const baseData = cloneImageData(
    (() => {
      const c = document.createElement('canvas')
      c.width = width
      c.height = height
      const cx = c.getContext('2d')!
      cx.drawImage(source, 0, 0)
      return cx
    })(),
    width,
    height,
  )

  if (style === 'monochrome') {
    toGrayscale(baseData.data)
    putImageData(ctx, baseData)
    return output
  }

  if (style === 'high-contrast') {
    toGrayscale(baseData.data)
    applyHighContrast(baseData.data)
    putImageData(ctx, baseData)
    return output
  }

  // sketch: grayscale → invert → blur → color dodge with original gray
  const grayData = cloneImageData(
    (() => {
      const c = document.createElement('canvas')
      c.width = width
      c.height = height
      const cx = c.getContext('2d')!
      cx.putImageData(baseData, 0, 0)
      return cx
    })(),
    width,
    height,
  )
  toGrayscale(grayData.data)

  const grayCanvas = document.createElement('canvas')
  grayCanvas.width = width
  grayCanvas.height = height
  const grayCtx = grayCanvas.getContext('2d')!
  grayCtx.putImageData(grayData, 0, 0)

  const inverted = cloneImageData(grayCtx, width, height)
  invertGrayscale(inverted.data)

  const invertedCanvas = document.createElement('canvas')
  invertedCanvas.width = width
  invertedCanvas.height = height
  const invertedCtx = invertedCanvas.getContext('2d')!
  invertedCtx.putImageData(inverted, 0, 0)

  const blurred = blurCanvas(invertedCanvas, Math.max(2, Math.round(width / 200)))
  const result = applyColorDodge(grayData, blurred)
  putImageData(ctx, result)
  return output
}

export function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const maxSize = 1200
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        const scale = maxSize / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas not supported'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像の読み込みに失敗しました'))
    }
    img.src = url
  })
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
