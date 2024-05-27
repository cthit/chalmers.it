'use server';

import MediaService from '@/services/mediaService';
import DivisionGroupService from '@/services/divisionGroupService';
import { redirect } from 'next/navigation';
import { MediaType } from '@/services/fileService';

export async function addBanner(divisionGroupId: number, form: FormData) {
  const file: File | null = form.get('file') as unknown as File;

  if (!file) {
    return;
  }

  const mediaId = (await MediaService.save(file, [MediaType.Image]))?.sha256;
  if (mediaId) {
    await DivisionGroupService.addBanner(divisionGroupId, mediaId);
  }
  redirect('./banners');
}

export async function deleteBanner(bannerId: number) {
  await DivisionGroupService.deleteBanner(bannerId);
  redirect('./banners');
}
