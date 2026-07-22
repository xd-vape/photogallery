import "server-only";
import { prisma } from "../db/prisma";
import {
  activePublishedGalleryWhere,
  expiredPublishedGalleryWhere,
  nonArchivedGalleryWhere,
} from "../galleries/status";

export async function getDashboardStats(userId, now = new Date()) {
  const ownedNonArchivedWhere = {
    ownerId: userId,
    ...nonArchivedGalleryWhere(),
  };

  const ownedActivePublishedWhere = {
    ownerId: userId,
    ...activePublishedGalleryWhere(now),
  };

  const ownedExpiredPublishedWhere = {
    ownerId: userId,
    ...expiredPublishedGalleryWhere(now),
  };

  const [
    currentGalleries,
    activePublishedGalleries,
    expiredGalleries,
    totalPhotos,
    clientSelections,
    downloadsEnabled,
  ] = await Promise.all([
    prisma.gallery.count({
      where: ownedNonArchivedWhere,
    }),

    prisma.gallery.count({
      where: ownedActivePublishedWhere,
    }),

    prisma.gallery.count({
      where: ownedExpiredPublishedWhere,
    }),

    prisma.image.count({
      where: {
        gallery: ownedNonArchivedWhere,
      },
    }),

    prisma.favoriteSubmission.count({
      where: {
        gallery: ownedNonArchivedWhere,
      },
    }),

    prisma.gallery.count({
      where: {
        ...ownedActivePublishedWhere,
        downloadEnabled: true,
      },
    }),
  ]);

  return {
    currentGalleries,
    activePublishedGalleries,
    expiredGalleries,
    totalPhotos,
    clientSelections,
    downloadsEnabled,
  };
}
