import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ExternalLink, Trash2 } from "lucide-react";
import {
  AdminImageGrid,
  GalleryForm,
  UploadPanel,
} from "@/features/admin/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  archiveGalleryAction,
  deleteGalleryAction,
  updateGalleryAction,
} from "@/features/admin/server";
import { requireOwnedGallery } from "@/lib/galleries/access";

export default async function EditGalleryPage({ params }) {
  const { galleryId } = await params;
  const { gallery } = await requireOwnedGallery(galleryId, {
    images: { orderBy: { position: "asc" } },
    submissions: {
      orderBy: { createdAt: "desc" },
      include: { items: { include: { image: true } } },
    },
  });

  if (!gallery) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <Button variant="link" className="px-0">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {gallery.title}
          </h1>
          <Button variant="link" className="mt-1 px-0 text-muted-foreground">
            <a href={`/g/${gallery.slug}`} target="_blank">
              Public link: /g/{gallery.slug}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <form action={archiveGalleryAction.bind(null, gallery.id)}>
          <Button variant="outline">
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        </form>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Control visibility, access, expiry, and downloads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryForm
                gallery={gallery}
                action={updateGalleryAction.bind(null, gallery.id)}
                submitLabel="Save changes"
              />
            </CardContent>
          </Card>
          <form action={deleteGalleryAction.bind(null, gallery.id)}>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4" />
              Delete gallery
            </Button>
          </form>
        </section>

        <section className="space-y-8">
          <UploadPanel galleryId={gallery.id} />
          <div>
            <h2 className="mb-4 text-lg font-semibold">Images</h2>
            <AdminImageGrid images={gallery.images} />
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Client favorites</h2>
            {gallery.submissions.length ? (
              <div className="space-y-3">
                {gallery.submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap justify-between gap-3">
                        <div>
                          <p className="font-medium">{submission.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.clientEmail}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.items.length} image
                          {submission.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {submission.items.map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full bg-secondary px-2 py-1"
                          >
                            {item.image.filename}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-muted-foreground">
                  No favorites submitted yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
