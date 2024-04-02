'use server';

import DivisionPageService from '@/services/divisionPageService';
import { redirect } from 'next/navigation';

export async function create(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  slug: string,
  divisionGroupId?: number,
  parentId?: number
) {
  DivisionPageService.post(
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
  DivisionPageService.delete(id);
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
  DivisionPageService.edit(id, titleEn, titleSv, contentEn, contentSv, slug, parentId);
  redirect('.');
}
