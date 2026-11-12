'use server';

import NewsService from '@/services/newsService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import { PostStatus } from '@prisma/client';
import MediaService from '@/services/mediaService';
import FileService, { MediaType } from '@/services/fileService';
import SessionService from '@/services/sessionService';

const validUploadTypes = Object.values(MediaType);

function validateUploads(uploads: File[]) {
  const totalSize = uploads.reduce((total, file) => total + file.size, 0);
  if (totalSize > FileService.maxUploadSizeBytes) {
    throw new Error('Total upload size exceeds the limit');
  }

  const invalid = uploads.find(
    (file) => !FileService.checkValidFile(file, validUploadTypes)
  );
  if (invalid) {
    throw new Error(`Invalid file ${invalid.name}`);
  }
}

async function saveUploadedFiles(files: FormData) {
  const uploads = files.getAll('file') as unknown as File[];
  validateUploads(uploads);

  for (const file of uploads) {
    const saved = await MediaService.save(file, validUploadTypes);
    if (!saved) {
      throw new Error(`Could not save file ${file.name}`);
    }
  }
}

export async function post(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  files: FormData,
  scheduledPublish?: Date
) {
  const session = await getServerSession(authConfig);
  if (!(await SessionService.isActive(session))) {
    throw new Error('Unauthorized');
  }

  await saveUploadedFiles(files);

  const res = await NewsService.post({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    scheduledPublish,
    writtenByGammaUserId: session?.user?.id!,
    status: scheduledPublish ? PostStatus.SCHEDULED : PostStatus.PUBLISHED
  });
  return res.id;
}

export async function edit(
  id: number,
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  files: FormData,
  scheduledPublish?: Date | null
) {
  if (!(await SessionService.isNewsPostOwner(id))) {
    throw new Error('Unauthorized');
  }

  await saveUploadedFiles(files);

  await NewsService.edit({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    scheduledPublish,
    id: id
  });
}

export async function postForGroup(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  divisionSuperGroupId: string,
  files: FormData,
  scheduledPublish?: Date
) {
  const session = await getServerSession(authConfig);

  if (!(await SessionService.canEditGroup(divisionSuperGroupId, session))) {
    throw new Error('Unauthorized');
  }

  await saveUploadedFiles(files);

  const res = await NewsService.post({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    divisionSuperGroupId,
    scheduledPublish,
    writtenByGammaUserId: session?.user?.id!,
    status: scheduledPublish ? PostStatus.SCHEDULED : PostStatus.PUBLISHED
  });
  return res.id;
}

export async function deletePost(id: number) {
  if (
    !(await SessionService.isAdmin()) &&
    !(await SessionService.isNewsPostOwner(id))
  ) {
    throw new Error('Unauthorized');
  }

  await NewsService.remove(id);
}
