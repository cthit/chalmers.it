'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import FileService, {
  MediaType,
  VALID_UPLOAD_TYPES
} from '@/services/fileService';
import i18nService from '@/services/i18nService';
import { VERY_LARGE_FILE_WARNING_BYTES } from '@/utils/uploadWarnings';

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

const queueSize = (queue: { [key: string]: File }) =>
  Object.values(queue).reduce((total, file) => total + file.size, 0);

export function useUploadQueue({
  locale,
  maxFileSizeBytes = FileService.maxMediaSizeBytes,
  maxUploadSizeBytes = FileService.maxUploadSizeBytes
}: UseUploadQueueOptions) {
  const l = i18nService.getLocale(locale);
  const [uploadQueue, setUploadQueue] = useState<{ [key: string]: File }>({});

  const dropFiles = async (files: FileList | File[]) => {
    const accepted: { [key: string]: File } = {};
    const rejected: Rejection[] = [];
    let queue = { ...uploadQueue };

    for (const file of Array.from(files)) {
      const meta = FileService.convertMimeType(file.type);
      if (!meta || !VALID_UPLOAD_TYPES.includes(meta.type)) {
        rejected.push({ file, reason: 'type' });
        continue;
      }

      if (file.size > maxFileSizeBytes) {
        rejected.push({ file, reason: 'size' });
        continue;
      }

      if (queueSize(queue) + file.size > maxUploadSizeBytes) {
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
      const queued = queue[sha256];
      if (queued) {
        accepted[sha256] = queued;
        continue;
      }

      if (queueSize(queue) + file.size > maxUploadSizeBytes) {
        rejected.push({ file, reason: 'total' });
        continue;
      }

      queue = { ...queue, [sha256]: file };
      accepted[sha256] = file;
    }

    if (Object.keys(accepted).length > 0) {
      setUploadQueue((prev) => ({ ...prev, ...accepted }));
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
    setUploadQueue((prev) => {
      const next = { ...prev };
      delete next[sha256];
      return next;
    });
  };

  return { uploadQueue, dropFiles, removeFile };
}
