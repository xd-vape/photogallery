import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { canViewPublicGallery } from "@/lib/galleries/access";
import { streamStoredFile } from "@/lib/images/responses";
import { getSession } from "@/lib/auth/session";

export async function GET(_request, { params }) {
  const { imageId } = await params;
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

    if (!hasPublicAccess) {
      notFound();
    }

    if (!image.gallery.downloadEnabled) {
      return NextResponse.json({ error: "Downloads are disabled." }, { status: 403 });
    }
  }

  return streamStoredFile(image.originalKey, {
    filename: image.filename,
    contentType: image.mimeType,
    download: true,
  });
}
