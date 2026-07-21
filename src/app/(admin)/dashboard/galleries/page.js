import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import GalleriesClient from "./galleries-client";

export default async function GalleriesPage() {
  const user = await requireUser();

  const galleries = await prisma.gallery.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      coverImage: {
        select: {
          id: true,
          thumbnailKey: true,
          displayKey: true,
        },
      },
      _count: { select: { images: true, sets: true, submissions: true } },
    },
  });

  return <GalleriesClient galleries={galleries} />;
}
