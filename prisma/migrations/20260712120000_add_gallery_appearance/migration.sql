-- CreateEnum
CREATE TYPE "GalleryCoverStyle" AS ENUM ('CLASSIC', 'MINIMAL', 'BOLD', 'SPLIT', 'DARK');

-- CreateEnum
CREATE TYPE "GalleryFontStyle" AS ENUM ('SERIF', 'SANS', 'MODERN', 'TIMELESS');

-- CreateEnum
CREATE TYPE "GalleryColorPalette" AS ENUM ('LIGHT', 'GOLD', 'ROSE', 'SAND', 'OLIVE', 'DARK');

-- CreateEnum
CREATE TYPE "GalleryGridSpacing" AS ENUM ('TIGHT', 'REGULAR', 'LARGE');

-- AlterTable
ALTER TABLE "Gallery"
ADD COLUMN "coverStyle" "GalleryCoverStyle" NOT NULL DEFAULT 'CLASSIC',
ADD COLUMN "fontStyle" "GalleryFontStyle" NOT NULL DEFAULT 'SERIF',
ADD COLUMN "colorPalette" "GalleryColorPalette" NOT NULL DEFAULT 'LIGHT',
ADD COLUMN "gridColumns" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN "gridSpacing" "GalleryGridSpacing" NOT NULL DEFAULT 'REGULAR';
