"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ExternalLink, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardTopBar from "@/components/dashboard/topbar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  COLOR_PALETTE_OPTIONS,
  COVER_STYLE_OPTIONS,
  FONT_STYLE_OPTIONS,
  GRID_COLUMN_OPTIONS,
  GRID_SPACING_OPTIONS,
  normalizeGalleryAppearance,
} from "@/lib/galleries/appearance";
import {
  AdminImageGrid,
  GalleryForm,
  UploadPanel,
} from "@/features/admin/components";
import {
  archiveGalleryAction,
  deleteGalleryAction,
  updateGalleryAction,
  updateGalleryAppearanceAction,
} from "@/features/admin/server";

const TABS = [
  { id: "settings", label: "Settings" },
  { id: "appearance", label: "Appearance" },
  { id: "photos", label: "Photos" },
  { id: "selections", label: "Client selections" },
];

function SelectorCard({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-w-0 flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors",
        active
          ? "border-foreground bg-muted text-foreground"
          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
      )}
    >
      {active ? (
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-foreground" />
      ) : null}
      {children}
    </button>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
      {children}
    </h3>
  );
}

function appearanceEquals(left, right) {
  return (
    left.coverStyle === right.coverStyle &&
    left.fontStyle === right.fontStyle &&
    left.colorPalette === right.colorPalette &&
    left.gridColumns === right.gridColumns &&
    left.gridSpacing === right.gridSpacing
  );
}

