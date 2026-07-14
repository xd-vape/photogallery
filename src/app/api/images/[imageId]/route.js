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

export async function PATCH(request, { params }) {
  const { imageId } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  if (body.action !== "set-cover" && body.action !== "move-to-set") {
    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  }

  const image = await prisma.image.findFirst({
    where: { id: imageId, gallery: { ownerId: session.user.id } },
    include: { gallery: true },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  if (body.action === "set-cover") {
    await prisma.gallery.update({
      where: { id: image.galleryId },
      data: { coverImageId: image.id },
    });
  } else {
    const setId = typeof body.setId === "string" && body.setId
      ? body.setId
      : null;

    if (setId) {
      const gallerySet = await prisma.gallerySet.findFirst({
        where: { id: setId, galleryId: image.galleryId },
        select: { id: true },
      });

      if (!gallerySet) {
        return NextResponse.json({ error: "Set not found." }, { status: 400 });
      }
    }

    const lastImage = await prisma.image.findFirst({
      where: { galleryId: image.galleryId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.image.update({
      where: { id: image.id },
      data: {
        setId,
        position: (lastImage?.position ?? -1) + 1,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  revalidatePath(`/dashboard/galleries/${image.galleryId}`);
  revalidatePath(`/preview/galleries/${image.galleryId}`);
  revalidatePath(`/g/${image.gallery.slug}`);

  return NextResponse.json({ ok: true });
}
