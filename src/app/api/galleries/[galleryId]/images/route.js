import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireOwnedGallery } from "@/lib/galleries/access";
import { processUpload } from "@/lib/images/processing";
import { getStorage } from "@/lib/storage";

export async function POST(request, { params }) {
  try {
    const { galleryId } = await params;
    const { gallery } = await requireOwnedGallery(galleryId);
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((file) => file && typeof file.arrayBuffer === "function" && file.size > 0);

    if (!files.length) {
      return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
    }

    const storage = getStorage();
    const currentCount = await prisma.image.count({
      where: { galleryId: gallery.id },
    });
    const created = [];

    for (const [index, file] of files.entries()) {
      const processed = await processUpload(file, gallery.id);

      await Promise.all([
        storage.put(processed.originalKey, processed.originalBuffer),
        storage.put(processed.displayKey, processed.displayBuffer),
        storage.put(processed.thumbnailKey, processed.thumbnailBuffer),
      ]);

      const image = await prisma.image.create({
        data: {
          galleryId: gallery.id,
          originalKey: processed.originalKey,
          displayKey: processed.displayKey,
          thumbnailKey: processed.thumbnailKey,
          filename: processed.filename,
          mimeType: processed.mimeType,
          sizeBytes: processed.sizeBytes,
          width: processed.width,
          height: processed.height,
          position: currentCount + index,
        },
      });

      created.push(image);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/galleries");
    revalidatePath(`/dashboard/galleries/${gallery.id}`);
    revalidatePath(`/g/${gallery.slug}`);

    return NextResponse.json({ count: created.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
