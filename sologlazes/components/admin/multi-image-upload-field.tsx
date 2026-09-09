"use client";

import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Upload, X } from "lucide-react";

export function MultiImageUploadField({
  name,
  label,
  defaultUrls = [],
}: {
  name: string;
  label: string;
  defaultUrls?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploaded.push(blob.url);
      }
      setUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-sm text-text-secondary">{label}</span>
      {/* Se envía como JSON — el server action lo parsea con JSON.parse */}
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={url + i} className="relative h-24 w-24 overflow-hidden rounded-md border border-border">
            <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((_, idx) => idx !== i))}
              aria-label="Quitar imagen"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 hover:bg-surface"
            >
              <X size={14} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded-full bg-surface/90 px-1.5 py-0.5 text-[10px]">
                Principal
              </span>
            )}
          </div>
        ))}

        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-strong text-text-secondary hover:bg-surface-muted">
          {uploading ? (
            <span className="text-xs">Subiendo...</span>
          ) : (
            <>
              <Upload size={16} />
              <span className="text-[11px]">Agregar</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="mt-1 text-xs text-text-secondary">La primera foto es la que se usa en el catálogo.</p>
      {error && <p className="mt-1 text-xs text-status-error">{error}</p>}
    </div>
  );
}
