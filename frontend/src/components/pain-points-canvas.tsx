import { useRef, useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

export function PainPointsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444')
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  const colors = [
    { color: '#ef4444', label: 'High Risk' },
    { color: '#22c55e', label: 'Medium Risk' },
    { color: '#3b82f6', label: 'Low Risk' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 400

    // Draw stick figure
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = '/trader-figure.svg'
    img.onload = () => {
      ctx.drawImage(img, 50, 50, 300, 300)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    lastPositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPositionRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    // Set brush style
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Draw the line
    ctx.beginPath()
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y)
    ctx.lineTo(currentX, currentY)
    ctx.stroke()

    // Update the last position
    lastPositionRef.current = { x: currentX, y: currentY }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPositionRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Redraw the stick figure
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = '/trader-figure.svg'
    img.onload = () => {
      ctx.drawImage(img, 50, 50, 300, 300)
    }
  }

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {colors.map((color) => (
          <button
            key={color.color}
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: color.color }}
            onClick={() => setSelectedColor(color.color)}
            aria-label={color.label}
          />
        ))}
        <button
          onClick={clearCanvas}
          className="w-8 h-8 rounded-full border-2 border-white shadow-lg bg-white flex items-center justify-center"
          aria-label="Clear canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border rounded-lg cursor-crosshair touch-none"
        style={{ touchAction: 'none' }}
      />
      <div className="mt-2 text-sm text-gray-600">
        Select a color and paint over the areas where trading hurt you.
      </div>
    </div>
  )
}

