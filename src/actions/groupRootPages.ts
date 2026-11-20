'use server';

import DivisionGroupService from '@/services/divisionGroupService';
import MediaService from '@/services/mediaService';
import { VALID_UPLOAD_TYPES } from '@/services/fileService';
import SessionService from '@/services/sessionService';

export async function editGroupRootPage(
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
    await MediaService.save(file, VALID_UPLOAD_TYPES);
  }

  await DivisionGroupService.editInfo({
    contentEn,
    contentSv,
    id,
    slug
  });
}
