import { cn } from "@/lib/utils";
import React from "react";
import GallerySetNavigation from "./gallery-set-navigation";
import { Heart } from "lucide-react";
import { Download } from "lucide-react";
import { Share2 } from "lucide-react";
import { Play } from "lucide-react";

export default function GalleryToolBar({
  title,
  subtitle,
  categories,
  activeCategory,
  onSetCategory,
  favoriteCount,
  allowDownload,
  onDownloadAll,
  onStartSlideshow,

  sets,
  totalImages,
  activeSetId,
  onSelectSet,
}) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md">
      <div className="mx-auto px-4.5 h-18 flex items-center justify-between gap-6">
        {/* Left */}
        <div className="flex justify-center items-center gap-4">
          <div>
            <p className="text-sm font-sans font-semibold tracking-[0.12em] uppercase text-foreground leading-none">
              {title}
            </p>
            {subtitle && (
              <p className="text-[9px] font-sans tracking-[0.1em] uppercase text-muted-foreground mt-0.5 leading-none">
                {subtitle}
              </p>
            )}
          </div>

          <GallerySetNavigation
            sets={sets}
            totalImages={totalImages}
            activeSetId={activeSetId}
            onSelect={onSelectSet}
            variant="toolbar"
          />
        </div>

        {/* Right: icon actions */}
        <div className="shrink-0 flex items-center gap-3">
          {/* Favorites count + heart */}
          <button
            aria-label="Favourites"
            className="relative flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              className={cn(favoriteCount > 0 && "fill-rose-400 text-rose-400")}
            />
            {favoriteCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[8px] font-sans bg-rose-400 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Download */}
          {allowDownload && (
            <button
              onClick={onDownloadAll}
              aria-label="Download all"
              className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download size={16} strokeWidth={1.5} />
            </button>
          )}

          {/* Share */}
          <button
            //   onClick={handleShare}
            aria-label="Share gallery"
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 size={16} strokeWidth={1.5} />
          </button>

          {/* Slideshow */}
          <button
            onClick={onStartSlideshow}
            aria-label="Start slideshow"
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Play size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: category nav */}
        {/* <GallerySetNavigation
          sets={sets}
          totalImages={totalImages}
          activeSetId={activeSetId}
          onSelect={onSelectSet}
          variant="toolbar"
        /> */}
      </div>
    </div>
  );
}
