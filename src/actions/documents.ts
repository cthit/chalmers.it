'use server';

import MediaService from '@/services/mediaService';
import DivisionDocumentService from '@/services/divisionDocumentService';
import { redirect } from 'next/navigation';
import { DocumentType } from '@prisma/client';
import { MediaType } from '@/services/fileService';
import SessionService from '@/services/sessionService';

export async function addDocument(
  divisionSuperGroupId: string,
  titleSv: string,
  titleEn: string,
  descriptionSv: string,
  descriptionEn: string,
  form: FormData,
  type?: DocumentType
) {
  if (!(await SessionService.canEditGroup(divisionSuperGroupId))) {
    throw new Error('Unauthorized');
  }

  const file: File | null = form.get('file') as unknown as File;

  if (!file) {
    return;
  }

  const mediaId = (await MediaService.save(file, [MediaType.Document]))?.sha256;
  if (mediaId) {
    await DivisionDocumentService.add(
      divisionSuperGroupId,
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
