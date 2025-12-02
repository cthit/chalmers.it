'use client';

import { edit } from '@/actions/groupRootPages';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { useRef, useState } from 'react';
import styles from '../NewsPostForm/NewsPostForm.module.scss';
import i18nService from '@/services/i18nService';
import FileService, { MediaType } from '@/services/fileService';
import { toast } from 'react-toastify';

const validUploadTypes = Object.values(MediaType);

interface NewPostFormProps {
  id: number;
  contentEn: string;
  contentSv: string;
  slug: string;
  locale: string;
}

const PageForm = (description: NewPostFormProps) => {
  const l = i18nService.getLocale(description.locale);

  const contentEnRef = useRef<{ getMarkdown: () => string }>(null);
  const contentSvRef = useRef<{ getMarkdown: () => string }>(null);
  const [slug, setSlug] = useState(description.slug ?? '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<{
    [key: string]: File;
  }>({});

  const dropFiles = async (f: FileList) => {
    const newQueue = { ...uploadQueue };
    const droppedFiles: { [key: string]: File } = {};
    for (let i = 0; i < f.length; i++) {
      const file = f[i];
      if (!FileService.checkValidFile(file, validUploadTypes)) continue;

      const sha256 = await FileService.fileSha256Browser(file);
      newQueue[sha256] = file;
      droppedFiles[sha256] = file;
    }
    setUploadQueue(newQueue);
    return Object.entries(droppedFiles).map(([sha256, file]) => ({
      file,
      url: '/api/media/' + sha256
    }));
  };

  const delFile = (sha256: string) => {
    const newQueue = { ...uploadQueue };
    delete newQueue[sha256];
    setUploadQueue(newQueue);
  };

  const copyFile = (sha256: string, file: File) => {
    const embed = FileService.isMimeEmbeddable(file.type);
    navigator.clipboard.writeText(
      (embed ? '!' : '') + '[Text](/api/media/' + sha256 + ')'
    );
    toast(l.editor.linkCopied, { type: 'success' });
  };

  async function send() {
    try {
      const formData = new FormData();
      for (const file of Object.values(uploadQueue)) {
        formData.append('file', file);
      }
      await toast.promise(
        edit(
          description.id,
          contentEnRef.current!.getMarkdown(),
          contentSvRef.current!.getMarkdown(),
          slug,
          formData
        ),
        {
          pending: l.editor.saving,
          success: l.editor.saved,
          error: l.editor.saveError
        }
      );
    } catch {
      console.log('Failed to edit group description');
    }
  }

  return (
    <>
      <h1>{l.pages.editGroupPage}</h1>
      <Divider />

      <h2>{l.pages.urlSlug}</h2>
      <TextArea value={slug} onChange={(e) => setSlug(e.target.value)} />

      <h2>{l.editor.content} (En)</h2>
      <MarkdownEditor
        defaultMd={description.contentEn}
        ref={contentEnRef}
        onUpload={dropFiles}
        locale={description.locale}
        localFiles={uploadQueue}
      />

      <h2>{l.editor.content} (Sv)</h2>
      <MarkdownEditor
        defaultMd={description.contentSv}
        ref={contentSvRef}
        onUpload={dropFiles}
        locale={description.locale}
        localFiles={uploadQueue}
      />

      <br />
      <h2>{l.editor.uploaded}</h2>
      {Object.keys(uploadQueue).length === 0 && <p>{l.editor.noFiles}</p>}
      <ul>
        {Object.entries(uploadQueue).map(([sha256, file]) => (
          <li className={styles.fileActions} key={sha256}>
            <p>{file.name}</p>{' '}
            <ActionButton type="button" onClick={() => copyFile(sha256, file)}>
              {l.editor.copyLink}
            </ActionButton>{' '}
            <ActionButton
              onClick={() => {
                delFile(sha256);
              }}
            >
              {l.general.delete}
            </ActionButton>
          </li>
        ))}
      </ul>
      <ActionButton onClick={() => fileInputRef.current!.click()}>
        {l.editor.selectFiles}
      </ActionButton>
      <input
        onChange={(e) => dropFiles(e.target.files!)}
        multiple
        ref={fileInputRef}
        type="file"
        hidden
      />

      <br />

      <br />
      <div className={styles.actions}>
        <ActionButton onClick={send}>
          {description.id !== undefined ? l.general.save : l.general.create}
        </ActionButton>
      </div>
    </>
  );
};

export default PageForm;
