"use client";
import StatusBadge from "@/components/dashboard/status-badge";
import DashboardTopBar from "@/components/dashboard/topbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Download,
  ExternalLink,
  Images,
  Lock,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEFAULT_GALLERY_COVER = "/images/cover.jpg";

function getGalleryCoverUrl(gallery) {
  if (!gallery.coverImage?.id) {
    return DEFAULT_GALLERY_COVER;
  }

  return `/api/images/${gallery.coverImage.id}/asset?variant=thumbnail`;
}

export default function GalleriesClient({ galleries }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? galleries : galleries.filter((g) => g.status === filter);

  const tabs = [
    { label: "All", value: "all", count: galleries.length },
    {
      label: "Published",
      value: "PUBLISHED",
      count: galleries.filter((g) => g.status === "PUBLISHED").length,
    },
    {
      label: "Draft",
      value: "DRAFT",
      count: galleries.filter((g) => g.status === "DRAFT").length,
    },
    {
      label: "Archived",
      value: "ARCHIVED",
      count: galleries.filter((g) => g.status === "ARCHIVED").length,
    },
    {
      label: "Expired",
      value: "EXPIRED",
      count: galleries.filter((g) => g.status === "EXPIRED").length,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardTopBar
        title="Galleries"
        subtitle="Manage your photo galleries"
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

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6 flex items-center gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                filter === tab.value
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                    filter === tab.value
                      ? "bg-foreground/10 text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Gallery List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Images className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No galleries found
            </p>
            <p className="text-xs text-muted-foreground">
              Try a different filter or create a new gallery.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((gallery, index) => (
              <div
                key={gallery.id}
                role="link"
                tabIndex={0}
                onClick={() =>
                  router.push(`/dashboard/galleries/${gallery.id}`)
                }
                className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 hover:border-border/80 hover:bg-muted/20 transition-colors cursor-pointer"
              >
                {/* Cover */}
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={getGalleryCoverUrl(gallery)}
                    alt={gallery.title}
                    fill
                    sizes="64px"
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Title + slug */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {gallery.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate">
                      /{gallery.slug}
                    </span>
                    {gallery.passwordHash && (
                      <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                    {gallery.downloadEnabled && (
                      <Download className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={gallery.status} />
                </div>

                <div className="w-24 shrink-0 text-right">
                  <span className="text-sm text-foreground">
                    {gallery._count.images}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    photos / {gallery._count.sets} sets
                  </p>
                </div>

                {/* Date */}
                <div className="w-24 shrink-0 text-right">
                  <span className="text-xs text-muted-foreground">
                    {/* {gallery.createdAt.toLocaleDateString("de-DE")} */}
                    {gallery.eventDate
                      ? new Date(gallery.eventDate).toLocaleDateString("de-DE")
                      : "Kein Datum"}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    Event Date
                  </p>
                </div>

                {/* Actions */}
                <div
                  className="relative flex shrink-0 items-center gap-1 group-hover:opacity-100 transition-opacity"
                  onClick={(event) => event.stopPropagation()}
                >
                  {/* <Link
                    href={`/dashboard/galleries/${gallery.id}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link> */}

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      onClick={(event) => event.stopPropagation()}
                      className="flex items-center rounded-md px-2 py-2 transition-colors hover:bg-foreground/5"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="bottom"
                      align="start"
                      className="w-44 mb-1"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/g/${gallery.slug}`);
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                          View live
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            // duplicateGallery(gallery.id)
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            // deleteGallery(gallery.id)
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
