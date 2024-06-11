'use server';

import { redirect } from 'next/navigation';
import DivisionGroupService from '@/services/divisionGroupService';
import MediaService from '@/services/mediaService';
import { MediaType } from '@/services/fileService';
import SessionService from '@/services/sessionService';

export async function edit(
  id: number,
  contentEn: string,
  contentSv: string,
  slug: string,
  files: FormData
) {
  if (!(await SessionService.isAdmin())) {
    if (!(await SessionService.canEditGroupByInternalId(id))) {
      throw new Error('Unauthorized');
    }
  }

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  await DivisionGroupService.editInfo({
    contentEn,
    contentSv,
    id,
    slug
  });
  redirect(`../${slug}`);
}
