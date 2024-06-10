'use server';

import { redirect } from 'next/navigation';
import DivisionGroupService from '@/services/divisionGroupService';

export async function edit(
  id: number,
  contentEn: string,
  contentSv: string,
  slug: string
) {
  await DivisionGroupService.editInfo({
    contentEn,
    contentSv,
    id,
    slug
  });
  redirect(`../${slug}`);
}
