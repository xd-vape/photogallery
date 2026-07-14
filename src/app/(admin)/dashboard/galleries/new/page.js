import Link from "next/link";
import { GalleryForm } from "@/features/admin/components";
import { Button } from "@/components/ui/button";
import { createGalleryAction } from "@/features/admin/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardTopBar from "@/components/dashboard/topbar";
import { ArrowLeft } from "lucide-react";

export default function NewGalleryPage() {
  return (
    <div className="felex flex-col">
      <DashboardTopBar
        title={"Neue Galerie"}
        subtitle={"Erstelle eine neue Galerie"}
      />
      <main className="flex flex-1 items-start justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <Card className="px-8 py-8">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <GalleryForm
                action={createGalleryAction}
                submitLabel="Create gallery"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
