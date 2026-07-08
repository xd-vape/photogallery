import Link from "next/link";
import { GalleryForm } from "@/features/admin/components";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createGalleryAction } from "@/features/admin/server";

export default function NewGalleryPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <Button variant="link" className="px-0">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        New gallery
      </h1>
      <Card className="mt-8">
        <CardContent className="pt-6">
          <GalleryForm
            action={createGalleryAction}
            submitLabel="Create gallery"
          />
        </CardContent>
      </Card>
    </main>
  );
}
