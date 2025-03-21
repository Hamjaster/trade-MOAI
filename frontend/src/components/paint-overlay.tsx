"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { Trash2, Check, Paintbrush, EyeOff } from "lucide-react";

export function PaintOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  const colors = [
    { color: "#F68A7B", label: "High Risk" },
    { color: "#8BC34A", label: "Medium Risk" },
    { color: "#7E57C2", label: "Low Risk" },
  ];

  // Load drawing from localStorage on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;

    // Load saved drawing from localStorage
    const savedDrawing = localStorage.getItem("canvasDrawing");
    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedDrawing;
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Save current drawing
      const savedDrawing = canvas.toDataURL();

      // Resize canvas
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = document.documentElement.scrollWidth;
      canvas.height = document.documentElement.scrollHeight;

      // Restore drawing
      ctx.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save drawing to localStorage whenever canvas changes
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    localStorage.setItem("canvasDrawing", dataUrl);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedColor || !isPaintMode) return; // Only allow drawing if a color is selected and in paint mode
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    lastPositionRef.current = {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY,
    };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      !isDrawing ||
      !lastPositionRef.current ||
      !selectedColor ||
      !isPaintMode
    )
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentX = e.clientX + window.scrollX;
    const currentY = e.clientY + window.scrollY;

    const r = Number.parseInt(selectedColor.slice(1, 3), 16);
    const g = Number.parseInt(selectedColor.slice(3, 5), 16);
    const b = Number.parseInt(selectedColor.slice(5, 7), 16);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;

    // Set composite operation to ensure consistent opacity
    ctx.globalCompositeOperation = "source-over";

    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastPositionRef.current = { x: currentX, y: currentY };

    // Save drawing after each stroke
    saveDrawing();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveDrawing();
    }
    setIsDrawing(false);
    lastPositionRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSelectedColor(null); // Deselect color after clearing

    // Clear localStorage
    localStorage.removeItem("canvasDrawing");
  };

  const togglePaintMode = () => {
    setIsPaintMode(!isPaintMode);
    if (!isPaintMode) {
      setSelectedColor(null); // Deselect color when exiting paint mode
    }
  };

  return (
    <>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 bg-white p-2 rounded-full shadow-lg">
        <button
          onClick={togglePaintMode}
          className={`w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center transition-colors ${
            isPaintMode
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          aria-label={isPaintMode ? "Disable paint mode" : "Enable paint mode"}
        >
          {isPaintMode ? (
            <EyeOff className="w-3 h-3" />
          ) : (
            <Paintbrush className="w-3 h-3" />
          )}
        </button>

        {isPaintMode && (
          <>
            {colors.map((colorObj) => (
              <button
                key={colorObj.color}
                className="w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 relative"
                style={{ backgroundColor: colorObj.color }}
                onClick={() => setSelectedColor(colorObj.color)}
                aria-label={colorObj.label}
              >
                {selectedColor === colorObj.color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white stroke-2" />
                  </div>
                )}
              </button>
            ))}
            <button
              onClick={clearCanvas}
              className="w-6 h-6 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              aria-label="Clear canvas"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`absolute top-0 left-0 w-full h-full touch-none z-40 ${
          selectedColor && isPaintMode
            ? "cursor-crosshair"
            : "cursor-default pointer-events-none"
        }`}
        style={{
          touchAction: "none",
          pointerEvents: selectedColor && isPaintMode ? "all" : "none",
        }}
      />
      {isPaintMode && !selectedColor && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none z-40 bg-white/80 px-4 py-2 rounded-md">
          Select a color to start painting
        </div>
      )}
    </>
  );
}
