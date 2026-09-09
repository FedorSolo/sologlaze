"use client";

import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Upload, Copy, Check } from "lucide-react";

export default function AdminMediaPage() {
  const [url, setUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setUrl(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setUrl(blob.url);
      setIsVideo(file.type.startsWith("video/"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-2 text-h1">Subir imagen</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Para fotos que no pertenecen a un producto (banner de inicio, colecciones, etc.). Subís el archivo,
        copiás el link, y lo enviás para que se actualice en el código de esa sección.
      </p>

      <label className="mb-4 flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong text-text-secondary hover:bg-surface-muted">
        {uploading ? (
          <span className="text-sm">Subiendo...</span>
        ) : (
          <>
            <Upload size={22} />
            <span className="text-sm">Elegir archivo</span>
          </>
        )}
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {error && <p className="text-sm text-status-error">{error}</p>}

      {url && (
        <div className="rounded-md border border-border p-4">
          <div className="relative mb-3 h-40 w-full overflow-hidden rounded-sm">
            {isVideo ? (
              <video src={url} controls className="h-full w-full object-cover" />
            ) : (
              <Image src={url} alt="Vista previa" fill className="object-cover" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input readOnly value={url} className="h-10 flex-1 rounded-sm border border-border px-3 text-xs" />
            <button
              type="button"
              onClick={copyUrl}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong hover:bg-surface-muted"
              aria-label="Copiar link"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
