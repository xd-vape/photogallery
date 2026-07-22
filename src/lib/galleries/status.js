import "server-only";

function dateTimestamp(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getTime();
}

export function isGalleryExpired(gallery, now = new Date()) {
  if (!gallery || gallery.status !== "PUBLISHED" || !gallery.expiresAt) {
    return false;
  }

  const expiresAt = dateTimestamp(gallery.expiresAt);

  return expiresAt !== null && expiresAt <= now.getTime();
}

export function getGalleryDisplayStatus(gallery, now = new Date()) {
  if (isGalleryExpired(gallery, now)) {
    return "EXPIRED";
  }

  return gallery.status;
}

export function nonArchivedGalleryWhere() {
  return {
    status: {
      not: "ARCHIVED",
    },
  };
}

export function activePublishedGalleryWhere(now = new Date()) {
  return {
    status: "PUBLISHED",
    OR: [
      {
        expiresAt: null,
      },
      {
        expiresAt: {
          gt: now,
        },
      },
    ],
  };
}

export function expiredPublishedGalleryWhere(now = new Date()) {
  return {
    status: "PUBLISHED",
    expiresAt: {
      lte: now,
    },
  };
}
