/*
  Warnings:

  - You are about to drop the column `descriptionEn` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionSv` on the `Sponsor` table. All the data in the column will be lost.
  - Added the required column `url` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "SponsorType" AS ENUM ('PARTNER', 'MAIN_PARTNER');

-- AlterTable
ALTER TABLE "NewsPost" ADD COLUMN     "scheduledPublish" TIMESTAMP(3),
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "descriptionEn",
DROP COLUMN "descriptionSv",
ADD COLUMN     "type" "SponsorType" NOT NULL DEFAULT 'PARTNER',
ADD COLUMN     "url" TEXT NOT NULL;
