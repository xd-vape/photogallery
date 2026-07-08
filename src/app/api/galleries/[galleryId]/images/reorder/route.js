import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireOwnedGallery } from "@/lib/galleries/access";

export async function POST(request, { params }) {
  const { galleryId } = await params;
  const { gallery } = await requireOwnedGallery(galleryId);
  const body = await request.json().catch(() => ({}));
  const direction = body.direction === "up" ? "up" : body.direction === "down" ? "down" : null;

  if (!body.imageId || !direction) {
    return NextResponse.json({ error: "Invalid reorder request." }, { status: 400 });
  }

  const images = await prisma.image.findMany({
    where: { galleryId: gallery.id },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });
  const index = images.findIndex((image) => image.id === body.imageId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= images.length) {
    return NextResponse.json({ ok: true });
  }

  const current = images[index];
  const target = images[targetIndex];

  await prisma.$transaction([
    prisma.image.update({
      where: { id: current.id },
      data: { position: target.position },
    }),
    prisma.image.update({
      where: { id: target.id },
      data: { position: current.position },
    }),
  ]);

  revalidatePath(`/dashboard/galleries/${gallery.id}`);
  revalidatePath(`/g/${gallery.slug}`);

  return NextResponse.json({ ok: true });
}
