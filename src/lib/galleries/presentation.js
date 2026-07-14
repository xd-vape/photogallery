import { normalizeGalleryAppearance } from "@/lib/galleries/appearance";

export function toGalleryPresentation(gallery, appearanceOverride = {}) {
  const appearance = normalizeGalleryAppearance({
    ...gallery,
    ...appearanceOverride,
  });

  const images = (gallery.images || []).map((image) => ({
    id: image.id,
    setId: image.setId,
    filename: image.filename,
    width: image.width,
    height: image.height,
  }));

  return {
    id: gallery.id,
    title: gallery.title,
    slug: gallery.slug,
    description: gallery.description,
    eventDate: gallery.eventDate?.toISOString?.() || gallery.eventDate || null,
    coverImageId: gallery.coverImageId,
    downloadEnabled: gallery.downloadEnabled,
    ...appearance,
    sets: (gallery.sets || []).map((gallerySet) => ({
      id: gallerySet.id,
      name: gallerySet.name,
      position: gallerySet.position,
      imageCount: images.filter((image) => image.setId === gallerySet.id).length,
    })),
    images,
  };
}
