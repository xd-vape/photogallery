"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Download, Heart, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  GALLERY_PALETTES,
  normalizeGalleryAppearance,
} from "@/lib/galleries/appearance";

const FONT_CLASSES = {
  SERIF: "font-serif",
  SANS: "font-sans",
  MODERN: "font-sans",
  TIMELESS: "font-serif italic",
};

const GRID_CLASSES = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const GAP_CLASSES = {
  TIGHT: "gap-px",
  REGULAR: "gap-2",
  LARGE: "gap-5",
};

function eventDateLabel(value) {
  if (!value) return null;

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function CoverCopy({ gallery, className, titleClassName }) {
  const date = eventDateLabel(gallery.eventDate);

  return (
    <div className={className}>
      {date ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] opacity-80">
          {date}
        </p>
      ) : null}
      <h1 className={cn("text-4xl font-medium sm:text-5xl", titleClassName)}>
        {gallery.title}
      </h1>
      {gallery.description ? (
        <p className="mt-4 max-w-2xl text-sm leading-6 opacity-85 sm:text-base">
          {gallery.description}
        </p>
      ) : null}
    </div>
  );
}

function CoverImage({ gallery, src }) {
  return (
    <Image
      src={src}
      alt={gallery.title}
      fill
      sizes="100vw"
      loading="eager"
      unoptimized={Boolean(gallery.coverImageId)}
      className="object-cover"
    />
  );
}

function GalleryCover({ gallery }) {
  const coverSrc = gallery.coverImageId
    ? `/api/images/${gallery.coverImageId}/asset?variant=display`
    : "/images/cover.jpg";

  if (gallery.coverStyle === "SPLIT") {
    return (
      <header className="grid min-h-[68vh] md:grid-cols-2">
        <div className="relative min-h-80">
          <CoverImage gallery={gallery} src={coverSrc} />
        </div>
        <div
          className="flex items-center px-8 py-14 sm:px-12"
          style={{ backgroundColor: "var(--gallery-surface)" }}
        >
          <CoverCopy gallery={gallery} titleClassName="sm:text-6xl" />
        </div>
      </header>
    );
  }

  const isMinimal = gallery.coverStyle === "MINIMAL";
  const isBold = gallery.coverStyle === "BOLD";
  const isDark = gallery.coverStyle === "DARK";

  return (
    <header className="relative min-h-[68vh] overflow-hidden">
      <CoverImage gallery={gallery} src={coverSrc} />
      <div
        className={cn(
          "absolute inset-0",
          isMinimal && "bg-black/15",
          gallery.coverStyle === "CLASSIC" && "bg-black/30",
          isBold && "bg-black/35",
          isDark && "bg-black/60",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 flex px-7 py-10 text-white sm:px-12 sm:py-14",
          isMinimal && "items-end justify-start",
          gallery.coverStyle === "CLASSIC" && "items-end justify-center text-center",
          isBold && "items-center justify-center text-center",
          isDark && "items-center justify-center text-center",
        )}
      >
        <CoverCopy
          gallery={gallery}
          className={cn(isMinimal ? "max-w-xl" : "flex flex-col items-center")}
          titleClassName={cn(
            isMinimal && "text-3xl sm:text-4xl",
            isBold && "text-5xl font-bold uppercase sm:text-7xl",
            isDark && "uppercase sm:text-6xl",
          )}
        />
      </div>
    </header>
  );
}

