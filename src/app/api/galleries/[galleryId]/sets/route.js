import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireOwnedGallery } from "@/lib/galleries/access";
import { gallerySetNameSchema } from "@/lib/galleries/validation";

export async function POST(request, { params }) {
  const { galleryId } = await params;
  const { gallery } = await requireOwnedGallery(galleryId);
  const parsed = gallerySetNameSchema.safeParse(
    await request.json().catch(() => ({})),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a set name with up to 80 characters." },
      { status: 400 },
    );
  }

  const existing = await prisma.gallerySet.findFirst({
    where: {
      galleryId: gallery.id,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "A set with this name already exists." },
      { status: 409 },
    );
  }

  const lastSet = await prisma.gallerySet.findFirst({
    where: { galleryId: gallery.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const gallerySet = await prisma.gallerySet.create({
    data: {
      galleryId: gallery.id,
      name: parsed.data.name,
      position: (lastSet?.position ?? -1) + 1,
    },
    select: { id: true, name: true, position: true },
  });

  revalidatePath(`/dashboard/galleries/${gallery.id}`);
  revalidatePath(`/preview/galleries/${gallery.id}`);
  revalidatePath(`/g/${gallery.slug}`);

  return NextResponse.json({
    set: { ...gallerySet, _count: { images: 0 } },
  });
}
