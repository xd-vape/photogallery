import { normalizeGalleryAppearance } from "@/lib/galleries/appearance";

export function toGalleryPresentation(gallery, appearanceOverride = {}) {
  const appearance = normalizeGalleryAppearance({
    ...gallery,
    ...appearanceOverride,
  });

  return {
    id: gallery.id,
    title: gallery.title,
    slug: gallery.slug,
    description: gallery.description,
    eventDate: gallery.eventDate?.toISOString?.() || gallery.eventDate || null,
    coverImageId: gallery.coverImageId,
    downloadEnabled: gallery.downloadEnabled,
    ...appearance,
    images: (gallery.images || []).map((image) => ({
      id: image.id,
      filename: image.filename,
      width: image.width,
      height: image.height,
    })),
  };
}
