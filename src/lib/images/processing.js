import crypto from "node:crypto";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extensionForMime(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function processUpload(file, galleryId) {
  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = Buffer.from(arrayBuffer);
  const detected = await fileTypeFromBuffer(originalBuffer);
  const mimeType = detected?.mime || file.type;

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }

  const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || 15);
  if (originalBuffer.length > maxUploadMb * 1024 * 1024) {
    throw new Error(`Images must be ${maxUploadMb} MB or smaller.`);
  }

  const metadata = await sharp(originalBuffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  if (!width || !height) {
    throw new Error("Image dimensions could not be read.");
  }

  const displayBuffer = await sharp(originalBuffer)
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84 })
    .toBuffer();

  const thumbnailBuffer = await sharp(originalBuffer)
    .rotate()
    .resize({ width: 700, height: 700, fit: "cover" })
    .jpeg({ quality: 78 })
    .toBuffer();

  const objectId = crypto.randomUUID();
  const extension = extensionForMime(mimeType);
  const safeName = path.basename(file.name || "photo").replace(/[^\w.-]/g, "_");

  return {
    filename: safeName,
    mimeType,
    sizeBytes: originalBuffer.length,
    width,
    height,
    originalKey: `galleries/${galleryId}/${objectId}/original.${extension}`,
    displayKey: `galleries/${galleryId}/${objectId}/display.jpg`,
    thumbnailKey: `galleries/${galleryId}/${objectId}/thumb.jpg`,
    originalBuffer,
    displayBuffer,
    thumbnailBuffer,
  };
}
