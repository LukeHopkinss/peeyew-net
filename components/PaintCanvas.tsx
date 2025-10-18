"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Swatch = { name: string; hex: string };

const PALETTE: Swatch[] = [
  { name: "red", hex: "#a50000" },
  { name: "pink", hex: "#ffc0f0" },
  { name: "darkBlue", hex: "#002a93" },
  { name: "lightBlue", hex: "#83a6ff" },
  { name: "green", hex: "#397520" },
  { name: "yellow", hex: "#f9ec06" },
  { name: "black", hex: "#000000" },
  { name: "white", hex: "#ffffff" },
];

// pad to 10 cells to keep a clean 2×5 grid
const FILLED_SWATCHES: (Swatch | null)[] = [
  ...PALETTE,
  ...Array(Math.max(0, 10 - PALETTE.length)).fill(null),
];

export default function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>("#002a93");
  const [size, setSize] = useState<number>(10);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  // DPR resize handling
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = c.getBoundingClientRect();
      c.width = Math.floor(rect.width * dpr);
      c.height = Math.floor(rect.height * dpr);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getPos = useCallback(
    (c: HTMLCanvasElement, e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = c.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    c.setPointerCapture?.(e.pointerId);
    setIsDrawing(true);

    // prepare stroke
    ctx.lineWidth = size;
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color;
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";

    const { x, y } = getPos(c, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = size;
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : color;
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";

    const { x, y } = getPos(c, e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endStroke = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const c = canvasRef.current;
    if (!c || !e) return;
    c.releasePointerCapture?.(e.pointerId);
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
  };

  const exportPNG = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = "peeyew.png";
    link.href = c.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex gap-4 items-start">
      {/* LEFT TOOLBAR */}
      <aside
        className="flex shrink-0 flex-col items-center gap-3 rounded-2xl bg-white p-3 backdrop-blur shadow-soft"
        style={{ width: 132 }} // 2×48px swatches + 12px gap + 12px padding on each side
      >
        {/* 2×5 grid of BIGGER colors (48×48) — horizontal red bar on selected */}
        <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: "repeat(5, minmax(0, 1fr))" }}>
          {FILLED_SWATCHES.map((p, idx) => {
            if (!p) {
              return <div key={`empty-${idx}`} className="h-12 w-12 rounded border border-transparent" />;
            }
            const isSelected = !isEraser && color.toLowerCase() === p.hex.toLowerCase();
            return (
              <div key={p.name} className="relative h-12 w-12 overflow-hidden">
                <button
                  onClick={() => {
                    setIsEraser(false);
                    setColor(p.hex);
                  }}
                  className="h-full w-full rounded border border-black/10 shadow-soft"
                  style={{ backgroundColor: p.hex }}
                  title={p.name}
                  aria-label={`select ${p.name}`}
                />
                {isSelected && (
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: "-8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "70%",
                      height: "10px",
                      backgroundColor: "#F54927", // keep your current red accent
                      borderRadius: "2px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Same-size tiles UNDER the palette (48×48 each, in the same 2-col grid) */}
        <div className="grid grid-cols-2 gap-3 w-full -mt-7">
          {/* SETTINGS tile (image-capable) */}
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="relative h-12 w-full aspect-square rounded-lg overflow-hidden bg-white"
            aria-expanded={showSettings}
            aria-controls="settings-panel"
            title="settings"
          >
            <img
              src="/cursors-SETTINGS.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </button>

          {/* ERASER tile */}
          <button
            onClick={() => setIsEraser((v) => !v)}
            className={`relative h-12 w-full aspect-square rounded-lg overflow-hidden border ${
              isEraser ? "border-redBrand" : "border-none"
            } bg-white`}
            title="toggle eraser"
            aria-pressed={isEraser}
          >
            <img
              src="/cursors-eraser.png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain p-2"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </button>
        </div>
      </aside>

      {/* CANVAS AREA */}
      <div className="relative flex-1">
        <div className="canvas-shell mx-auto w-full">
          <canvas
            ref={canvasRef}
            className="h-full w-full rounded-2xl touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
          />
        </div>

        {/* SETTINGS PANEL */}
        {showSettings && (
          <div
            id="settings-panel"
            className="absolute right-3 top-3 z-10 rounded-xl bg-white/95 p-4 shadow-soft"
          >
            <div className="mb-2 text-sm font-semibold text-darkBlue">settings</div>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span>current tool</span>
                <span className="tabular-nums">{isEraser ? "eraser" : "brush"}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span>current color</span>
                <span
                  className="inline-block h-5 w-5 rounded border border-black/10 shadow-soft"
                  style={{ backgroundColor: isEraser ? "#ffffff" : color }}
                />
              </div>

              {/* Brush width control (moved here) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span>brush width</span>
                  <span className="tabular-nums">{size}px</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={60}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-56"
                  aria-label="brush width"
                />
                {/* live stroke preview */}
                <div className="mt-1 h-12 flex items-center">
                  <div
                    className="w-56 rounded-full"
                    style={{
                      height: Math.max(2, Math.min(size, 24)),
                      backgroundColor: isEraser ? "#ddd" : color,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.06) inset",
                    }}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-black/10" />

              <div className="flex gap-2">
                <button onClick={clear} className="px-3 py-2 rounded bg-redBrand text-white text-xs">
                  clear
                </button>
                <button onClick={exportPNG} className="px-3 py-2 rounded bg-greenBrand text-white text-xs">
                  export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
