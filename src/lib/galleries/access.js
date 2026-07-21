import crypto from "node:crypto";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";

function secret() {
  return process.env.BETTER_AUTH_SECRET || "development-gallery-access-secret";
}

export function galleryAccessCookieName(slug) {
  return `gallery_access_${slug.replace(/[^a-z0-9-]/g, "")}`;
}

export function createGalleryAccessToken(gallery) {
  const payload = `${gallery.id}:${gallery.passwordHash}`;
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function verifyGalleryAccessToken(gallery, token) {
  if (!gallery.passwordHash || !token) {
    return false;
  }

  const expected = createGalleryAccessToken(gallery);
  const actual = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return (
    actual.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actual, expectedBuffer)
  );
}

export async function getOwnedGallery(galleryId, ownerId, include = {}) {
  const gallery = await prisma.gallery.findFirst({
    where: { id: galleryId, ownerId },
    include,
  });

  if (!gallery) {
    notFound();
  }

  return gallery;
}

export async function requireOwnedGallery(galleryId, include = {}) {
  const user = await requireUser();
  const gallery = await getOwnedGallery(galleryId, user.id, include);
  return { user, gallery };
}

export function isPublishedGalleryAvailable(gallery) {
  if (!gallery || gallery.status !== "PUBLISHED") {
    return false;
  }

  return !gallery.expiresAt || gallery.expiresAt > new Date();
}

export async function getPublicGallery(slug, include = {}) {
  const gallery = await prisma.gallery.findUnique({
    where: {
      slug,
    },
    include,
  });

  if (!isPublishedGalleryAvailable(gallery)) {
    notFound();
  }

  return gallery;
}

export async function hasGalleryPasswordAccess(gallery) {
  if (!gallery.passwordHash) {
    return true;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(galleryAccessCookieName(gallery.slug))?.value;
  return verifyGalleryAccessToken(gallery, token);
}

export async function canViewPublicGallery(gallery) {
  return (
    isPublishedGalleryAvailable(gallery) && hasGalleryPasswordAccess(gallery)
  );
}
