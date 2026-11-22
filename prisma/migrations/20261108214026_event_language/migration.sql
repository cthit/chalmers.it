-- CreateEnum
CREATE TYPE "EventLanguage" AS ENUM ('SV', 'EN', 'SV_EN');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "language" "EventLanguage";
