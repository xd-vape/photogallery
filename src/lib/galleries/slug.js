import "server-only";

import { prisma } from "@/lib/db/prisma";

const MAX_SLUG_LENGTH = 72;

export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH);
}

function appendSlugSuffix(base, suffix) {
  const suffixText = `-${suffix}`;
  const availableBaseLength = MAX_SLUG_LENGTH - suffixText.length;

  return `${base.slice(0, availableBaseLength)}${suffixText}`;
}

export async function uniqueGallerySlug(title) {
  const base = slugify(title) || "gallery";

  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.gallery.findUnique({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = appendSlugSuffix(base, suffix);
    suffix += 1;
  }
}
