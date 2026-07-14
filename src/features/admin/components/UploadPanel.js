"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function UploadPanel({ galleryId }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function upload(event) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const response = await fetch(`/api/galleries/${galleryId}/images`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.error || "Upload failed.");
        return;
      }

      setMessage(`Uploaded ${data.count} image${data.count === 1 ? "" : "s"}.`);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <form onSubmit={upload}>
          <div className="space-y-2">
            <Label htmlFor="files">Upload images</Label>
            <Input
              ref={inputRef}
              id="files"
              name="files"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Uploading..." : "Upload"}
            </Button>
            {message ? (
              <p className="text-sm text-muted-foreground">{message}</p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
