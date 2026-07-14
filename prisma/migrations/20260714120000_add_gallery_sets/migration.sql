-- CreateTable
CREATE TABLE "GallerySet" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GallerySet_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Image" ADD COLUMN "setId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GallerySet_galleryId_name_key" ON "GallerySet"("galleryId", "name");

-- CreateIndex
CREATE INDEX "GallerySet_galleryId_position_idx" ON "GallerySet"("galleryId", "position");

-- CreateIndex
CREATE INDEX "Image_setId_position_idx" ON "Image"("setId", "position");

-- AddForeignKey
ALTER TABLE "GallerySet" ADD CONSTRAINT "GallerySet_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_setId_fkey" FOREIGN KEY ("setId") REFERENCES "GallerySet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
