import { PublicGallery } from "@/features/public-gallery/components";
import { normalizeGalleryAppearance } from "@/lib/galleries/appearance";
import { requireOwnedGallery } from "@/lib/galleries/access";
import { toGalleryPresentation } from "@/lib/galleries/presentation";

export const metadata = {
  title: "Gallery preview",
};

export default async function GalleryPreviewPage({ params, searchParams }) {
  const { galleryId } = await params;
  const query = await searchParams;
  const { gallery } = await requireOwnedGallery(galleryId, {
    images: { orderBy: { position: "asc" } },
    sets: { orderBy: [{ position: "asc" }, { createdAt: "asc" }] },
  });
  const appearance = normalizeGalleryAppearance({
    coverStyle: query.coverStyle || gallery.coverStyle,
    fontStyle: query.fontStyle || gallery.fontStyle,
    colorPalette: query.colorPalette || gallery.colorPalette,
    gridColumns: query.gridColumns || gallery.gridColumns,
    gridSpacing: query.gridSpacing || gallery.gridSpacing,
  });

  return (
    <PublicGallery
      gallery={toGalleryPresentation(gallery, appearance)}
      preview
    />
  );
}
