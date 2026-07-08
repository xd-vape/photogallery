"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PublicGallery({ gallery }) {
  const [active, setActive] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const favoriteIds = useMemo(() => Array.from(favorites), [favorites]);

  function toggleFavorite(imageId) {
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
    });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.images.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg bg-zinc-100"
          >
            <button
              type="button"
              onClick={() => setActive(image)}
              className="block w-full"
            >
              <Image
                src={`/api/images/${image.id}/asset?variant=display`}
                alt={image.filename}
                width={image.width || 1200}
                height={image.height || 900}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                unoptimized
                className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
              />
            </button>
            <Button
              type="button"
              onClick={() => toggleFavorite(image.id)}
              className="absolute right-3 top-3 rounded-full bg-white/90 text-zinc-950 hover:bg-white"
              size="sm"
              variant="secondary"
            >
              {favorites.has(image.id) ? "Favorited" : "Favorite"}
            </Button>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit favorites</CardTitle>
          <p className="text-sm text-muted-foreground">
            {favoriteIds.length} selected image
            {favoriteIds.length === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitFavorites}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="clientName" required placeholder="Name" />
              <Input
                name="clientEmail"
                type="email"
                required
                placeholder="Email"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || favoriteIds.length === 0}
              className="mt-4"
            >
              Submit selection
            </Button>
            {message ? (
              <p className="mt-3 text-sm text-muted-foreground">{message}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {active ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-4"
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
            />
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            {gallery.downloadEnabled ? (
              <Button
                variant="secondary"
                href={`/api/images/${active.id}/download`}
                onClick={(event) => event.stopPropagation()}
              >
                <a href={`/api/images/${active.id}/download`}>Download</a>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActive(null)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
