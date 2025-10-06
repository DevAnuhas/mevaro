/*
  Warnings:

  - You are about to drop the column `downloadedAt` on the `view` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "view" DROP COLUMN "downloadedAt",
ADD COLUMN     "fingerprint" TEXT,
ADD COLUMN     "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "view_materialId_userId_idx" ON "view"("materialId", "userId");

-- CreateIndex
CREATE INDEX "view_materialId_fingerprint_idx" ON "view"("materialId", "fingerprint");
