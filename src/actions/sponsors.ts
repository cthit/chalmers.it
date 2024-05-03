'use server';

import { MediaType } from '@/services/fileService';
import MediaService from '@/services/mediaService';
import SponsorService from '@/services/sponsorService';
import SessionService from '@/services/sessionService';

export async function addSponsor(
  sponsor: {
    nameSv: string;
    nameEn: string;
    url: string;
  },
  form: FormData
) {
  if (
    !(
      (await SessionService.isCorporateRelations()) ||
      (await SessionService.isAdmin())
    )
  ) {
    throw new Error('Unauthorized');
  }
  const file: File | null = form.get('file') as unknown as File;

  let logoSha = undefined;
  if (file) {
    logoSha = (await MediaService.save(file, [MediaType.Image]))?.sha256;
  }

  await SponsorService.create({
    nameSv: sponsor.nameSv,
    nameEn: sponsor.nameEn,
    url: sponsor.url,
    logoSha
  });
}
