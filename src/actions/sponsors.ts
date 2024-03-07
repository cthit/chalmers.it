'use server';

import MediaService from '@/services/mediaService';
import SponsorService from '@/services/sponsorService';

export async function addSponsor(
  sponsor: {
    nameSv: string;
    nameEn: string;
    descriptionSv: string;
    descriptionEn: string;
  },
  form: FormData
) {
  const file: File | null = form.get('file') as unknown as File;

  let logoSha = undefined;
  if (file) {
    logoSha = (await MediaService.save(file))?.sha256;
  }

  await SponsorService.create({
    nameSv: sponsor.nameSv,
    nameEn: sponsor.nameEn,
    descriptionSv: sponsor.descriptionSv,
    descriptionEn: sponsor.descriptionEn,
    logoSha
  });
}
