-- CreateTable
CREATE TABLE "DivisionPage" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,
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

-- AddForeignKey
ALTER TABLE "DivisionPage" ADD CONSTRAINT "DivisionPage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DivisionPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DivisionPage" ADD CONSTRAINT "DivisionPage_divisionGroupId_fkey" FOREIGN KEY ("divisionGroupId") REFERENCES "DivisionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
