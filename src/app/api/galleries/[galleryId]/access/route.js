import { NextResponse } from "next/server";
import {
  createGalleryAccessToken,
  getPublicGallery,
  galleryAccessCookieName,
} from "@/lib/galleries/access";
import { verifyGalleryPassword } from "@/lib/galleries/passwords";

export async function POST(request, { params }) {
  const { galleryId: slug } = await params;
  const gallery = await getPublicGallery(slug);
  const body = await request.json().catch(() => ({}));
  const isValid = await verifyGalleryPassword(body.password, gallery.passwordHash);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(galleryAccessCookieName(gallery.slug), createGalleryAccessToken(gallery), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