export function PublicGallery({ gallery, preview = false }) {
  const appearance = normalizeGalleryAppearance(gallery);
  const palette = GALLERY_PALETTES[appearance.colorPalette];
  const [active, setActive] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const favoriteIds = useMemo(() => Array.from(favorites), [favorites]);
  const themedGallery = { ...gallery, ...appearance };

  function toggleFavorite(imageId) {
    if (preview) return;

    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(imageId)) next.delete(imageId);
      else next.add(imageId);
      return next;
    });
  }

  function submitFavorites(event) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch(`/api/galleries/${gallery.slug}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.get("clientName"),
          clientEmail: formData.get("clientEmail"),
          imageIds: favoriteIds,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.error || "Could not submit favorites.");
        return;
      }

      setMessage("Favorites submitted.");
      setFavorites(new Set());
      event.target.reset();
    });
  }

  return (
    <div
      className={cn("min-h-screen", FONT_CLASSES[appearance.fontStyle])}
      style={{
        "--gallery-background": palette.background,
        "--gallery-surface": palette.surface,
        "--gallery-foreground": palette.foreground,
        "--gallery-muted": palette.muted,
        "--gallery-accent": palette.accent,
        "--gallery-accent-foreground": palette.accentForeground,
        backgroundColor: "var(--gallery-background)",
        color: "var(--gallery-foreground)",
      }}
    >
      <GalleryCover gallery={themedGallery} />

      <main className="mx-auto w-full max-w-[1600px] px-3 py-12 sm:px-6 sm:py-16">
        {gallery.images.length ? (
          <div
            className={cn(
              "grid",
              GRID_CLASSES[appearance.gridColumns],
              GAP_CLASSES[appearance.gridSpacing],
            )}
          >
            {gallery.images.map((image, index) => {
              const isFavorite = favorites.has(image.id);

              return (
                <div
                  key={image.id}
                  className="group relative overflow-hidden bg-[var(--gallery-surface)]"
                >
                  <button
                    type="button"
                    onClick={() => setActive(image)}
                    className="block w-full"
                    aria-label={`Open ${image.filename}`}
                  >
                    <Image
                      src={`/api/images/${image.id}/asset?variant=display`}
                      alt={image.filename}
                      width={image.width || 1200}
                      height={image.height || 900}
                      sizes={
                        appearance.gridColumns === 4
                          ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      }
                      unoptimized
                      loading={index < appearance.gridColumns ? "eager" : "lazy"}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                  </button>
                  {!preview ? (
                    <button
                      type="button"
                      onClick={() => toggleFavorite(image.id)}
                      title={isFavorite ? "Remove favorite" : "Add favorite"}
                      aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-105"
                      style={{
                        backgroundColor: isFavorite
                          ? "var(--gallery-accent)"
                          : "color-mix(in srgb, white 90%, transparent)",
                        color: isFavorite
                          ? "var(--gallery-accent-foreground)"
                          : "#1a1714",
                      }}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-lg px-6 py-16 text-center"
            style={{ backgroundColor: "var(--gallery-surface)" }}
          >
            This gallery has no images yet.
          </div>
        )}

        {!preview && gallery.images.length ? (
          <section
            className="mx-auto mt-14 max-w-2xl rounded-lg p-6 sm:p-8"
            style={{ backgroundColor: "var(--gallery-surface)" }}
          >
            <h2 className="text-xl font-medium">Submit favorites</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--gallery-muted)" }}>
              {favoriteIds.length} selected image{favoriteIds.length === 1 ? "" : "s"}
            </p>
            <form onSubmit={submitFavorites} className="mt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="clientName" required placeholder="Name" />
                <Input name="clientEmail" type="email" required placeholder="Email" />
              </div>
              <Button
                type="submit"
                disabled={isPending || favoriteIds.length === 0}
                className="mt-4"
                style={{
                  backgroundColor: "var(--gallery-accent)",
                  color: "var(--gallery-accent-foreground)",
                }}
              >
                {isPending ? "Submitting..." : "Submit selection"}
              </Button>
              {message ? (
                <p className="mt-3 text-sm" style={{ color: "var(--gallery-muted)" }}>
                  {message}
                </p>
              ) : null}
            </form>
          </section>
        ) : null}
      </main>

      {active ? (
        <div
          className="fixed inset-0 z-50 bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.filename}
          onClick={() => setActive(null)}
        >
          <div className="flex h-full items-center justify-center">
            <Image
              src={`/api/images/${active.id}/asset?variant=display`}
              alt={active.filename}
              width={active.width || 1600}
              height={active.height || 1200}
              sizes="100vw"
              unoptimized
              className="max-h-full max-w-full object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            {!preview && gallery.downloadEnabled ? (
              <a
                href={`/api/images/${active.id}/download`}
                onClick={(event) => event.stopPropagation()}
                className={buttonVariants({ variant: "secondary" })}
              >
                <Download />
                Download
              </a>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              title="Close"
              aria-label="Close"
              onClick={() => setActive(null)}
            >
              <X />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
