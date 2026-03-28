"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 my-6">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightbox(i)}
            className="relative overflow-hidden rounded-xl border border-[oklch(1_0_0/8%)] hover:border-emerald-500/30 transition-colors cursor-zoom-in"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                <p className="text-xs text-white/80">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <Image
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            width={1400}
            height={900}
            className="max-h-[85vh] w-auto rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {images[lightbox].caption && (
            <p className="absolute bottom-6 text-sm text-white/70 text-center">
              {images[lightbox].caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
