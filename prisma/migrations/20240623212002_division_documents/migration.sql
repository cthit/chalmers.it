-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PROTOCOL', 'BUDGET', 'BUSINESS_PLAN', 'FINANCIAL_REPORT', 'BUSINESS_REPORT', 'MISC');

-- CreateTable
CREATE TABLE "DivisionDocument" (
    "id" SERIAL NOT NULL,
    "divisionGroupId" INTEGER NOT NULL,
    "mediaSha256" TEXT NOT NULL,
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionSv" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'MISC',

    CONSTRAINT "DivisionDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DivisionDocument" ADD CONSTRAINT "DivisionDocument_divisionGroupId_fkey" FOREIGN KEY ("divisionGroupId") REFERENCES "DivisionGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionDocument" ADD CONSTRAINT "DivisionDocument_mediaSha256_fkey" FOREIGN KEY ("mediaSha256") REFERENCES "Media"("sha256") ON DELETE RESTRICT ON UPDATE CASCADE;
