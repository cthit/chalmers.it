/*
  Warnings:

  - You are about to drop the `EventNotifiers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "NewsPost" ADD COLUMN     "slackTsEn" TEXT,
ADD COLUMN     "slackTsSv" TEXT,
ADD COLUMN     "slackChannelEn" TEXT,
ADD COLUMN     "slackChannelSv" TEXT;

-- DropTable
DROP TABLE "EventNotifiers";

-- DropEnum
DROP TYPE "NotifierType";
