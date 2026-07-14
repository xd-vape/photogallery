"use client";

import { Images } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GallerySetNavigation({
  sets,
  totalImages,
  activeSetId,
  onSelect,
  variant = "toolbar",
}) {
  const items = [
    {
      id: "ALL",
      name: "All photos",
      imageCount: totalImages,
    },
    ...sets,
  ];

  const isSidebar = variant === "sidebar";

  return (
    <nav
      aria-label="Gallery sets"
      className={cn(
        isSidebar
          ? "overflow-x-auto lg:sticky lg:top-6 lg:self-start lg:overflow-visible"
          : "flex-1 flex items-center justify-center gap-0",
      )}
    >
      {isSidebar ? (
        <div className="mb-3 hidden items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-60 lg:flex">
          <Images className="h-4 w-4" />
          Photos
        </div>
      ) : null}

      <div
        className={cn(
          "flex min-w-max",
          isSidebar
            ? "border-b border-current/10 lg:min-w-0 lg:flex-col lg:border-b-0"
            : "items-center justify-center gap-0",
        )}
      >
        {items.map((item) => {
          const active = item.id === activeSetId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "px-3.5 py-1 text-[10px] font-sans tracking-[0.12em] uppercase transition-colors whitespace-nowrap",
                isSidebar
                  ? "px-4 py-3 text-sm"
                  : "px-3.5 py-4 text-[10px] font-medium uppercase tracking-[0.12em]",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70",
              )}
            >
              <span
                className={cn(
                  "truncate",
                  isSidebar ? "max-w-40 lg:max-w-none lg:flex-1" : "max-w-40",
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
