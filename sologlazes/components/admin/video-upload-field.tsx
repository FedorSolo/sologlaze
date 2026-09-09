"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Video, X } from "lucide-react";

export function VideoUploadField({
  name,
  label,
  defaultUrl,
}: {
  name: string;
  label: string;
  defaultUrl?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setUrl(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-full max-w-xs">
          <video src={url} controls className="w-full rounded-md border border-border" />
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Quitar video"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 hover:bg-surface"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-24 w-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-strong text-text-secondary hover:bg-surface-muted">
          {uploading ? (
            <span className="text-xs">Subiendo...</span>
          ) : (
            <>
              <Video size={18} />
              <span className="text-xs">Subir video (opcional)</span>
            </>
          )}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-status-error">{error}</p>}
    </div>
  );
}
