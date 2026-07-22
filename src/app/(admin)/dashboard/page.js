import Link from "next/link";
import { Images, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { SignOutButton } from "@/features/auth/components";
import DashboardTopBar from "@/components/dashboard/topbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatsCard from "@/components/dashboard/statscard";
import { getDashboardStats } from "@/lib/dashboard/stats";
import Image from "next/image";
import StatusBadge from "@/components/dashboard/status-badge";
import {
  getGalleryDisplayStatus,
  nonArchivedGalleryWhere,
} from "@/lib/galleries/status";

const DEFAULT_GALLERY_COVER = "/images/cover.jpg";

function getGalleryCoverUrl(gallery) {
  if (!gallery.coverImageId) {
    return DEFAULT_GALLERY_COVER;
  }

  return `/api/images/${gallery.coverImageId}/asset?variant=thumbnail`;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();

  const [stats, recentGalleries] = await Promise.all([
    getDashboardStats(user.id, now),

    prisma.gallery.findMany({
      where: {
        ownerId: user.id,
        ...nonArchivedGalleryWhere(),
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        expiresAt: true,
        createdAt: true,
        coverImageId: true,
        _count: {
          select: {
            images: true,
            sets: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardTopBar
        title="Dashboard"
        subtitle={"Welcome back, " + user.name + "!"}
        actions={
          <Link
            href="/dashboard/galleries/new"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-primary/80 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Gallery
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        <StatsCard stats={stats} />

        <div>
          <div className="lg:col-span-2 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Recent Galleries
              </h2>
              <Link
                href="/dashboard/galleries"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all
              </Link>
            </div>
            {/*  */}
            <div className="divide-y divide-border">
              {recentGalleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  href={`/dashboard/galleries/${gallery.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-muted/40 transition-colors group"
                >
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={getGalleryCoverUrl(gallery)}
                      alt={gallery.title}
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {gallery.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {gallery._count.images} photos &middot;{" "}
                      {gallery._count.sets} sets &middot;{" "}
                      {gallery.createdAt.toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <StatusBadge status={getGalleryDisplayStatus(gallery, now)} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* {galleries.length ? (
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
                    {gallery._count.images} images ·{" "}
                    {gallery._count.submissions} submissions
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
        )} */}
      </main>
    </div>
  );
}
