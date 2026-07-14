import { z } from "zod";

export const gallerySchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  password: z.string().max(120).optional().or(z.literal("")),
  clearPassword: z.boolean().default(false),
  eventDate: z.string().optional().or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
  downloadEnabled: z.boolean().default(false),
});

export const galleryAppearanceSchema = z.object({
  coverStyle: z.enum(["CLASSIC", "MINIMAL", "BOLD", "SPLIT", "DARK"]),
  fontStyle: z.enum(["SERIF", "SANS", "MODERN", "TIMELESS"]),
  colorPalette: z.enum(["LIGHT", "GOLD", "ROSE", "SAND", "OLIVE", "DARK"]),
  gridColumns: z.number().int().min(2).max(4),
  gridSpacing: z.enum(["TIGHT", "REGULAR", "LARGE"]),
});

export const favoriteSubmissionSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientEmail: z.email().max(200),
  imageIds: z.array(z.string().min(1)).min(1).max(500),
});

export function parseGalleryForm(formData) {
  return gallerySchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || "",
    status: formData.get("status") || "DRAFT",
    password: formData.get("password") || "",
    clearPassword: formData.get("clearPassword") === "on",
    expiresAt: formData.get("expiresAt") || "",
    eventDate: formData.get("eventDate") || "",
    downloadEnabled: formData.get("downloadEnabled") === "on",
  });
}

export function parseGalleryAppearance(value) {
  return galleryAppearanceSchema.parse({
    coverStyle: value?.coverStyle,
    fontStyle: value?.fontStyle,
    colorPalette: value?.colorPalette,
    gridColumns: Number(value?.gridColumns),
    gridSpacing: value?.gridSpacing,
  });
}

export function parseOptionalDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}
