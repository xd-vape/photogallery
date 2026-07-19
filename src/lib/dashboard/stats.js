import { prisma } from "../db/prisma";

export async function getDashboardStats(userId) {
  const [
    totalGalleries,
    publishedGalleries,
    totalPhotos,
    clientSelections,
    downloadsEnabled,
  ] = await Promise.all([
    prisma.gallery.count({
      where: { ownerId: userId },
    }),

    prisma.gallery.count({
      where: { ownerId: userId, status: "PUBLISHED" },
    }),

    prisma.image.count({
      where: { gallery: { ownerId: userId } },
    }),

    // prisma.submission.count({
    //   where: {
    //     gallery: {
    //       ownerId: userId,
    //     },
    //   },
    // }),

    prisma.gallery.count({
      where: {
        ownerId: userId,
        downloadEnabled: true,
      },
    }),
  ]);

  return {
    totalGalleries,
    publishedGalleries,
    totalPhotos,
    clientSelections,
    downloadsEnabled,
  };
}
