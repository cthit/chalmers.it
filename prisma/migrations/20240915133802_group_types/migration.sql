-- AlterTable
ALTER TABLE "DivisionGroup" ADD COLUMN     "divisionGroupTypeId" INTEGER,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DivisionGroupType" (
    "id" SERIAL NOT NULL,
    "nameSv" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DivisionGroupType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DivisionGroup" ADD CONSTRAINT "DivisionGroup_divisionGroupTypeId_fkey" FOREIGN KEY ("divisionGroupTypeId") REFERENCES "DivisionGroupType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
