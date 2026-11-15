'use client';

import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import FileService, { MediaType } from '@/services/fileService';
import i18nService from '@/services/i18nService';
import { VERY_LARGE_FILE_WARNING_BYTES } from '@/utils/uploadWarnings';

const validUploadTypes = Object.values(MediaType);

type RejectionReason = 'type' | 'size' | 'total';

interface Rejection {
  file: File;
  reason: RejectionReason;
}

interface UseUploadQueueOptions {
  locale: string;
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
}

export function useUploadQueue({
  locale,
  maxFileSizeBytes = FileService.maxMediaSizeBytes,
  maxUploadSizeBytes = FileService.maxUploadSizeBytes
}: UseUploadQueueOptions) {
  const l = i18nService.getLocale(locale);
  const [uploadQueue, setUploadQueue] = useState<{ [key: string]: File }>({});
  const queueRef = useRef<{ [key: string]: File }>(uploadQueue);

  const dropFiles = async (files: FileList | File[]) => {
    const accepted: { [key: string]: File } = {};
    const rejected: Rejection[] = [];

    for (const file of Array.from(files)) {
      const meta = FileService.convertMimeType(file.type);
      if (!meta || !validUploadTypes.includes(meta.type)) {
        rejected.push({ file, reason: 'type' });
        continue;
      }

      if (file.size > maxFileSizeBytes) {
        rejected.push({ file, reason: 'size' });
        continue;
      }

      const currentSize = Object.values(queueRef.current).reduce(
        (total, queued) => total + queued.size,
        0
      );
      if (currentSize + file.size > maxUploadSizeBytes) {
        rejected.push({ file, reason: 'total' });
        continue;
      }

      if (file.size >= VERY_LARGE_FILE_WARNING_BYTES) {
        toast.warning(
          `${file.name}. ${
            meta.type === MediaType.Image
              ? l.editor.imageVeryLarge
              : l.editor.fileLarge
          }`
        );
      }

      const sha256 = await FileService.fileSha256Browser(file);
      if (queueRef.current[sha256]) {
        accepted[sha256] = queueRef.current[sha256];
        continue;
      }

      const latestSize = Object.values(queueRef.current).reduce(
        (total, queued) => total + queued.size,
        0
      );
      if (latestSize + file.size > maxUploadSizeBytes) {
        rejected.push({ file, reason: 'total' });
        continue;
      }

      queueRef.current = {
        ...queueRef.current,
        [sha256]: file
      };
      setUploadQueue(queueRef.current);
      accepted[sha256] = file;
    }

    if (rejected.length > 0) {
      const messages: { [key in RejectionReason]: string } = {
        type: l.editor.fileTypeUnsupported,
        size: `${l.editor.fileTooLarge} (${FileService.formatBytes(
          maxFileSizeBytes
        )})`,
        total: `${l.editor.uploadLimitExceeded} (${FileService.formatBytes(
          maxUploadSizeBytes
        )})`
      };
      toast.error(
        `${l.editor.uploadRejected}. ${rejected
          .map(({ file, reason }) => `${file.name} (${messages[reason]})`)
          .join(', ')}`
      );
    }

    return Object.entries(accepted).map(([sha256, file]) => ({
      file,
      url: '/api/media/' + sha256
    }));
  };

  const removeFile = (sha256: string) => {
    const next = { ...queueRef.current };
    delete next[sha256];
    queueRef.current = next;
    setUploadQueue(next);
  };

  return {
    uploadQueue,
    dropFiles,
    removeFile,
    getQueue: () => queueRef.current
  };
}
