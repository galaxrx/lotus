"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ImageUp, Download, Share2, X } from "lucide-react";
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
  const [busy, setBusy] = useState(false);
  const [shotUrl, setShotUrl] = useState<string | null>(null);
  const [shotBlob, setShotBlob] = useState<Blob | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((tk) => tk.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  // Release the captured object URL when the preview unmounts.
  const shotUrlRef = useRef<string | null>(null);
  shotUrlRef.current = shotUrl;
  useEffect(() => () => {
    if (shotUrlRef.current) URL.revokeObjectURL(shotUrlRef.current);
  }, []);

  // Bind the stream once the <video> element is actually mounted. The video only
  // renders in camera mode, so assigning srcObject before setMode would target a
  // null ref and the camera would never appear.
  useEffect(() => {
    if (mode !== "camera") return;
    const v = videoRef.current;
    if (v && streamRef.current && v.srcObject !== streamRef.current) {
      v.srcObject = streamRef.current;
      v.play().catch(() => {});
    }
  }, [mode]);

  async function startCamera() {
    // getUserMedia only exists in a secure context (HTTPS or localhost). Over
    // plain HTTP on a phone, navigator.mediaDevices is undefined — fall back to
    // the photo-upload flow instead of throwing.
    if (!navigator.mediaDevices?.getUserMedia) {
      setUnsupported(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setUnsupported(false);
      setMode("camera");
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

  /** Load an image the canvas is allowed to export (via our same-origin proxy). */
  function loadArt(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const art = new Image();
      art.crossOrigin = "anonymous";
      art.onload = () => resolve(art);
      art.onerror = reject;
      // Museum CDNs don't send CORS headers, which would taint the canvas and
      // make the snapshot un-exportable. Proxy through our own origin instead.
      art.src = imageUrl.startsWith("http")
        ? `/api/art-image?src=${encodeURIComponent(imageUrl)}`
        : imageUrl;
    });
  }

  async function snapshot() {
    const scene = sceneRef.current;
    if (!scene || busy) return;
    setBusy(true);
    try {
      const w = scene.clientWidth;
      const h = scene.clientHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawCover = (img: CanvasImageSource, iw: number, ih: number) => {
        const cover = Math.max(w / iw, h / ih);
        ctx.drawImage(img, (w - iw * cover) / 2, (h - ih * cover) / 2, iw * cover, ih * cover);
      };

      // Background: live camera frame or the uploaded wall photo.
      if (mode === "camera" && videoRef.current) {
        const v = videoRef.current;
        drawCover(v, v.videoWidth || w, v.videoHeight || h);
      } else if (mode === "photo" && photoUrl) {
        const bg = await new Promise<HTMLImageElement | null>((resolve) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => resolve(null);
          im.src = photoUrl; // object URL — same-origin, safe to export
        });
        if (bg) drawCover(bg, bg.naturalWidth, bg.naturalHeight);
      }

      // The framed painting on top.
      const pw = scale * w;
      const ph = pw * ratio;
      const px = pos.x * w;
      const py = pos.y * h;
      const border = Math.max(4, pw * 0.03);
      ctx.fillStyle = "#faf7f0";
      ctx.fillRect(px - border, py - border, pw + border * 2, ph + border * 2);
      const art = await loadArt().catch(() => null);
      if (art) ctx.drawImage(art, px, py, pw, ph);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (blob) {
        setShotBlob(blob);
        setShotUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
      }
    } finally {
      setBusy(false);
    }
  }

  /** Share sheet — the reliable way to get the image into a phone's photo library. */
  async function shareShot() {
    if (!shotBlob) return;
    const file = new File([shotBlob], "niloosa-wall-preview.png", { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: t.title }).catch(() => {});
    } else {
      downloadShot();
    }
  }

  function downloadShot() {
    if (!shotUrl) return;
    const a = document.createElement("a");
    a.href = shotUrl;
    a.download = "niloosa-wall-preview.png";
    a.click();
  }

  function closeShot() {
    setShotUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setShotBlob(null);
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
              disabled={busy}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Camera size={15} /> {busy ? t.capturing : t.snapshot}
            </button>
          </div>
        </div>
      )}

      {/* Captured shot — shown in-app so it can be viewed and saved on a phone */}
      {shotUrl && (
        <div className="absolute inset-0 z-10 flex flex-col bg-black/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
            <p className="text-sm font-medium">{t.captured}</p>
            <button
              onClick={closeShot}
              aria-label={t.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 pb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shotUrl}
              alt={t.captured}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-3 px-5 pb-6 pt-3 text-white">
            <p className="text-center text-xs text-white/70">{t.saveHint}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={shareShot}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
              >
                <Share2 size={16} /> {t.share}
              </button>
              <button
                onClick={downloadShot}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
              >
                <Download size={16} /> {t.download}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
