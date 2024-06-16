'use client';

import { edit } from '@/actions/groupRootPages';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import TextArea from '@/components/TextArea/TextArea';
import { useRef, useState } from 'react';
import styles from '../NewsPostForm/NewsPostForm.module.scss';
import Popup from 'reactjs-popup';
import i18nService from '@/services/i18nService';
import MarkdownView from '../MarkdownView/MarkdownView';
import FileService, { MediaType } from '@/services/fileService';
import ContentPane from '../ContentPane/ContentPane';
import { toast } from 'react-toastify';

const PreviewContentStyle = {
  backgroundColor: '#000000AA'
};
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

  const [contentEn, setContentEn] = useState(description.contentEn ?? '');
  const [contentSv, setContentSv] = useState(description.contentSv ?? '');
  const [slug, setSlug] = useState(description.slug ?? '');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContentSv, setPreviewContentSv] = useState('');
  const [previewContentEn, setPreviewContentEn] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<{
    [key: string]: File;
  }>({});

  const dropFiles = async (f: FileList) => {
    const newQueue = { ...uploadQueue };
    for (let i = 0; i < f.length; i++) {
      const file = f[i];
      if (!FileService.checkValidFile(file, validUploadTypes)) continue;

      const sha256 = await FileService.fileSha256Browser(file);
      newQueue[sha256] = file;
    }
    setUploadQueue(newQueue);
  };

  const delFile = (sha256: string) => {
    const newQueue = { ...uploadQueue };
    delete newQueue[sha256];
    setUploadQueue(newQueue);
  };

  const copyFile = (sha256: string) => {
    navigator.clipboard.writeText('[Text](/api/media/' + sha256 + ')');
    toast(l.editor.linkCopied, { type: 'success' });
  };

  function preview() {
    setPreviewContentSv(FileService.replaceLocalFiles(contentSv, uploadQueue));
    setPreviewContentEn(FileService.replaceLocalFiles(contentEn, uploadQueue));

    setShowPreview(true);
  }

  async function send() {
    try {
      const formData = new FormData();
      for (const file of Object.values(uploadQueue)) {
        formData.append('file', file);
      }
      await toast.promise(
        edit(description.id, contentEn, contentSv, slug, formData),
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
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => dropFiles(e.dataTransfer.files)}
        value={contentEn}
        onChange={(e) => setContentEn(e.target.value)}
      />

      <h2>{l.editor.content} (Sv)</h2>
      <MarkdownEditor
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => dropFiles(e.dataTransfer.files)}
        value={contentSv}
        onChange={(e) => setContentSv(e.target.value)}
      />

      <br />
      <h2>{l.editor.uploaded}</h2>
      {Object.keys(uploadQueue).length === 0 && <p>{l.editor.noFiles}</p>}
      <ul>
        {Object.entries(uploadQueue).map(([sha256, file]) => (
          <li className={styles.fileActions} key={sha256}>
            <p>{file.name}</p>{' '}
            <ActionButton
              onClick={() => {
                copyFile(sha256);
              }}
            >
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
          {description.id !== undefined ? l.general.edit : l.general.create}
        </ActionButton>
        <ActionButton onClick={preview}>{l.editor.previewAction}</ActionButton>
      </div>

      <Popup
        modal
        className={styles.dialog}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        overlayStyle={PreviewContentStyle}
      >
        <ContentPane className={styles.dialog}>
          <h1>{l.editor.preview}</h1>
          <Divider />
          <MarkdownView content={previewContentEn} />
          <Divider />
          <MarkdownView content={previewContentSv} />

          <ActionButton onClick={() => setShowPreview(false)}>
            {l.general.close}
          </ActionButton>
        </ContentPane>
      </Popup>
    </>
  );
};

export default PageForm;
