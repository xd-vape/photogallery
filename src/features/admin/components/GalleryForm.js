import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function GalleryForm({ gallery, action, submitLabel }) {
  const expiresValue = gallery?.expiresAt
    ? new Date(gallery.expiresAt).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={gallery?.title || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={gallery?.description || ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={gallery?.status || "DRAFT"}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiry date</Label>
          <Input
            id="expiresAt"
            name="expiresAt"
            type="date"
            defaultValue={expiresValue}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Gallery password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={gallery?.passwordHash ? "Leave blank to keep current password" : ""}
        />
      </div>
      {gallery?.passwordHash ? (
        <Label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox name="clearPassword" />
          Remove password protection
        </Label>
      ) : null}
      <Label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Checkbox
          name="downloadEnabled"
          defaultChecked={gallery?.downloadEnabled || false}
        />
        Enable individual client downloads
      </Label>
      <Button type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}
