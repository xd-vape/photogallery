"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function AdminImageGrid({ images }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function move(imageId, direction) {
    startTransition(async () => {
      setMessage("");
      const response = await fetch(
        `/api/galleries/${images[0]?.galleryId}/images/reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId, direction }),
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

  if (!images.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No images yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {message ? (
        <p className="mb-3 text-sm text-destructive">{message}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <Card key={image.id} className="overflow-hidden">
            <Image
              src={`/api/images/${image.id}/asset?variant=thumbnail`}
              alt={image.filename}
              width={image.width || 600}
              height={image.height || 600}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              unoptimized
              loading="eager"
              className="aspect-square w-full object-cover"
            />
            <CardContent className="space-y-3 p-3">
              <p className="truncate text-sm font-medium">{image.filename}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  disabled={isPending || index === 0}
                  onClick={() => move(image.id, "up")}
                  variant="outline"
                  size="sm"
                >
                  Up
                </Button>
                <Button
                  type="button"
                  disabled={isPending || index === images.length - 1}
                  onClick={() => move(image.id, "down")}
                  variant="outline"
                  size="sm"
                >
                  Down
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => remove(image.id)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
