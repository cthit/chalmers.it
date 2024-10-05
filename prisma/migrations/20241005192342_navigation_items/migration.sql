-- CreateTable
CREATE TABLE "NavbarCategory" (
    "id" SERIAL NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "nameSv" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "NavbarCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavbarItem" (
    "id" SERIAL NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "nameSv" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "NavbarItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NavbarItem" ADD CONSTRAINT "NavbarItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "NavbarCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
