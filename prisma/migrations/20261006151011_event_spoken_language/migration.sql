-- CreateEnum
CREATE TYPE "SpokenLanguage" AS ENUM ('SV', 'EN', 'SV_EN');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "spokenLanguage" "SpokenLanguage";
