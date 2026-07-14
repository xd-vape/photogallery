"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Images,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function GallerySetManager({
  galleryId,
  sets,
  totalImages,
  activeSetId,
  onSelect,
}) {
  const router = useRouter();
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  function openEditor(mode, gallerySet = null) {
    setName(gallerySet?.name || "");
    setEditor({ mode, set: gallerySet });
  }

  function saveSet(event) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    startTransition(async () => {
      const isCreate = editor.mode === "create";
      const response = await fetch(
        isCreate
          ? `/api/galleries/${galleryId}/sets`
          : `/api/sets/${editor.set.id}`,
        {
          method: isCreate ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isCreate
              ? { name: trimmedName }
              : { action: "rename", name: trimmedName },
          ),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Set could not be saved.");
        return;
      }

      if (isCreate && data.set?.id) onSelect(data.set.id);
      setEditor(null);
      router.refresh();
      toast.success(isCreate ? "Set created." : "Set renamed.");
    });
  }

  function updateSet(gallerySet, action) {
    startTransition(async () => {
      const response = await fetch(`/api/sets/${gallerySet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Set could not be updated.");
        return;
      }

      router.refresh();
    });
  }

  function deleteSet(gallerySet) {
    if (!window.confirm(`Delete the set "${gallerySet.name}"? The photos will remain.`)) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/sets/${gallerySet.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Set could not be deleted.");
        return;
      }

      if (activeSetId === gallerySet.id) onSelect("ALL");
      router.refresh();
      toast.success("Set deleted. Photos were kept.");
    });
  }

  return (
    <>
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background">
        <div className="flex h-14 items-center justify-between px-5">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Photos
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => openEditor("create")}
          >
            <Plus />
            Add set
          </Button>
        </div>

        <nav aria-label="Gallery sets" className="pb-4">
          <button
            type="button"
            onClick={() => onSelect("ALL")}
            className={cn(
              "flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors",
              activeSetId === "ALL"
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Images className="h-4 w-4" />
            <span className="min-w-0 flex-1 truncate">All photos</span>
            <span className="text-xs tabular-nums">{totalImages}</span>
          </button>

          {sets.map((gallerySet, index) => (
            <div
              key={gallerySet.id}
              className={cn(
                "group flex items-center transition-colors",
                activeSetId === gallerySet.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(gallerySet.id)}
                className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-5 text-left text-sm"
              >
                <GripVertical className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{gallerySet.name}</span>
                <span className="text-xs tabular-nums">
                  {gallerySet._count.images}
                </span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mr-3 opacity-0 group-hover:opacity-100 data-popup-open:opacity-100"
                    />
                  }
                >
                  <MoreHorizontal />
                  <span className="sr-only">Set actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditor("rename", gallerySet)}>
                    <Pencil />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isPending || index === 0}
                    onClick={() => updateSet(gallerySet, "move-up")}
                  >
                    <ArrowUp />
                    Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isPending || index === sets.length - 1}
                    onClick={() => updateSet(gallerySet, "move-down")}
                  >
                    <ArrowDown />
                    Move down
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => deleteSet(gallerySet)}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </nav>
      </aside>

      <Dialog
        open={Boolean(editor)}
        onOpenChange={(open) => {
          if (!open && !isPending) setEditor(null);
        }}
      >
        <DialogContent>
          <form onSubmit={saveSet}>
            <DialogHeader>
              <DialogTitle>
                {editor?.mode === "create" ? "Add set" : "Rename set"}
              </DialogTitle>
              <DialogDescription>
                Use any name that helps clients navigate this gallery.
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              required
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="For example: Ceremony"
              className="mt-4"
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isPending || !name.trim()}>
                {isPending ? "Saving..." : "Save set"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setEditor(null)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
