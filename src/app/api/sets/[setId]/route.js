import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { gallerySetNameSchema } from "@/lib/galleries/validation";

async function ownedSet(setId, userId) {
  return prisma.gallerySet.findFirst({
    where: { id: setId, gallery: { ownerId: userId } },
    include: { gallery: true },
  });
}

function revalidateGallery(gallery) {
  revalidatePath(`/dashboard/galleries/${gallery.id}`);
  revalidatePath(`/preview/galleries/${gallery.id}`);
  revalidatePath(`/g/${gallery.slug}`);
}

export async function PATCH(request, { params }) {
  const { setId } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const gallerySet = await ownedSet(setId, session.user.id);
  if (!gallerySet) {
    return NextResponse.json({ error: "Set not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  if (body.action === "rename") {
    const parsed = gallerySetNameSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid set name." }, { status: 400 });
    }

    const duplicate = await prisma.gallerySet.findFirst({
      where: {
        galleryId: gallerySet.galleryId,
        id: { not: gallerySet.id },
        name: { equals: parsed.data.name, mode: "insensitive" },
      },
      select: { id: true },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "A set with this name already exists." },
        { status: 409 },
      );
    }

    await prisma.gallerySet.update({
      where: { id: gallerySet.id },
      data: { name: parsed.data.name },
    });
  } else if (body.action === "move-up" || body.action === "move-down") {
    const sets = await prisma.gallerySet.findMany({
      where: { galleryId: gallerySet.galleryId },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true, position: true },
    });
    const currentIndex = sets.findIndex((item) => item.id === gallerySet.id);
    const targetIndex =
      body.action === "move-up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex >= 0 && targetIndex >= 0 && targetIndex < sets.length) {
      const current = sets[currentIndex];
      const target = sets[targetIndex];
      await prisma.$transaction([
        prisma.gallerySet.update({
          where: { id: current.id },
          data: { position: target.position },
        }),
        prisma.gallerySet.update({
          where: { id: target.id },
          data: { position: current.position },
        }),
      ]);
    }
  } else {
    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  }

  revalidateGallery(gallerySet.gallery);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  const { setId } = await params;
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const gallerySet = await ownedSet(setId, session.user.id);
  if (!gallerySet) {
    return NextResponse.json({ error: "Set not found." }, { status: 404 });
  }

  await prisma.gallerySet.delete({ where: { id: gallerySet.id } });
  revalidateGallery(gallerySet.gallery);

  return NextResponse.json({ ok: true });
}
