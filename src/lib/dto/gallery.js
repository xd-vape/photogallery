import "server-only";
import { getGalleryDisplayStatus } from "../galleries/status";

function toIsoString(value) {
  if (!value) return null;

  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function toGallerySetDto(gallerySet) {
  return {
    id: gallerySet.id,
    name: gallerySet.name,
    position: gallerySet.position,
    imageCount: gallerySet._count?.images ?? 0,
  };
}

function toAdminImageDto(image) {
  return {
    id: image.id,
    setId: image.setId,
    filename: image.filename,
    width: image.width,
    height: image.height,
    position: image.position,
  };
}

function toFavoriteSubmissionDto(submission) {
  return {
    id: submission.id,
    clientName: submission.clientName,
    clientEmail: submission.clientEmail,
    createdAt: toIsoString(submission.createdAt),
    items: submission.items.map((item) => ({
      id: item.id,
      image: {
        id: item.image.id,
        filename: item.image.filename,
      },
    })),
  };
}

export function toGalleryListItemDto(gallery, now = new Date()) {
  return {
    id: gallery.id,
    title: gallery.title,
    slug: gallery.slug,
    displayStatus: getGalleryDisplayStatus(gallery, now),
    eventDate: toIsoString(gallery.eventDate),
    hasPassword: Boolean(gallery.passwordHash),
    downloadEnabled: gallery.downloadEnabled,
    coverImageId: gallery.coverImageId,
    counts: {
      images: gallery._count?.images ?? 0,
      sets: gallery._count?.sets ?? 0,
      submissions: gallery._count?.submissions ?? 0,
    },
  };
}

export function toGalleryEditorDto(gallery) {
  return {
    id: gallery.id,
    title: gallery.title,
    slug: gallery.slug,
    description: gallery.description,
    status: gallery.status,
    eventDate: toIsoString(gallery.eventDate),
    expiresAt: toIsoString(gallery.expiresAt),
    updatedAt: toIsoString(gallery.updatedAt),

    hasPassword: Boolean(gallery.passwordHash),
    downloadEnabled: gallery.downloadEnabled,
    coverImageId: gallery.coverImageId,

    coverStyle: gallery.coverStyle,
    fontStyle: gallery.fontStyle,
    colorPalette: gallery.colorPalette,
    gridColumns: gallery.gridColumns,
    gridSpacing: gallery.gridSpacing,

    sets: (gallery.sets || []).map(toGallerySetDto),
    images: (gallery.images || []).map(toAdminImageDto),
    submissions: (gallery.submissions || []).map(toFavoriteSubmissionDto),
  };
}
