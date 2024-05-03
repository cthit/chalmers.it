'use server';

import MediaService from '@/services/mediaService';
import DivisionGroupService from '@/services/divisionGroupService';
import { redirect } from 'next/navigation';
import { MediaType } from '@/services/fileService';

export async function addBanner(divisionGroupId: number, form: FormData) {
  if (
    !(
      (await SessionService.isAdmin()) ||
      (await SessionService.canEditGroupByInternalId(divisionGroupId))
    )
  ) {
    throw new Error('Unauthorized');
  }

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
  const divisionGroupId = await DivisionGroupService.getBannerOwner(bannerId);
  if (divisionGroupId === undefined) {
    throw new Error('Banner owner not found');
  }

  if (
    !(
      (await SessionService.isAdmin()) ||
      (await SessionService.canEditGroupByInternalId(divisionGroupId))
    )
  ) {
    throw new Error('Unauthorized');
  }

  await DivisionGroupService.deleteBanner(bannerId);
  redirect('./banners');
}
