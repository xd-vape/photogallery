"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requirePhotographer } from "@/lib/auth/session";
import { requireOwnedGallery } from "@/lib/galleries/access";
import { hashGalleryPassword } from "@/lib/galleries/passwords";
import { uniqueGallerySlug } from "@/lib/galleries/slug";
import {
  parseGalleryAppearance,
  parseGalleryForm,
  parseOptionalDate,
} from "@/lib/galleries/validation";
import { getStorage } from "@/lib/storage";

function galleryDataFromParsed(parsed, slug, passwordHash) {
  return {
    title: parsed.title,
    slug,
    description: parsed.description || null,
    status: parsed.status,
    passwordHash,
    expiresAt: parseOptionalDate(parsed.expiresAt),
    eventDate: parseOptionalDate(parsed.eventDate),
    downloadEnabled: parsed.downloadEnabled,
  };
}

export async function createGalleryAction(formData) {
  const user = await requirePhotographer();
  const parsed = parseGalleryForm(formData);
  const slug = await uniqueGallerySlug(user.id, parsed.title);
  const passwordHash = await hashGalleryPassword(parsed.password);

  const gallery = await prisma.gallery.create({
    data: {
      ownerId: user.id,
      ...galleryDataFromParsed(parsed, slug, passwordHash),
    },
    select: { id: true },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/galleries/${gallery.id}`);
}

export async function updateGalleryAction(galleryId, formData) {
  const { gallery } = await requireOwnedGallery(galleryId);
  const parsed = parseGalleryForm(formData);
  const slug = await uniqueGallerySlug(
    gallery.ownerId,
    parsed.title,
    gallery.id,
  );
  let passwordHash = gallery.passwordHash;

  if (parsed.clearPassword) {
    passwordHash = null;
  } else if (parsed.password) {
    passwordHash = await hashGalleryPassword(parsed.password);
  }

  await prisma.gallery.update({
    where: { id: gallery.id },
    data: galleryDataFromParsed(parsed, slug, passwordHash),
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/galleries/${gallery.id}`);
  revalidatePath(`/g/${slug}`);
}

export async function updateGalleryAppearanceAction(galleryId, values) {
  const { gallery } = await requireOwnedGallery(galleryId);
  const appearance = parseGalleryAppearance(values);

  await prisma.gallery.update({
    where: { id: gallery.id },
    data: appearance,
  });

  revalidatePath(`/dashboard/galleries/${gallery.id}`);
  revalidatePath(`/preview/galleries/${gallery.id}`);
  revalidatePath(`/g/${gallery.slug}`);

  return appearance;
}

export async function archiveGalleryAction(galleryId) {
  const { gallery } = await requireOwnedGallery(galleryId);

  await prisma.gallery.update({
    where: { id: gallery.id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/galleries/${gallery.id}`);
}

export async function deleteGalleryAction(galleryId) {
  const { gallery } = await requireOwnedGallery(galleryId, {
    images: {
      select: {
        originalKey: true,
        displayKey: true,
        thumbnailKey: true,
      },
    },
  });
  const storage = getStorage();

  await Promise.all(
    gallery.images.flatMap((image) => [
      storage.remove(image.originalKey),
      storage.remove(image.displayKey),
      storage.remove(image.thumbnailKey),
    ]),
  );

  await prisma.gallery.delete({ where: { id: gallery.id } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
