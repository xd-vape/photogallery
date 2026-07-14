"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { CalenderPicker } from "@/components/dashboard/gallerie/calenderpicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function Toggle({ name, label, description, checked, onCheckedChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>

        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />

      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full bg-muted transition-colors",
          "after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4",
          "after:rounded-full after:bg-background after:shadow-sm",
          "after:transition-transform",
          "peer-checked:bg-foreground peer-checked:after:translate-x-4",
        )}
      />
    </label>
  );
}

export function GalleryForm({ gallery, action, submitLabel, formId }) {
  const [passwordProtected, setPasswordProtected] = useState(
    Boolean(gallery?.passwordHash),
  );

  const [downloadEnabled, setDownloadEnabled] = useState(
    Boolean(gallery?.downloadEnabled),
  );

  const expiresValue = gallery?.expiresAt
    ? new Date(gallery.expiresAt).toISOString().slice(0, 10)
    : "";

  const eventDateValue = gallery?.eventDate
    ? new Date(gallery.eventDate).toISOString().slice(0, 10)
    : "";

  return (
    <form id={formId} action={action} className="max-w-2xl space-y-10">
      {/* General */}
      <section>
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          General
        </h2>

        <div className="space-y-4">
          {/* Titel */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Gallery Title <span className="text-red-500">*</span>
            </Label>

            <Input
              id="title"
              name="title"
              required
              minLength={2}
              maxLength={120}
              defaultValue={gallery?.title ?? ""}
              placeholder="z.B. Hochzeit Emma & James"
              className="input-field"
            />
          </div>

          {/* Slug */}
          {gallery?.slug ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug</Label>

                <span className="text-xs text-muted-foreground">
                  Public URL
                </span>
              </div>

              <div className="flex overflow-hidden rounded-lg border border-border bg-background">
                <span className="whitespace-nowrap border-r border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                  framelab.io/g/
                </span>

                <input
                  id="slug"
                  value={gallery.slug}
                  readOnly
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>
          ) : null}

          {/* Beschreibung */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              rows={3}
              maxLength={2000}
              defaultValue={gallery?.description ?? ""}
              placeholder="Optional note shown to the client..."
              className="input-field resize-none"
            />
          </div>

          {/* Status und Eventdatum */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>

              <div className="relative">
                <select
                  id="status"
                  name="status"
                  defaultValue={gallery?.status ?? "DRAFT"}
                  className="input-field w-full appearance-none pr-8"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Event date</Label>

              <CalenderPicker name="eventDate" defaultValue={eventDateValue} />
            </div>
          </div>

          {/* Ablaufdatum */}
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiry date</Label>

            <Input
              id="expiresAt"
              name="expiresAt"
              type="date"
              defaultValue={expiresValue}
              className="input-field"
            />

            <p className="text-xs text-muted-foreground">
              Leave empty if the gallery should not expire.
            </p>
          </div>
        </div>
      </section>

      {/* Access & Download */}
      <section>
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Access & Download
        </h2>

        <div className="space-y-3">
          <Toggle
            label="Password protection"
            description="Require a password to view this gallery"
            checked={passwordProtected}
            onCheckedChange={setPasswordProtected}
          />

          {passwordProtected ? (
            <div className="space-y-2 pl-4">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                name="password"
                type="password"
                maxLength={120}
                autoComplete="new-password"
                placeholder={
                  gallery?.passwordHash
                    ? "Leave blank to keep the current password"
                    : "Enter gallery password"
                }
                className="input-field"
              />

              {gallery?.passwordHash ? (
                <p className="text-xs text-muted-foreground">
                  The existing password cannot be displayed. Leave this field
                  empty to keep it.
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Wird nur gesendet, wenn ein bestehendes Passwort entfernt wird */}
          {!passwordProtected && gallery?.passwordHash ? (
            <input type="hidden" name="clearPassword" value="on" />
          ) : null}

          <Toggle
            name="downloadEnabled"
            label="Allow downloads"
            description="Clients can download full-resolution photos"
            checked={downloadEnabled}
            onCheckedChange={setDownloadEnabled}
          />
        </div>
      </section>
    </form>
  );
}
