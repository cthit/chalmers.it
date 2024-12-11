'use server';

import DivisionPageService from '@/services/divisionPageService';
import { redirect } from 'next/navigation';
import SessionService from '@/services/sessionService';
import MediaService from '@/services/mediaService';
import { MediaType } from '@/services/fileService';

async function checkAuthorization(divisionGroupId?: number | null) {
  const isPageEditor = await SessionService.isPageEditor();
  const canEditGroup =
    divisionGroupId !== undefined && divisionGroupId !== null
      ? await SessionService.canEditGroupByInternalId(divisionGroupId)
      : true;

  if (!isPageEditor && !canEditGroup) {
    throw new Error('Unauthorized');
  }
}

export async function create(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  slug: string,
  sortPrio: number,
  files: FormData,
  divisionGroupId?: number,
  parentId?: number
) {
  await checkAuthorization(divisionGroupId);

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  try {
    await DivisionPageService.post(
      titleEn,
      titleSv,
      contentEn,
      contentSv,
      slug,
      isNaN(sortPrio) ? 0 : sortPrio,
      divisionGroupId,
      parentId
    );
  } catch (e) {
    console.error(e);
  }
  redirect('/groups');
}

export async function deletePage(id: number) {
  const divisionGroupId = (await DivisionPageService.getSingleById(id))
    ?.divisionGroupId;
  const isAdmin = await SessionService.isAdmin();

  if (!isAdmin) {
    await checkAuthorization(divisionGroupId);
  }

  await DivisionPageService.delete(id);
  redirect('/groups');
}

export async function edit(
  id: number,
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  slug: string,
  sortPrio: number,
  files: FormData,
  parentId?: number
) {
  const page = (await DivisionPageService.getSingleById(id)) ?? null;
  if (page === null) {
    throw new Error('Page not found');
  }

  await checkAuthorization(page.divisionGroupId);

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  await DivisionPageService.edit(
    id,
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    slug,
    isNaN(sortPrio) ? 0 : sortPrio,
    parentId
  );
  redirect('/groups');
}
