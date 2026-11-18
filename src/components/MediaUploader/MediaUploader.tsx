'use client';

import ActionButton from '@/components/ActionButton/ActionButton';
import CopyButton from '@/components/CopyButton/CopyButton';
import FileService, { VALID_UPLOAD_TYPES } from '@/services/fileService';
import i18nService from '@/services/i18nService';
import { createMarkdownLinkToMedia } from '@/utils/mediaLink';
import {
  LARGE_IMAGE_WARNING_BYTES,
  VERY_LARGE_FILE_WARNING_BYTES
} from '@/utils/uploadWarnings';
import { useRef } from 'react';
import styles from './MediaUploader.module.scss';

interface MediaUploaderProps {
  locale: string;
  uploadQueue: { [key: string]: File };
  onSelect: (files: FileList | File[]) => void | Promise<unknown>;
  onRemove: (sha256: string) => void;
  maxFileSizeBytes?: number;
  maxUploadSizeBytes?: number;
}

const MediaUploader = ({
  locale,
  uploadQueue,
  onSelect,
  onRemove,
  maxFileSizeBytes = FileService.maxMediaSizeBytes,
  maxUploadSizeBytes = FileService.maxUploadSizeBytes
}: MediaUploaderProps) => {
  const l = i18nService.getLocale(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFiles = Object.entries(uploadQueue);
  const totalUploadSize = uploadedFiles.reduce(
    (total, [, file]) => total + file.size,
    0
  );

  const getFileWarning = (file: File) => {
    const isImage = FileService.isMimeEmbeddable(file.type);
    if (isImage && file.size >= VERY_LARGE_FILE_WARNING_BYTES) {
      return { message: l.editor.imageVeryLarge, severe: true };
    }
    if (isImage && file.size >= LARGE_IMAGE_WARNING_BYTES) {
      return { message: l.editor.imageLarge, severe: false };
    }
    if (file.size >= VERY_LARGE_FILE_WARNING_BYTES) {
      return { message: l.editor.fileLarge, severe: true };
    }
    return null;
  };

  return (
    <div className={styles.uploader}>
      <h2>{l.editor.uploadQueue}</h2>
      {uploadedFiles.length === 0 ? (
        <p>{l.editor.noQueuedFiles}</p>
      ) : (
        <p
          className={`${styles.uploadSummary} ${
            totalUploadSize > maxUploadSizeBytes * 0.9
              ? styles.fileWarningStrong
              : ''
          }`}
        >
          {l.editor.totalSize} {FileService.formatBytes(totalUploadSize)} /{' '}
          {FileService.formatBytes(maxUploadSizeBytes)}
        </p>
      )}
      <ul className={styles.list}>
        {uploadedFiles.map(([sha256, file]) => {
          const warning = getFileWarning(file);
          return (
            <li className={styles.fileActions} key={sha256}>
              <p>{file.name}</p>{' '}
              <span className={styles.fileSize}>
                {FileService.formatBytes(file.size)}
              </span>
              <CopyButton
                locale={locale}
                copyContent={createMarkdownLinkToMedia(sha256, file)}
              />
              <ActionButton type="button" onClick={() => onRemove(sha256)}>
                {l.general.delete}
              </ActionButton>
              {warning && (
                <span
                  className={`${styles.fileWarning} ${
                    warning.severe ? styles.fileWarningStrong : ''
                  }`}
                >
                  {warning.message}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <ActionButton type="button" onClick={() => fileInputRef.current?.click()}>
        {l.editor.selectFiles}
      </ActionButton>
      <p className={styles.uploadSummary}>
        {l.editor.maxFileSize} {FileService.formatBytes(maxFileSizeBytes)}
        <br />
        {l.editor.maxTotalUploadSize}{' '}
        {FileService.formatBytes(maxUploadSizeBytes)}
      </p>
      <input
        accept={FileService.getValidMimes(VALID_UPLOAD_TYPES).join(',')}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = '';
          void onSelect(files);
        }}
        multiple
        ref={fileInputRef}
        type="file"
        hidden
      />
    </div>
  );
};

export default MediaUploader;
