import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { canViewPublicGallery, getPublicGallery } from "@/lib/galleries/access";
import { favoriteSubmissionSchema } from "@/lib/galleries/validation";

export async function POST(request, { params }) {
  const { galleryId: slug } = await params;
  const gallery = await getPublicGallery(slug);
  const hasAccess = await canViewPublicGallery(gallery);

  if (!hasAccess) {
    return NextResponse.json({ error: "Gallery access required." }, { status: 403 });
  }

  const parsed = favoriteSubmissionSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your name, email, and favorites." }, { status: 400 });
  }

  const validImages = await prisma.image.findMany({
    where: {
      galleryId: gallery.id,
      id: { in: parsed.data.imageIds },
    },
    select: { id: true },
  });

  if (validImages.length !== parsed.data.imageIds.length) {
    return NextResponse.json({ error: "Invalid image selection." }, { status: 400 });
  }

  const submission = await prisma.favoriteSubmission.create({
    data: {
      galleryId: gallery.id,
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail,
      items: {
        create: validImages.map((image) => ({ imageId: image.id })),
      },
    },
  });

  revalidatePath(`/dashboard/galleries/${gallery.id}`);

  return NextResponse.json({ id: submission.id });
}
