"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ImageUp, Download, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";

/**
 * "See it on your wall" preview. Uses the device's rear camera (getUserMedia)
 * as a live backdrop, or an uploaded wall photo as a fallback, and overlays the
 * framed painting which the user can drag and resize to true scale, then save a
 * snapshot. This is a 2D composite (not depth-tracked AR) so it works in-browser
 * across iOS and Android without an install.
 */
export function WallPreview({
  imageUrl,
  title,
  onClose,
}: {
  imageUrl: string;
  title: string;
  onClose: () => void;
}) {
  const { dict } = useI18n();
  const t = dict.ar;

  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<"idle" | "camera" | "photo">("idle");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const [ratio, setRatio] = useState(1.25); // painting height / width
  const [scale, setScale] = useState(0.4); // fraction of scene width
  const [pos, setPos] = useState({ x: 0.3, y: 0.25 }); // fractions of scene

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((tk) => tk.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setMode("camera");
      setUnsupported(false);
    } catch {
      setUnsupported(true);
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    setPhotoUrl(URL.createObjectURL(file));
    setMode("photo");
  }

  // Drag the painting around the scene.
  const dragging = useRef(false);
  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    setPos({
      x: Math.min(0.9, Math.max(0, (e.clientX - rect.left) / rect.width - scale / 2)),
      y: Math.min(0.9, Math.max(0, (e.clientY - rect.top) / rect.height - (scale * ratio) / 2)),
    });
  }
  function onPointerUp() {
    dragging.current = false;
  }

  function snapshot() {
    const scene = sceneRef.current;
    if (!scene) return;
    const w = scene.clientWidth;
    const h = scene.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background (cover)
    const drawCover = (img: CanvasImageSource, iw: number, ih: number) => {
      const scaleCover = Math.max(w / iw, h / ih);
      const dw = iw * scaleCover;
      const dh = ih * scaleCover;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    if (mode === "camera" && videoRef.current) {
      const v = videoRef.current;
      drawCover(v, v.videoWidth || w, v.videoHeight || h);
      composite(ctx, w, h);
    } else if (mode === "photo" && photoUrl) {
      const bg = new Image();
      bg.crossOrigin = "anonymous";
      bg.onload = () => {
        drawCover(bg, bg.naturalWidth, bg.naturalHeight);
        composite(ctx, w, h);
      };
      bg.src = photoUrl;
    }
  }

  function composite(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const pw = scale * w;
    const ph = pw * ratio;
    const px = pos.x * w;
    const py = pos.y * h;
    const border = Math.max(4, pw * 0.03);
    ctx.fillStyle = "#faf7f0";
    ctx.fillRect(px - border, py - border, pw + border * 2, ph + border * 2);
    const art = new Image();
    art.crossOrigin = "anonymous";
    art.onload = () => {
      ctx.drawImage(art, px, py, pw, ph);
      download(ctx.canvas);
    };
    art.onerror = () => download(ctx.canvas);
    art.src = imageUrl;
  }

  function download(canvas: HTMLCanvasElement) {
    try {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "lotus-wall-preview.png";
      a.click();
    } catch {
      /* cross-origin taint — snapshot unavailable */
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
        <p className="text-sm font-medium">{t.title}</p>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          aria-label={t.close}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scene */}
      <div ref={sceneRef} className="relative flex-1 overflow-hidden bg-neutral-900 touch-none">
        {mode === "camera" && (
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        )}
        {mode === "photo" && photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        )}

        {mode === "idle" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-white/80">
            <Camera size={40} className="opacity-60" />
            <p className="max-w-xs text-sm">{unsupported ? t.unsupported : t.hint}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {!unsupported && (
                <Button onClick={startCamera}>
                  <Camera size={16} /> {t.start}
                </Button>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
                <ImageUp size={16} /> {t.upload}
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
            </div>
          </div>
        )}

        {/* Framed painting overlay */}
        {mode !== "idle" && (
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="absolute cursor-grab touch-none rounded-[2px] border-[6px] border-[#faf7f0] shadow-2xl active:cursor-grabbing"
            style={{
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              width: `${scale * 100}%`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              onLoad={(e) => {
                const el = e.currentTarget;
                if (el.naturalWidth) setRatio(el.naturalHeight / el.naturalWidth);
              }}
              className="pointer-events-none block w-full select-none"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      {mode !== "idle" && (
        <div className="flex flex-col gap-3 bg-black px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-xs">
            <span className="uppercase tracking-wider opacity-70">{t.size}</span>
            <input
              type="range"
              min={15}
              max={80}
              value={Math.round(scale * 100)}
              onChange={(e) => setScale(Number(e.target.value) / 100)}
              className="w-40 accent-primary"
            />
          </label>
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs hover:bg-white/10">
              <ImageUp size={15} /> {t.upload}
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
            <button
              onClick={snapshot}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Download size={15} /> {t.snapshot}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
