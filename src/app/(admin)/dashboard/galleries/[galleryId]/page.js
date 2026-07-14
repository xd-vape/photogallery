import { notFound } from "next/navigation";
import { requireOwnedGallery } from "@/lib/galleries/access";
import GalleryIdClient from "./galleryId-client";

export default async function EditGalleryPage({ params }) {
  const { galleryId } = await params;
  const { gallery } = await requireOwnedGallery(galleryId, {
    images: { orderBy: { position: "asc" } },
    submissions: {
      orderBy: { createdAt: "desc" },
      include: { items: { include: { image: true } } },
    },
  });

  if (!gallery) notFound();

  return <GalleryIdClient gallery={gallery} />;
}
