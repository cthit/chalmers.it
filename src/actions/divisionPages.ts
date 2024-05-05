'use server';

import DivisionPageService from '@/services/divisionPageService';
import { redirect } from 'next/navigation';
import SessionService from '@/services/sessionService';
import { toast } from 'react-toastify';

export async function create(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  slug: string,
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
  try {
    await toast.promise(
      DivisionPageService.post(
        titleEn,
        titleSv,
        contentEn,
        contentSv,
        slug,
        divisionGroupId,
        parentId
      ),
      {
        pending: 'Saving...',
        success: 'Page created',
        error: 'Failed to create page'
      }
    );
  } catch (e) {
    console.error(e);
  }
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
  const page = (await DivisionPageService.getSingleById(id)) ?? null;
  if (page === null) {
    throw new Error('Page not found');
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
    parentId
  );
  redirect('.');
}
