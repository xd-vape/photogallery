"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminImageGrid({
  galleryId,
  images,
  sets,
  activeSetId,
  coverImageId,
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function move(imageId, direction) {
    startTransition(async () => {
      setMessage("");
      const response = await fetch(
        `/api/galleries/${galleryId}/images/reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageId,
            direction,
            scopeSetId: activeSetId,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Could not reorder image.");
        return;
      }

      router.refresh();
    });
  }

  function remove(imageId) {
    startTransition(async () => {
      setMessage("");
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Could not delete image.");
        return;
      }

      router.refresh();
    });
  }

  function setCover(imageId) {
    startTransition(async () => {
      setMessage("");
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-cover" }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Could not set cover image.");
        return;
      }

      router.refresh();
    });
  }

  function moveToSet(imageId, value) {
    startTransition(async () => {
      setMessage("");
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "move-to-set",
          setId: value === "NONE" ? null : value,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMessage(data.error || "Could not move image.");
        return;
      }

      router.refresh();
    });
  }

  if (!images.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No images in this view yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {message ? (
        <p className="mb-3 text-sm text-destructive">{message}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => {
          const isCover = image.id === coverImageId;

          return (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={`/api/images/${image.id}/asset?variant=thumbnail`}
                  alt={image.filename}
                  width={image.width || 600}
                  height={image.height || 600}
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized
                  loading={index === 0 ? "eager" : "lazy"}
                  className="aspect-square w-full object-cover"
                />
                {isCover ? (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                    <Star className="h-3 w-3 fill-current" />
                    Cover
                  </span>
                ) : null}
              </div>
              <CardContent className="space-y-3 p-3">
                <p className="truncate text-sm font-medium">{image.filename}</p>
                <Select
                  value={image.setId || "NONE"}
                  onValueChange={(value) => moveToSet(image.id, value)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">No set</SelectItem>
                    {sets.map((gallerySet) => (
                      <SelectItem key={gallerySet.id} value={gallerySet.id}>
                        {gallerySet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={isPending || isCover}
                    onClick={() => setCover(image.id)}
                    variant={isCover ? "secondary" : "outline"}
                    size="sm"
                  >
                    <Star />
                    {isCover ? "Cover" : "Set cover"}
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending || index === 0}
                    onClick={() => move(image.id, "up")}
                    variant="outline"
                    size="icon-sm"
                    title="Move up"
                    aria-label="Move up"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending || index === images.length - 1}
                    onClick={() => move(image.id, "down")}
                    variant="outline"
                    size="icon-sm"
                    title="Move down"
                    aria-label="Move down"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={() => remove(image.id)}
                    variant="destructive"
                    size="icon-sm"
                    title="Delete image"
                    aria-label="Delete image"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
