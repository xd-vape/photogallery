import { prisma } from "@/lib/db/prisma";

export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export async function uniqueGallerySlug(ownerId, title, currentGalleryId = null) {
  const base = slugify(title) || "gallery";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.gallery.findFirst({
      where: {
        ownerId,
        slug: candidate,
        ...(currentGalleryId ? { id: { not: currentGalleryId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
