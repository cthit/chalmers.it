'use server';

import DivisionPageService from '@/services/divisionPageService';
import { redirect } from 'next/navigation';
import SessionService from '@/services/sessionService';

export async function create(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  slug: string,
  divisionGroupId?: number,
  parentId?: number
) {
  //todo: Should corporate relations be able to create non-division group pages?
  if (!(await SessionService.isAdmin())) {
    if (
      divisionGroupId === undefined ||
      (await SessionService.canEditGroupByInternalId(divisionGroupId))
    ) {
      throw new Error('Unauthorized');
    }
  }
  await DivisionPageService.post(
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    slug,
    divisionGroupId,
    parentId
  );
  redirect('.');
}

export async function deletePage(id: number) {
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
  parentId?: number
) {
  await DivisionPageService.edit(
    id,
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    slug,
    parentId
  );
  redirect('.');
}
