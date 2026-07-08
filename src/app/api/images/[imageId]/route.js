import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { getStorage } from "@/lib/storage";

export async function DELETE(_request, { params }) {
  const { imageId } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const image = await prisma.image.findFirst({
    where: { id: imageId, gallery: { ownerId: session.user.id } },
    include: { gallery: true },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  const storage = getStorage();
  await Promise.all([
    storage.remove(image.originalKey),
    storage.remove(image.displayKey),
    storage.remove(image.thumbnailKey),
  ]);

  await prisma.image.delete({ where: { id: image.id } });

  revalidatePath(`/dashboard/galleries/${image.galleryId}`);
  revalidatePath(`/g/${image.gallery.slug}`);

  return NextResponse.json({ ok: true });
}
