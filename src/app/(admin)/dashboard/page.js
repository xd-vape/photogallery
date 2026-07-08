import Link from "next/link";
import { Images, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requirePhotographer } from "@/lib/auth/session";
import { SignOutButton } from "@/features/auth/components";

export default async function DashboardPage() {
  const user = await requirePhotographer();
  const galleries = await prisma.gallery.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { images: true, submissions: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Galleries</h1>
          <p className="mt-1 text-muted-foreground">
            Signed in as {user.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/galleries/new">
            <Button>
              <Plus className="h-4 w-4" />
              New gallery
            </Button>
          </Link>
          <SignOutButton />
        </div>
      </header>

      {galleries.length ? (
        <div className="mt-8 grid gap-4">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="transition hover:bg-accent/50">
              <Link
                href={`/dashboard/galleries/${gallery.id}`}
                className="block"
              >
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle>{gallery.title}</CardTitle>
                      <CardDescription className="mt-1">
                        /g/{gallery.slug}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {gallery.status.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Images className="h-4 w-4" />
                  {gallery._count.images} images · {gallery._count.submissions}{" "}
                  submissions
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-10">
          <CardContent className="p-10 text-center">
            <h2 className="text-xl font-semibold">No galleries yet</h2>
            <p className="mt-2 text-muted-foreground">
              Create your first client gallery.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
