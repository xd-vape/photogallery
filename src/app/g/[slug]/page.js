import { notFound } from "next/navigation";
import { PasswordGate, PublicGallery } from "@/features/public-gallery/components";
import { getPublicGallery, hasGalleryPasswordAccess } from "@/lib/galleries/access";
import { toGalleryPresentation } from "@/lib/galleries/presentation";

export default async function PublicGalleryPage({ params }) {
  const { slug } = await params;
  const gallery = await getPublicGallery(slug, {
    images: { orderBy: { position: "asc" } },
    sets: { orderBy: [{ position: "asc" }, { createdAt: "asc" }] },
  });
  const hasAccess = await hasGalleryPasswordAccess(gallery);

  if (!gallery) notFound();

  if (!hasAccess) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
        <PasswordGate slug={gallery.slug} />
      </main>
    );
  }

  return <PublicGallery gallery={toGalleryPresentation(gallery)} />;
}
