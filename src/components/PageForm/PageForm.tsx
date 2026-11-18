'use client';

import { editGroupRootPage } from '@/actions/groupRootPages';
import Divider from '@/components/Divider/Divider';
import ActionButton from '@/components/ActionButton/ActionButton';
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor';
import MediaUploader from '@/components/MediaUploader/MediaUploader';
import TextArea from '@/components/TextArea/TextArea';
import { useUploadQueue } from '@/hooks/useUploadQueue';
import { useState } from 'react';
import styles from '../NewsPostForm/NewsPostForm.module.scss';
import i18nService from '@/services/i18nService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface NewPostFormProps {
  id: number;
  contentEn: string;
  contentSv: string;
  slug: string;
  locale: string;
}

const PageForm = (description: NewPostFormProps) => {
  const l = i18nService.getLocale(description.locale);
  const router = useRouter();

  const [contentEn, setContentEn] = useState(description.contentEn);
  const [contentSv, setContentSv] = useState(description.contentSv);
  const [slug, setSlug] = useState(description.slug ?? '');
  const { uploadQueue, dropFiles, removeFile } = useUploadQueue({
    locale: description.locale
  });

  async function send() {
    try {
      const formData = new FormData();
      for (const file of Object.values(uploadQueue)) {
        formData.append('file', file);
      }
      await toast.promise(
        editGroupRootPage(
          description.id,
          contentEn,
          contentSv,
          slug,
          formData
        ),
        {
          pending: l.editor.saving,
          success: l.editor.saved,
          error: l.editor.saveError
        }
      );
      router.push(`/groups/${slug}`);
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
        value={contentEn}
        onChange={setContentEn}
        onUpload={dropFiles}
        locale={description.locale}
        localFiles={uploadQueue}
        ariaLabel={`${l.editor.content} ${l.events.languages.en}`}
      />

      <h2>{l.editor.content} (Sv)</h2>
      <MarkdownEditor
        value={contentSv}
        onChange={setContentSv}
        onUpload={dropFiles}
        locale={description.locale}
        localFiles={uploadQueue}
        ariaLabel={`${l.editor.content} ${l.events.languages.sv}`}
      />

      <MediaUploader
        locale={description.locale}
        uploadQueue={uploadQueue}
        onSelect={dropFiles}
        onRemove={removeFile}
      />

      <div className={styles.actions}>
        <ActionButton onClick={send}>
          {description.id !== undefined ? l.general.save : l.general.create}
        </ActionButton>
      </div>
    </>
  );
};

export default PageForm;
