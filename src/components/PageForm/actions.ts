'use server';

import { redirect } from 'next/navigation';
import DivisionGroupService from '@/services/divisionGroupService';

export async function edit(
  id: number,
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string
) {
  await DivisionGroupService.editInfo({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    id
  });
  redirect('.');
}
