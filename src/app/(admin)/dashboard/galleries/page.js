import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import GalleriesClient from "./galleries-client";
import { toGalleryListItemDto } from "@/lib/dto/gallery";

export default async function GalleriesPage() {
  const user = await requireUser();

  const galleries = await prisma.gallery.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      eventDate: true,
      passwordHash: true,
      downloadEnabled: true,
      coverImageId: true,
      _count: {
        select: {
          images: true,
          sets: true,
          submissions: true,
        },
      },
    },
  });

  return <GalleriesClient galleries={galleries.map(toGalleryListItemDto)} />;
}
