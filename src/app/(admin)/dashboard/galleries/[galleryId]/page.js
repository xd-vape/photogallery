import { notFound } from "next/navigation";
import { requireOwnedGallery } from "@/lib/galleries/access";
import GalleryIdClient from "./galleryId-client";
import { toGalleryEditorDto } from "@/lib/dto/gallery";

export default async function EditGalleryPage({ params }) {
  const { galleryId } = await params;

  const { gallery } = await requireOwnedGallery(galleryId, {
    images: {
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        setId: true,
        filename: true,
        width: true,
        height: true,
        position: true,
      },
    },

    sets: {
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        position: true,
        _count: {
          select: {
            images: true,
          },
        },
      },
    },

    submissions: {
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            image: {
              select: {
                id: true,
                filename: true,
              },
            },
          },
        },
      },
    },
  });

  if (!gallery) notFound();

  return <GalleryIdClient gallery={toGalleryEditorDto(gallery)} />;
}
