-- CreateTable
CREATE TABLE "EmailPrivacyNotice" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "titleSv" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "contentSv" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailPrivacyNotice_pkey" PRIMARY KEY ("id")
);

-- Seed a short placeholder that administrators can replace in settings.
INSERT INTO "EmailPrivacyNotice" (
    "id",
    "titleSv",
    "titleEn",
    "contentSv",
    "contentEn",
    "updatedAt"
)
VALUES (
    1,
    'Integritetsinformation för nyheter via e-post',
    'Privacy notice for email news',
    'Information om hur e-postadresser behandlas.',
    'Information about how email addresses are processed.',
    CURRENT_TIMESTAMP
);
