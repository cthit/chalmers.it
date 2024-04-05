'use server';

import MediaService from '@/services/mediaService';
import DivisionDocumentService from '@/services/divisionDocumentService';
import { redirect } from 'next/navigation';

export async function addDocument(
  divisionGroupId: string,
  titleSv: string,
  titleEn: string,
  descriptionSv: string,
  descriptionEn: string,
  form: FormData
) {
  const file: File | null = form.get('file') as unknown as File;

  if (!file) {
    return;
  }

  const mediaId = (await MediaService.save(file))?.sha256;
  if (mediaId) {
    await DivisionDocumentService.add(
      divisionGroupId,
      titleSv,
      titleEn,
      descriptionSv,
      descriptionEn,
      mediaId
    );
  }
  redirect('/documents');
}

export async function deleteDocument(documentId: number) {
  await DivisionDocumentService.remove(documentId);
  redirect('/documents');
}
