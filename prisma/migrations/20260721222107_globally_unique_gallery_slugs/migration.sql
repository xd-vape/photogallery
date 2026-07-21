-- Existing installations may contain the same slug for different owners.
-- Keep the oldest gallery on the original public URL.
-- Rename every additional gallery deterministically.

WITH ranked_galleries AS (
  SELECT
    "id",
    "slug",
    ROW_NUMBER() OVER (
      PARTITION BY "slug"
      ORDER BY "createdAt" ASC, "id" ASC
    ) AS "duplicateRank"
  FROM "Gallery"
)
UPDATE "Gallery" AS gallery
SET "slug" = CONCAT(
  LEFT(
    ranked_galleries."slug",
    GREATEST(
      1,
      72 - LENGTH(ranked_galleries."id") - 2
    )
  ),
  '--',
  ranked_galleries."id"
)
FROM ranked_galleries
WHERE gallery."id" = ranked_galleries."id"
  AND ranked_galleries."duplicateRank" > 1;

-- Abort before changing constraints if duplicate values somehow remain.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Gallery"
    GROUP BY "slug"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Duplicate Gallery slugs remain after migration';
  END IF;
END
$$;

-- Replace per-owner uniqueness with global uniqueness.
DROP INDEX "Gallery_ownerId_slug_key";

CREATE UNIQUE INDEX "Gallery_slug_key"
ON "Gallery"("slug");