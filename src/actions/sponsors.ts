'use server';

import { MediaType } from '@/services/fileService';
import MediaService from '@/services/mediaService';
import SponsorService from '@/services/sponsorService';
import SessionService from '@/services/sessionService';
import { redirect } from 'next/navigation';
import { SponsorType } from '@prisma/client';

export async function addSponsor(
  sponsor: {
    nameSv: string;
    nameEn: string;
    url: string;
    type: SponsorType;
  },
  form: FormData
) {
  if (
    !(await SessionService.isAdmin()) &&
    !(await SessionService.isCorporateRelations())
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
    logoSha,
    type: sponsor.type
  });
  redirect('/settings/sponsors');
}

export async function removeSponsor(id: number) {
  if (
    !(await SessionService.isAdmin()) &&
    !(await SessionService.isCorporateRelations())
  ) {
    throw new Error('Unauthorized');
  }

  await SponsorService.remove(id);
  redirect('/settings/sponsors');
}
