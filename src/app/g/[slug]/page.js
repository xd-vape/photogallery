import { notFound } from "next/navigation";
import { PasswordGate, PublicGallery } from "@/features/public-gallery/components";
import { getPublicGallery, hasGalleryPasswordAccess } from "@/lib/galleries/access";

export default async function PublicGalleryPage({ params }) {
  const { slug } = await params;
  const gallery = await getPublicGallery(slug, {
    images: { orderBy: { position: "asc" } },
  });
  const hasAccess = await hasGalleryPasswordAccess(gallery);

  if (!gallery) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">{gallery.title}</h1>
        {gallery.description ? (
          <p className="mt-3 max-w-2xl text-zinc-600">{gallery.description}</p>
        ) : null}
      </header>
      {hasAccess ? (
        gallery.images.length ? (
          <PublicGallery gallery={gallery} />
        ) : (
          <div className="rounded-lg border border-zinc-200 p-10 text-center text-zinc-600">
            This gallery has no images yet.
          </div>
        )
      ) : (
        <PasswordGate slug={gallery.slug} />
      )}
    </main>
  );
}
