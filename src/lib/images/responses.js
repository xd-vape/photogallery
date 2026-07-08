import { NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";

export async function streamStoredFile(key, { filename, contentType, download = false }) {
  const buffer = await getStorage().get(key);
  const headers = new Headers({
    "Content-Type": contentType || "application/octet-stream",
    "Cache-Control": "private, max-age=300",
  });

  if (download) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${String(filename || "download").replace(/"/g, "")}"`
    );
  }

  return new NextResponse(buffer, { headers });
}
