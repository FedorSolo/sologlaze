"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

export function ImageUploadField({
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
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir la imagen");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      {/* El valor real que viaja con el <form> — el input de archivo solo sube y llena esto */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-md border border-border">
          <Image src={url} alt="Vista previa" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Quitar imagen"
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 hover:bg-surface"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-strong text-text-secondary hover:bg-surface-muted">
          {uploading ? (
            <span className="text-xs">Subiendo...</span>
          ) : (
            <>
              <Upload size={18} />
              <span className="text-xs">Subir foto</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
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
