'use server';

import MediaService from '@/services/mediaService';
import DivisionGroupService from '@/services/divisionGroupService';

export async function addBanner(divisionGroupId: number, form: FormData) {
  const file: File | null = form.get('file') as unknown as File;

  let mediaId = undefined;
  if (file) {
    mediaId = (await MediaService.upload(file)).sha256;
  }

  await DivisionGroupService.addBanner(divisionGroupId, mediaId);
}
