import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { canViewPublicGallery } from "@/lib/galleries/access";
import { streamStoredFile } from "@/lib/images/responses";
import { getSession } from "@/lib/auth/session";

export async function GET(request, { params }) {
  const { imageId } = await params;
  const { searchParams } = new URL(request.url);
  const variant = searchParams.get("variant") || "display";
  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { gallery: true },
  });

  if (!image) {
    notFound();
  }

  const session = await getSession();
  const isOwner = session?.user?.id === image.gallery.ownerId;

  if (!isOwner) {
    const hasPublicAccess = await canViewPublicGallery(image.gallery);
    if (!hasPublicAccess || variant === "original") {
      notFound();
    }
  }

  if (variant === "thumbnail") {
    return streamStoredFile(image.thumbnailKey, {
      filename: image.filename,
      contentType: "image/jpeg",
    });
  }

  if (variant === "original") {
    return streamStoredFile(image.originalKey, {
      filename: image.filename,
      contentType: image.mimeType,
    });
  }

  return streamStoredFile(image.displayKey, {
    filename: image.filename,
    contentType: "image/jpeg",
  });
}