export default function GalleryIdClient({ gallery }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [savedAppearance, setSavedAppearance] = useState(() =>
    normalizeGalleryAppearance(gallery),
  );
  const [appearance, setAppearance] = useState(savedAppearance);
  const [isSavingAppearance, startSavingAppearance] = useTransition();

  const settingsAction = updateGalleryAction.bind(null, gallery.id);
  const archiveAction = archiveGalleryAction.bind(null, gallery.id);
  const deleteAction = deleteGalleryAction.bind(null, gallery.id);
  const isAppearanceDirty = !appearanceEquals(appearance, savedAppearance);
  const coverImageSrc = gallery.coverImageId
    ? `/api/images/${gallery.coverImageId}/asset?variant=thumbnail`
    : "/images/cover.jpg";

  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      coverStyle: appearance.coverStyle,
      fontStyle: appearance.fontStyle,
      colorPalette: appearance.colorPalette,
      gridColumns: String(appearance.gridColumns),
      gridSpacing: appearance.gridSpacing,
    });

    return `/preview/galleries/${gallery.id}?${params.toString()}`;
  }, [appearance, gallery.id]);

  function setAppearanceKey(key, value) {
    setAppearance((current) => ({ ...current, [key]: value }));
  }

  function saveAppearance() {
    startSavingAppearance(async () => {
      try {
        const saved = await updateGalleryAppearanceAction(gallery.id, appearance);
        setSavedAppearance(saved);
        router.refresh();
        toast.success("Gallery appearance saved.");
      } catch {
        toast.error("Gallery appearance could not be saved.");
      }
    });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardTopBar
        title={gallery.title}
        subtitle={`/${gallery.slug}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={previewUrl}
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ExternalLink />
              Preview
            </Link>
            {activeTab === "appearance" ? (
              <Button
                type="button"
                size="sm"
                disabled={isSavingAppearance || !isAppearanceDirty}
                onClick={saveAppearance}
              >
                <Save />
                {isSavingAppearance ? "Saving..." : "Save appearance"}
              </Button>
            ) : null}
            {activeTab === "settings" ? (
              <Button type="submit" form="gallery-settings-form" size="sm">
                <Save />
                Save settings
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="flex shrink-0 items-center border-b border-border px-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "settings" ? (
        <main className="flex-1 overflow-y-auto px-8 py-7">
          <div className="mx-auto max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery settings</CardTitle>
                <CardDescription>
                  Update publication, access and download settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GalleryForm
                  gallery={gallery}
                  action={settingsAction}
                  submitLabel="Save settings"
                  formId="gallery-settings-form"
                />
              </CardContent>
            </Card>

            <Card className="ring-destructive/30">
              <CardHeader>
                <CardTitle>Danger zone</CardTitle>
                <CardDescription>
                  Archive the gallery or permanently remove it and its images.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <form action={archiveAction}>
                  <Button type="submit" variant="outline">
                    <Archive />
                    Archive gallery
                  </Button>
                </form>
                <form
                  action={deleteAction}
                  onSubmit={(event) => {
                    if (!window.confirm("Delete this gallery permanently?")) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Button type="submit" variant="destructive">
                    <Trash2 />
                    Delete gallery
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      ) : null}

      {activeTab === "appearance" ? (
        <div className="flex min-h-0 flex-1">
          <aside className="w-80 shrink-0 space-y-9 overflow-y-auto border-r border-border px-6 py-7">
            <section>
              <SectionHeading>Cover style</SectionHeading>
              <div className="grid grid-cols-2 gap-2">
                {COVER_STYLE_OPTIONS.map((style) => (
                  <SelectorCard
                    key={style.id}
                    active={appearance.coverStyle === style.id}
                    onClick={() => setAppearanceKey("coverStyle", style.id)}
                  >
                    <div className="relative h-12 w-full overflow-hidden rounded-md bg-muted">
                      <Image
                        src={coverImageSrc}
                        alt=""
                        fill
                        sizes="120px"
                        unoptimized={Boolean(gallery.coverImageId)}
                        className="object-cover opacity-70"
                      />
                      <span className="absolute inset-x-1 bottom-1 text-center text-[7px] font-semibold text-white">
                        {style.label.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium">{style.label}</span>
                  </SelectorCard>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>Typography</SectionHeading>
              <div className="grid grid-cols-2 gap-2">
                {FONT_STYLE_OPTIONS.map((font) => (
                  <SelectorCard
                    key={font.id}
                    active={appearance.fontStyle === font.id}
                    onClick={() => setAppearanceKey("fontStyle", font.id)}
                  >
                    <span className={cn("text-2xl leading-none", font.className)}>
                      {font.preview}
                    </span>
                    <span className="text-[11px] font-medium">{font.label}</span>
                  </SelectorCard>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>Color</SectionHeading>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PALETTE_OPTIONS.map((palette) => (
                  <SelectorCard
                    key={palette.id}
                    active={appearance.colorPalette === palette.id}
                    onClick={() => setAppearanceKey("colorPalette", palette.id)}
                  >
                    <div className="flex items-center gap-1">
                      {palette.swatches.map((color) => (
                        <span
                          key={color}
                          className="h-4 w-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium">{palette.label}</span>
                  </SelectorCard>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>Grid</SectionHeading>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[11px] text-muted-foreground">Columns</p>
                  <div className="grid grid-cols-3 gap-2">
                    {GRID_COLUMN_OPTIONS.map((option) => (
                      <SelectorCard
                        key={option.id}
                        active={appearance.gridColumns === option.id}
                        onClick={() => setAppearanceKey("gridColumns", option.id)}
                      >
                        <span className="text-sm font-semibold">{option.id}</span>
                      </SelectorCard>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] text-muted-foreground">Spacing</p>
                  <div className="grid grid-cols-3 gap-2">
                    {GRID_SPACING_OPTIONS.map((option) => (
                      <SelectorCard
                        key={option.id}
                        active={appearance.gridSpacing === option.id}
                        onClick={() => setAppearanceKey("gridSpacing", option.id)}
                      >
                        <span className="text-[10px]">{option.label}</span>
                      </SelectorCard>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col bg-muted/30">
            <div className="flex items-center justify-between border-b border-border bg-background px-5 py-2.5">
              <p className="text-xs text-muted-foreground">Live preview</p>
              {isAppearanceDirty ? <Badge variant="secondary">Unsaved</Badge> : null}
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <iframe
                key={previewUrl}
                src={previewUrl}
                className="absolute inset-0 h-full w-full border-0"
                title="Gallery live preview"
              />
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "photos" ? (
        <main className="flex-1 overflow-y-auto px-8 py-7">
          <div className="mx-auto max-w-6xl space-y-6">
            <UploadPanel galleryId={gallery.id} />
            <AdminImageGrid
              images={gallery.images}
              coverImageId={gallery.coverImageId}
            />
          </div>
        </main>
      ) : null}

      {activeTab === "selections" ? (
        <main className="flex-1 overflow-y-auto px-8 py-7">
          <div className="mx-auto max-w-4xl space-y-4">
            {gallery.submissions.length ? (
              gallery.submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle>{submission.clientName}</CardTitle>
                        <CardDescription>{submission.clientEmail}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {submission.items.length} selected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
                      {submission.items.map((item) => (
                        <div
                          key={item.id}
                          className="relative aspect-square overflow-hidden rounded-md bg-muted"
                        >
                          <Image
                            src={`/api/images/${item.image.id}/asset?variant=thumbnail`}
                            alt={item.image.filename}
                            fill
                            sizes="120px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  No client selections have been submitted yet.
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      ) : null}
    </div>
  );
}
