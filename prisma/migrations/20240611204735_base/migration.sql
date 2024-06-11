-- CreateEnum
CREATE TYPE "NotifierType" AS ENUM ('DISCORD', 'SLACK');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('SV', 'EN');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "SponsorType" AS ENUM ('PARTNER', 'MAIN_PARTNER');

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" SERIAL NOT NULL,
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "contentSv" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "writtenByGammaUserId" TEXT NOT NULL,
    "scheduledPublish" TIMESTAMP(3),
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "divisionGroupId" INTEGER,
    "mediaSha256" TEXT,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionGroup" (
    "id" SERIAL NOT NULL,
    "gammaSuperGroupId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prettyName" TEXT NOT NULL,
    "descriptionSv" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DivisionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionPage" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "contentSv" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "divisionGroupId" INTEGER,
    "slug" TEXT NOT NULL,

    CONSTRAINT "DivisionPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionSv" TEXT NOT NULL,
    "fullDay" BOOLEAN NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "newsPostId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" SERIAL NOT NULL,
    "nameSv" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaSha256" TEXT,
    "type" "SponsorType" NOT NULL DEFAULT 'PARTNER',

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "sha256" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("sha256")
);

-- CreateTable
CREATE TABLE "EventNotifiers" (
    "id" SERIAL NOT NULL,
    "type" "NotifierType" NOT NULL,
    "url" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "EventNotifiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DivisionGroup_gammaSuperGroupId_key" ON "DivisionGroup"("gammaSuperGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "DivisionGroup_slug_key" ON "DivisionGroup"("slug");

-- AddForeignKey
ALTER TABLE "NewsPost" ADD CONSTRAINT "NewsPost_divisionGroupId_fkey" FOREIGN KEY ("divisionGroupId") REFERENCES "DivisionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsPost" ADD CONSTRAINT "NewsPost_mediaSha256_fkey" FOREIGN KEY ("mediaSha256") REFERENCES "Media"("sha256") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPage" ADD CONSTRAINT "DivisionPage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DivisionPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPage" ADD CONSTRAINT "DivisionPage_divisionGroupId_fkey" FOREIGN KEY ("divisionGroupId") REFERENCES "DivisionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_newsPostId_fkey" FOREIGN KEY ("newsPostId") REFERENCES "NewsPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_mediaSha256_fkey" FOREIGN KEY ("mediaSha256") REFERENCES "Media"("sha256") ON DELETE SET NULL ON UPDATE CASCADE;
