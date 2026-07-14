import { CalenderPicker } from "@/components/dashboard/gallerie/calenderpicker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function GalleryForm({ gallery, action, submitLabel, formId }) {
  const expiresValue = gallery?.expiresAt
    ? new Date(gallery.expiresAt).toISOString().slice(0, 10)
    : "";
  const eventDateValue = gallery?.eventDate
    ? new Date(gallery.eventDate).toISOString().slice(0, 10)
    : "";

  return (
    <form id={formId} action={action} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            minLength={2}
            maxLength={120}
            defaultValue={gallery?.title || ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            maxLength={2000}
            rows={4}
            defaultValue={gallery?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Event date</Label>
          <CalenderPicker name="eventDate" defaultValue={eventDateValue} />
        </div>

        <div className="space-y-2">
          <Label>Expiry date</Label>
          <CalenderPicker name="expiresAt" defaultValue={expiresValue} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={gallery?.status || "DRAFT"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Gallery password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            maxLength={120}
            placeholder={
              gallery?.passwordHash ? "Leave blank to keep current password" : "Optional"
            }
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border p-4">
        {gallery?.passwordHash ? (
          <Label className="flex items-center gap-3 text-sm font-normal">
            <Checkbox name="clearPassword" />
            Remove password protection
          </Label>
        ) : null}
        <Label className="flex items-center gap-3 text-sm font-normal">
          <Checkbox
            name="downloadEnabled"
            defaultChecked={gallery?.downloadEnabled || false}
          />
          Enable individual client downloads
        </Label>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
