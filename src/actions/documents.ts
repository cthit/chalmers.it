'use server';

import MediaService from '@/services/mediaService';
import DivisionDocumentService from '@/services/divisionDocumentService';
import { redirect } from 'next/navigation';
import { DocumentType } from '@prisma/client';

export async function addDocument(
  divisionGroupId: string,
  titleSv: string,
  titleEn: string,
  descriptionSv: string,
  descriptionEn: string,
  form: FormData,
  type?: DocumentType
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
      mediaId,
      type
    );
  }
  redirect('/documents');
}

export async function deleteDocument(documentId: number) {
  await DivisionDocumentService.remove(documentId);
  redirect('/documents');
}
