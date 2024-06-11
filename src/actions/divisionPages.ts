'use server';

import DivisionPageService from '@/services/divisionPageService';
import { redirect } from 'next/navigation';
import SessionService from '@/services/sessionService';
import MediaService from '@/services/mediaService';
import { MediaType } from '@/services/fileService';

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
  if (!(await SessionService.isAdmin())) {
    if (
      divisionGroupId === undefined ||
      !(await SessionService.canEditGroupByInternalId(divisionGroupId))
    ) {
      throw new Error('Unauthorized');
    }
  }

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
      sortPrio,
      divisionGroupId,
      parentId
    );
  } catch (e) {
    console.error(e);
  }
  redirect('.');
}

export async function deletePage(id: number) {
  const divisionGroupId = (await DivisionPageService.getSingleById(id))
    ?.divisionGroupId;
  if (!(await SessionService.isAdmin())) {
    if (
      divisionGroupId === undefined ||
      divisionGroupId === null ||
      !(await SessionService.canEditGroupByInternalId(divisionGroupId))
    ) {
      throw new Error('Unauthorized');
    }
  }
  await DivisionPageService.delete(id);
  redirect('.');
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

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  if (!(await SessionService.isAdmin())) {
    if (
      page.divisionGroupId === null ||
      !(await SessionService.canEditGroupByInternalId(page.divisionGroupId))
    ) {
      throw new Error('Unauthorized');
    }
  }
  await DivisionPageService.edit(
    id,
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    slug,
    sortPrio,
    parentId
  );
  redirect('.');
}
