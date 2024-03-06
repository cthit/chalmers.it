-- CreateEnum
CREATE TYPE "NotifierType" AS ENUM ('DISCORD', 'SLACK');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('SV', 'EN');

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" SERIAL NOT NULL,
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "contentSv" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "writtenByGammaUserId" TEXT NOT NULL,
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
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionSv" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DivisionGroup_pkey" PRIMARY KEY ("id")
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
    "descriptionSv" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaSha256" TEXT,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "divisionGroupId" INTEGER NOT NULL,
    "mediaSha256" TEXT NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Banner_divisionGroupId_mediaSha256_key" ON "Banner"("divisionGroupId", "mediaSha256");

-- AddForeignKey
ALTER TABLE "NewsPost" ADD CONSTRAINT "NewsPost_divisionGroupId_fkey" FOREIGN KEY ("divisionGroupId") REFERENCES "DivisionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsPost" ADD CONSTRAINT "NewsPost_mediaSha256_fkey" FOREIGN KEY ("mediaSha256") REFERENCES "Media"("sha256") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_newsPostId_fkey" FOREIGN KEY ("newsPostId") REFERENCES "NewsPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_mediaSha256_fkey" FOREIGN KEY ("mediaSha256") REFERENCES "Media"("sha256") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_divisionGroupId_fkey" FOREIGN KEY ("divisionGroupId") REFERENCES "DivisionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_mediaSha256_fkey" FOREIGN KEY ("mediaSha256") REFERENCES "Media"("sha256") ON DELETE RESTRICT ON UPDATE CASCADE;
